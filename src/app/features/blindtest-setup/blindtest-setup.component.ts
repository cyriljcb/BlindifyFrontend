import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BlindtestService } from '../../core/services/blindtest.service';
import { Playlist } from '../../core/models/playlist.model';
import { firstValueFrom } from 'rxjs';

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

  async startBlindtest(): Promise<void> {
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
    
    try {
      await firstValueFrom(this.blindtestService.startBlindtest(config));
      console.log('Blindtest démarré côté backend');
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Navigation vers /play');
      this.router.navigate(['/play']);
    } catch (error: any) {
      console.error('Erreur lors du démarrage:', error);
      this.errorMessage = 'Impossible de démarrer le blindtest. Vérifiez votre connexion Spotify.';
      this.isStarting = false;
    }
  }
}