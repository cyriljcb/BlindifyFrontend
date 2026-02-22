import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BlindtestService } from '../../core/services/blindtest.service';
import { Playlist } from '../../core/models/playlist.model';

@Component({
  selector: 'app-blindtest-setup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blindtest-setup.component.html',
  styleUrl: './blindtest-setup.component.scss'
})
export class BlindtestSetupComponent implements OnInit {
  private router = inject(Router);
  private blindtestService = inject(BlindtestService);

  playlists: Playlist[] = [];
  selectedPlaylistId = '';
  isLoadingPlaylists = true;
  isStarting = false;
  errorMessage = '';

  questionCount = 10;
  discoverTime = 20; 
  revealTime = 20;

  ngOnInit(): void {
    this.loadPlaylists();
  }

  private loadPlaylists(): void {
    this.blindtestService.getPlaylists().subscribe({
      next: (data) => {
        this.playlists = data;
        this.isLoadingPlaylists = false;
        
        if (this.playlists.length > 0) {
          this.selectedPlaylistId = this.playlists[0].id;
        }
      },
      error: (err) => {
        console.error('Erreur chargement playlists:', err);
        this.isLoadingPlaylists = false;
      }
    });
  }

  selectPlaylist(playlistId: string): void {
    this.selectedPlaylistId = playlistId;
  }

  setQuestionCount(count: number): void {
    this.questionCount = count;
  }

  updateDiscoverTime(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.discoverTime = parseInt(input.value);
  }

  updateRevealTime(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.revealTime = parseInt(input.value);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  startBlindtest(): void {
    if (!this.selectedPlaylistId) {
      alert('Veuillez sélectionner une playlist');
      return;
    }

    if (this.isStarting) return;
    
    this.isStarting = true;
    this.errorMessage = '';

    const config = {
      playlistId: this.selectedPlaylistId,
      tracks: this.questionCount,
      revealTimeSec: this.revealTime,
      discoveryTimeSec: this.discoverTime
    };
    
    console.log('Démarrage du blindtest avec config:', config);
    
    this.blindtestService.startBlindtest(config).subscribe({
      next: () => {
        console.log('Blindtest démarré côté backend');
      },
      error: (error: any) => {
        console.error('Erreur lors du démarrage:', error);
        if (this.router.url === '/setup') {
          this.errorMessage = 'Impossible de démarrer le blindtest. Vérifiez votre connexion Spotify.';
          this.isStarting = false;
        }
      }
    });
    
    this.router.navigate(['/play']);
  }
}