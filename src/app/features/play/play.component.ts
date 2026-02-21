import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebSocketService } from '../../core/services/websocket.service';
import { PhaseEvent } from '../../core/models/phase-event.model';
import { Router } from '@angular/router';

interface Particle {
  emoji: string;
  x: number;
  delay: number;
  duration: number;
}

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit, OnDestroy {
  private wsService = inject(WebSocketService);
  private router = inject(Router);

  currentPhase: 'DISCOVERY' | 'REVEAL' | 'WAITING' | null = 'WAITING'; // ← Commence en WAITING
  currentTrackName = '';
  currentArtists: string[] = []; 
  currentAlbumCover = '';
  timeRemaining = 0;
  totalTracks = 0;
  currentRound = 0;
  isFinished = false;
  isConnected = false;
  isWaitingForFirstPhase = true; // ← Nouveau flag

  // Spectre audio - augmenté à 40 barres pour un cercle complet
  spectrumBars: number[] = Array(40).fill(30);
  private spectrumIntervalId: any;

  // Particules musicales flottantes
  particles: Particle[] = [];

  private intervalId: any;

  ngOnInit(): void {
    console.log('🎮 [Play] Component initialized');

    // Générer les particules
    this.generateParticles();

    this.wsService.connect();

    this.wsService.connection$.subscribe(connected => {
      console.log('🔌 [Play] Connection status:', connected);
      this.isConnected = connected;
    });

    this.wsService.phase$.subscribe(event => {
      console.log('🎵 [Play] Phase event:', event);
      this.isWaitingForFirstPhase = false; // ← Première phase reçue
      this.handlePhaseChange(event);
    });

    this.wsService.started$.subscribe(event => {
      console.log('🚀 [Play] Blindtest started:', event);
      this.totalTracks = event.totalTracks;
    });

    this.wsService.finished$.subscribe(event => {
      console.log('🏁 [Play] Blindtest finished:', event);
      this.isFinished = true;
      this.stopTimer();
      this.stopSpectrum();
    });
  }

  ngOnDestroy(): void {
    console.log('🎮 [Play] Component destroyed');
    this.stopTimer();
    this.stopSpectrum();
    this.wsService.disconnect();
  }

  private generateParticles(): void {
    const emojis = ['🎵', '🎶', '🎸', '🎹', '🎤', '🎧', '🎺', '🎷', '🥁', '🎻'];
    
    for (let i = 0; i < 15; i++) {
      this.particles.push({
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        x: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 8 + Math.random() * 4
      });
    }
  }

  private handlePhaseChange(event: PhaseEvent): void {
    this.currentPhase = event.phase;
    this.currentTrackName = event.trackName;
    this.currentArtists = event.artists || [];  
    this.currentAlbumCover = event.albumCoverUrl || '';
    this.timeRemaining = event.durationSeconds;
    this.currentRound = event.currentRound;
    this.totalTracks = event.totalRounds;

    this.startTimer();

    if (event.phase === 'DISCOVERY') {
      this.startSpectrum();
    } else {
      this.stopSpectrum();
    }
  }

  get formattedArtists(): string {
    if (this.currentArtists.length === 0) return '';
    if (this.currentArtists.length === 1) return this.currentArtists[0];
    if (this.currentArtists.length === 2) return this.currentArtists.join(' & ');
    
    const lastArtist = this.currentArtists[this.currentArtists.length - 1];
    const otherArtists = this.currentArtists.slice(0, -1).join(', ');
    return `${otherArtists} & ${lastArtist}`;
  }

  private startTimer(): void {
    this.stopTimer();

    this.intervalId = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
      } else {
        this.stopTimer();
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Animation du spectre audio avec variations plus réalistes
  private startSpectrum(): void {
    this.stopSpectrum();
    
    this.spectrumIntervalId = setInterval(() => {
      this.spectrumBars = this.spectrumBars.map((_, index) => {
        // Variation plus naturelle avec une base + oscillation
        const base = 30 + Math.sin(Date.now() / 1000 + index) * 20;
        const variation = Math.random() * 60;
        return base + variation;
      });
    }, 80); // Plus rapide pour plus de fluidité
  }

  private stopSpectrum(): void {
    if (this.spectrumIntervalId) {
      clearInterval(this.spectrumIntervalId);
      this.spectrumIntervalId = null;
      this.spectrumBars = Array(40).fill(30);
    }
  }

  // Calcul de la position circulaire pour chaque barre
  getBarTransform(index: number, height: number): string {
    const totalBars = this.spectrumBars.length;
    const angle = (index / totalBars) * 360;
    const radius = 140; // Distance du centre
    
    return `rotate(${angle}deg) translateY(-${radius}px)`;
  }

  goBack(): void {
    this.router.navigate(['/playlists']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}