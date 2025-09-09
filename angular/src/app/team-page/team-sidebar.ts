import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import jsonData2 from '../data/teams.json';
import { Team } from '../team';
import { TeamDetails } from './team-details';

@Component({
  selector: 'app-team-sidebar',
  imports: [
    RouterLink, 
    RouterOutlet,
    RouterLinkActive,
    MatCardModule, 
    TeamDetails
  ],
  template: `
    <nav class="menu">
      <div class="search-container">
        <input
          type="text"
          placeholder="Search for Team..."
          (input)="onSearch($event)">
      </div>

      <ul>
        @for (team of filteredTeams; track team.id){
          <li>
            <a
              [routerLink]="['/team-page', team.id]"
              routerLinkActive="active-link">
                <h4 class="mat-title"> {{team.name}} </h4>
            </a>
          </li>
        }
      </ul>
    </nav>

    <div class="details-container">
      <router-outlet></router-outlet>
    </div>
  `,

  styles: [
    `
      :host{
        display: flex;
        width: 100%;
        height: 100%;
        padding: 20px;
        gap: 20px;
        box-sizing: border-box;
      }

      .menu{
        flex: 1;
        background-color: #989C94;
        border-radius: 5px;
        overflow-y: auto;
        padding: 10px;
        display: flex;
        flex-direction: column;
      }

      .search-container{
        padding: 0;
        margin-bottom: 10px;
      }
      
      .search-container input{
        width: 100%;
        padding: 10px 4px;
        padding-left: 15px;
        border-radius: 5px;
        border: 1px solid #ccc;
        box-sizing: border-box;
      }

      .details-container{
        flex: 3;
        display: flex;
        overflow: hidden;
      }
      
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        overflow-y: auto;
        flex-grow: 1;

        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      h4.mat-title{
        background-color: #fff;
        border-radius: 8px;
        padding: 10px 15px;
        text-align: center;
        margin: 0;
        font-weight: 550;
        font-size: 27px;
        transition: background-color 0.2s ease-in-out;
      }
      
      a {
        display: block;
        padding: 0;
        text-decoration: none;
        color: #14213d;
        border-radius: 4px; 
        }

      a:hover h4{
        background-color: rgba(0,0,0,0.1)};
      }

      .active-link h4{
        background-color: #14213;
        color: #fff;
      }
    `,
  ],
})

export class TeamSidebar {
  
  teams: Team[] = jsonData2.teams;
  filteredTeams: Team[] = [];

  ngOnInit(): void {

    this.filteredTeams = this.teams;

  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    const searchTerm = target.value.toLowerCase();

    this.filteredTeams = this.teams.filter(team =>
      team.name.toLowerCase().includes(searchTerm)
    );
  }
}
