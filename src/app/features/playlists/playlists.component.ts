import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../../core/services/spotify.service';

@Component({
  selector: 'app-playlists',
  standalone: true,
  imports: [],
  templateUrl: './playlists.component.html',
  styleUrl: './playlists.component.scss'
})
export class PlaylistsComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private spotifyService = inject(SpotifyService);

  playlists: any[] = [];
  isLoading = true;
  errorMessage = '';
  mode: 'browse' | 'play' = 'browse'; // Mode par défaut

  ngOnInit(): void {
    // Récupérer le mode depuis les query params
    this.route.queryParams.subscribe(params => {
      this.mode = params['mode'] || 'browse';
    });

    this.loadPlaylists();
  }

  loadPlaylists(): void {
    this.isLoading = true;
    this.spotifyService.getUserPlaylists().subscribe({
      next: (data) => {
        this.playlists = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Impossible de charger vos playlists';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  selectPlaylist(playlist: any): void {
    if (this.mode === 'play') {
      // Parcours jeu : aller vers Setup avec la playlist sélectionnée
      this.router.navigate(['/setup'], { 
        queryParams: { playlistId: playlist.id } 
      });
    } else {
      // Parcours consultation : aller vers Tracks
      this.router.navigate(['/tracks', playlist.id]);
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  retry(): void {
    this.errorMessage = '';
    this.loadPlaylists();
  }
}