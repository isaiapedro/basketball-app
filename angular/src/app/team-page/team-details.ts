import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import jsonData from '../data/active_players.json';
import jsonData2 from '../data/teams.json';
import { Player } from '../player';
import { Team } from '../team';

@Component({
  selector: 'app-team-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule
  ],
  template: `
    <div class="details-content-wrapper">
      @if (teamData){
      <div class="content-container">
        <h1>{{ teamData.name }} Roster</h1>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Pos</th>
                <th>PTS</th>
                <th>AST</th>
                <th>REB</th>
                <th>STL</th>
                <th>BLK</th>
                <th>GP</th>
                <th>Min</th>
                <th>TO</th>
                <th>FG%</th>
                <th>3P%</th>
              </tr>
            </thead>
            <tbody>
              @for (player of players; track player.index){
                @if (player.Team == teamData.Team){
                  <tr>
                    <td>{{ player.name }}</td>
                    <td>{{ player.Age }}</td>
                    <td>{{ player.Pos }}</td>
                    <td>{{ player.PTS }}</td>
                    <td>{{ player.AST }}</td>
                    <td>{{ player.TRB }}</td>
                    <td>{{ player.STL }}</td>
                    <td>{{ player.BLK }}</td>
                    <td>{{ player.G }}</td>
                    <td>{{ player.MP }}</td>
                    <td>{{ player.TOV }}</td>
                    <td>{{ player.FG_per }}</td>
                    <td>{{ player.threeP_per }}</td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      </div>
      } @else {
        <div class="placeholder">
          <img src="logo.gif" id='gif' alt="APP Logo">
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        width: 100%;
        height: 100%;
        display: flex;
      }

      .details-content-wrapper {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        padding: 20px;
        box-sizing: border-box;
        border-radius: 5px;
        overflow: hidden;
        align-items: center;
        justify-content: center;
      }
      .content-container{
        display: flex;
        flex-direction: column;
        background-color: #E6E49F; 
        width: 100%;
        height: 100%;
        padding: 20px;
        box-sizing: border-box;
        border-radius: 5px;
        overflow: hidden;
        align-items: center;
        justify-content: center;
      }
      h1{
        flex-shrink: 0;
        margin-bottom: 15px;
        color: #333;
        font-weight: 550;
        align-self: flex-start;
      }

      .table-container{
        flex-grow: 1;
        overflow-y: auto;
        border: 1px solid #ddd;
        border-radius: 5px;
        width: 100%;
      }
      
      table{
        width: 100%;
        border-collapse: collapse;
      }

      th, td {
        padding: 12px 15px;
        text-align: left;
        border-bottom: 1px solid #ddd;
        font-size: 18px;
      }

      thead th {
        background-color: #14213d;
        color: #fff;
        position: sticky;
        top: 0;
        z-index: 1;
      }

      tbody tr:nth-child(even) {
        background-color: #f9f9f9;
      }

      tbody tr:hover {
        background-color: #f1f1f1;
      }

      .placeholder {
        background: none;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      }

      .placeholder img {
        width: 400px;
        height: auto;
        opacity: 40%;
        image-rendering: smooth;
      }
    `,
  ],
})
export class TeamDetails implements OnInit {
  players: Player[] = jsonData.players;
  teams: Team[] = jsonData2.teams;
  
  teamData: Team | undefined; 

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.has('id')) {
        const teamId = Number(params.get('id'));
        this.teamData = this.teams.find(team => team.id == teamId);
      } else {
        this.teamData = undefined;
      }
    });
  }
}