import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    RouterLinkActive
    ],
  template: `
    <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
      <div class="container-fluid">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" routerLink="team-page">Teams</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" routerLink="player-page">Players</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" routerLink="predictor">MVP Guesser</a>
          </li>
        </ul>
      </div>
    </nav>

    <main class="content">
        <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      /* Remove a altura fixa do body para evitar barras de rolagem duplas */
      :host {
        display: flex;
        flex-direction: column;
        height: 100vh;
        overflow: hidden; /* Impede a rolagem no nível da página */
      }

      .navbar {
        flex-shrink: 0; /* Impede que a navbar encolha */
      }
        
      .content {
        background-color: #14213d;
        flex-grow: 1;
        display: flex;
        overflow: hidden;
      }
      a {
        margin-left: 15px;
      }
    `,
  ],
})

export class App {

}
