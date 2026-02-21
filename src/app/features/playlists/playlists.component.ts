import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BlindtestService } from '../../core/services/blindtest.service';
import { Playlist } from '../../core/models/playlist.model';

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
  private blindtestService = inject(BlindtestService);

  playlists: Playlist[] = [];
  isLoading = true;
  errorMessage = '';
  mode: 'browse' | 'play' = 'browse';

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.mode = params['mode'] || 'browse';
    });

    this.loadPlaylists();
  }

  loadPlaylists(): void {
    this.isLoading = true;
    this.blindtestService.getPlaylists().subscribe({
      next: (data: Playlist[]) => {
        this.playlists = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Impossible de charger vos playlists';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  selectPlaylist(playlist: Playlist): void {
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