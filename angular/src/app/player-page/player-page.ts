import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import jsonData from '../data/active_players.json';
import { Player } from '../player';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'player-page',
  imports: [
    RouterLink, 
    RouterOutlet,
    RouterLinkActive,
    MatCardModule,
    NgbCarouselModule
  ],
  template: 
  `
    <div class="search-container">
      <input
            type="text"
            placeholder="Search for Player..."
            (input)="onSearch($event)">

      <section class="playersResult">
        @if (players.length<1 && hasQuery!){
          <p>Sorry, nothing found</p>
        }
        @for (player of filteredPlayers; track player.index){
          @if (player.index > 0){
          <li>
            <a
              [routerLink]="['/player-page/player', player.index]"
              routerLinkActive="active-link">
                <h4 class="mat-title"> {{player.name}} </h4>
            </a>
          </li>
          }
        }
      </section>
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

export class PlayerPage {
  
  players: Player[] = jsonData.players;

  hasQuery: Boolean = false;

  filteredPlayers: Player[] = [];
  
  onSearch(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();

    this.hasQuery = searchTerm.length > 0;

    if (!this.hasQuery) {
      // Se a busca estiver vazia, limpa a lista de resultados.
      this.filteredPlayers = [];
    } else {
      // Caso contrário, filtra os jogadores com base no termo de busca.
      this.filteredPlayers = this.players.filter(player =>
        player.name.toLowerCase().includes(searchTerm)
      );
    }
  }
}
