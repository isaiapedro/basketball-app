import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import jsonData2 from '../data/teams.json';
import { Team } from '../team';

@Component({
  selector: 'app-team-sidebar',
  imports: [
    RouterLink, 
    RouterOutlet,
    RouterLinkActive,
    MatCardModule
  ],
  template: `
      <ul>
        @for (team of teams; track team.id){
          <li>
                <h4 class="mat-title"> {{team.name}} </h4>
          </li>
        }
      </ul>
  `,

  styles: [
    `
    `,
  ],
})

export class Bio {
  
  teams: Team[] = jsonData2.teams;

}
