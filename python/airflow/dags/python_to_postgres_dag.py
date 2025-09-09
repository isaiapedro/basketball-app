from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from datetime import datetime

# Importing the functions from the teams module
from scripts.teams import get_nba_teams, transform, load_to_postgres

# Defining the DAG

with DAG(
    dag_id="json_to_postgres_etl_pipeline",
    start_date=datetime(2025, 8, 23),
    catchup=False,
    tags=['ETL', 'PostgreSQL', 'Python'],
    doc_md="""
    ### Json to PostgreSQL ETL Pipeline
    This DAG uses PythonOperators to orchestrate the ETL process,
    providing better visibility and control over each step.
    """
) as dag:

    # Task to extract data from web pages
    extract_task = PythonOperator(
        task_id="extract_web_pages",
        python_callable=get_nba_teams,
    )

    # Task to transform the extracted data
    transform_task = PythonOperator(
        task_id="transform_data",
        python_callable=transform,
    )

    # Task to load the transformed data into PostgreSQL
    load_task = PythonOperator(
        task_id="load_to_postgres",
        python_callable=load_to_postgres,
    )

    # A simple notification task to confirm successful completion.
    etl_finished = BashOperator(
        task_id="etl_finished_successfully",
        bash_command="echo 'ETL pipeline finished successfully!'"
    )

    # Setting up task dependencies
    extract_task >> transform_task >> load_task >> etl_finished
