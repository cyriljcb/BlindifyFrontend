import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { PlaylistsComponent } from './features/playlists/playlists.component';
import { BlindtestSetupComponent } from './features/blindtest-setup/blindtest-setup.component';
import { authGuard } from './core/guards/auth.guard';
import { PlaylistTracksComponent } from './features/playlist-tracks/playlist-tracks.component';
import { playlistTracksResolver } from './core/resolvers/playlists.resolver';
import { PlayComponent } from './features/play/play.component';

export const routes: Routes = [
    {path:'',component:HomeComponent},
    {path:'playlists',component:PlaylistsComponent},
    {path:'setup',component:BlindtestSetupComponent, canActivate: [authGuard]},
    {
        path: 'playlists/:playlistId',
        component: PlaylistTracksComponent,
        resolve: {
            tracks: playlistTracksResolver
        }
    },
    { path: 'play', component: PlayComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: '' }
];
