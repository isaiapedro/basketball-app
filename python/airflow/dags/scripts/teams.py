import pandas as pd
import cloudscraper
import logging
from datetime import datetime
import requests
from bs4 import BeautifulSoup

# Logging configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)


def get_nba_teams(**kwargs):
    """
    Scrapes NBA team data from basketball-reference.com and returns a DataFrame.
    Pushes the DataFrame to XComs as JSON.
    """
    ti = kwargs['ti']

    year = datetime.now().year - 2

    scraper = cloudscraper.create_scraper()

    team_stats_url = "https://www.basketball-reference.com/leagues/NBA_{}_standings.html"
    url = team_stats_url.format(year)

    logging.info(f"Scraping data for the year: {year}")

    try:
        data = scraper.get(url)
        data.raise_for_status()  # Raise an exception for HTTP errors
    except requests.exceptions.RequestException as e:
        logging.error(f"Failed to fetch data from URL: {e}")
        raise

    dfs = []
    soup = BeautifulSoup(data.text, "html.parser")

    # Extract the table for the Eastern Conference
    team_table_e = soup.find(id="div_confs_standings_E")
    if team_table_e:
        team_e = pd.read_html(str(team_table_e))[0]
        team_e['Year'] = year
        team_e['Team'] = team_e["Eastern Conference"]
        del team_e['Eastern Conference']
        dfs.append(team_e)
        logging.info("Extracted data for Eastern Conference.")
    else:
        logging.warning("Could not find table for Eastern Conference.")

    # Extract the table for the Western Conference
    team_table_w = soup.find(id="div_confs_standings_W")
    if team_table_w:
        team_w = pd.read_html(str(team_table_w))[0]
        team_w['Year'] = year
        team_w['Team'] = team_w["Western Conference"]
        del team_w['Western Conference']
        dfs.append(team_w)
        logging.info("Extracted data for Western Conference.")
    else:
        logging.warning("Could not find table for Western Conference.")

    if not dfs:
        logging.error("No data could be extracted.")
        raise ValueError("Scraping failed, no conference tables found.")

    teams = pd.concat(dfs, ignore_index=True)

    # Convert 'W' column to numeric and drop rows with NaN in 'W'
    teams["W"] = pd.to_numeric(teams["W"], errors="coerce")
    teams = teams.dropna(axis=0, subset=['W'])

    # Push the DataFrame to XComs as JSON
    ti.xcom_push(key='extracted_data', value=teams.to_json())


def transform(**kwargs):
    """
    Applies transformations to the data pulled from XComs.
    """
    ti = kwargs['ti']
    extracted_data = ti.xcom_pull(task_ids='get_nba_data', key='extracted_data')

    if not extracted_data:
        logging.error("No data received from XComs. Halting transformation.")
        return

    df = pd.read_json(extracted_data)
    logging.info(f"Applying transformations to {len(df)} rows...")

    # 1. Convert all column names to lowercase and strip whitespace
    df.columns = [col.strip().lower().replace(' ', '_') for col in df.columns]
    df.dropna(how='all', inplace=True)

    # 2. Sort the DataFrame by 'team' column in ascending order
    df = df.sort_values(by='team', ascending=True)

    # 3. Reset the index of the DataFrame
    df.reset_index(drop=True, inplace=True)

    logging.info("Data transformed, sorted by team name, and indices reset.")

    # Push the transformed DataFrame to XComs as JSON
    ti.xcom_push(key='transformed_data', value=df.to_json())


def load_to_postgres(**kwargs):
    """
    Loads transformed data into a PostgreSQL database.
    """
    ti = kwargs['ti']
    transformed_data_json = ti.xcom_pull(task_ids='transform_nba_data', key='transformed_data')
    
    if not transformed_data_json:
        logging.error("No data received from XComs. Halting extraction.")
        return

    df = pd.read_json(transformed_data_json)

    from airflow.providers.postgres.hooks.postgres import PostgresHook
    pg_hook = PostgresHook(postgres_conn_id='postgres_default')
    table_name = "nba_team_standings"

    try:
        logging.info(f"Loading {len(df)} rows into '{table_name}'...")
        pg_hook.insert_rows(
            table=table_name,
            rows=df.to_records(index=False).tolist(),
            target_fields=df.columns.tolist()
        )
        logging.info(f"Successfully loaded data into '{table_name}'.")
    except Exception as e:
        logging.error(f"Failed to load data into '{table_name}': {e}")
