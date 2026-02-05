import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { PlaylistsComponent } from './features/playlists/playlists.component';
import { BlindtestSetupComponent } from './features/blindtest-setup/blindtest-setup.component';

export const routes: Routes = [
    {path:'',component:HomeComponent},
    {path:'playlists',component:PlaylistsComponent},
    {path:'setup',component:BlindtestSetupComponent},
    { path: '**', redirectTo: '' }
];
