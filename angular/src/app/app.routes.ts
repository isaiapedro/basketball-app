import { Routes } from '@angular/router';
import { PlayerPage } from './player-page/player-page';
import { Predictor } from './predictor/predictor';
import { TeamDetails } from './team-page/team-details';
import { TeamSidebar } from './team-page/team-sidebar';
import { Bio } from './bio/bio';

export const routes: Routes = [
    { path: "", redirectTo: "team-page", pathMatch: "full" },
    {
        path: 'team-page',
        component: TeamSidebar,
        children: [
            {
                path: '',
                component: TeamDetails,
            },
            {
                path: ':id',
                component: TeamDetails,
                children:  [
                    {
                        path: '',
                        component: Bio,
                    },
                    {
                        path: 'player/:id',
                        component: Bio,
                    },
                ]
            },
        ]
    },
    {
        path: 'player-page',
        component: PlayerPage,
        children: [
            {
                path: '',
                component: Bio,
            },
            {
                path: 'player/:id',
                component: Bio,
            },
        ]
    },
    {
        path: 'predictor',
        component: Predictor,
    }
];
