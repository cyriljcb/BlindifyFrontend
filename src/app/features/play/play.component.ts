import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebSocketService } from '../../core/services/websocket.service';
import { PhaseEvent } from '../../core/models/phase-event.model';
import { Router } from '@angular/router';

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

  currentPhase: 'DISCOVERY' | 'REVEAL' | 'WAITING' | null = null;
  currentTrackName = '';
  timeRemaining = 0;
  totalTracks = 0;
  isFinished = false;
  isConnected = false;

  private intervalId: any;

  ngOnInit(): void {
    console.log('🎮 [Play] Component initialized');

    // Connexion WebSocket
    this.wsService.connect();

    // Écoute l'état de connexion
    this.wsService.connection$.subscribe(connected => {
      console.log('🔌 [Play] Connection status:', connected);
      this.isConnected = connected;
    });

    // Écoute les changements de phase
    this.wsService.phase$.subscribe(event => {
      console.log('🎵 [Play] Phase event:', event);
      this.handlePhaseChange(event);
    });

    // Écoute le démarrage
    this.wsService.started$.subscribe(event => {
      console.log('🚀 [Play] Blindtest started:', event);
      this.totalTracks = event.totalTracks;
    });

    // Écoute la fin
    this.wsService.finished$.subscribe(event => {
      console.log('🏁 [Play] Blindtest finished:', event);
      this.isFinished = true;
      this.stopTimer();
    });
  }

  ngOnDestroy(): void {
    console.log('🎮 [Play] Component destroyed');
    this.stopTimer();
    this.wsService.disconnect();
  }

  private handlePhaseChange(event: PhaseEvent): void {
    this.currentPhase = event.phase;
    this.currentTrackName = event.trackName;
    this.timeRemaining = event.durationSeconds;

    // Démarre le compte à rebours
    this.startTimer();
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

  goBack(): void {
    this.router.navigate(['/playlists']);
  }
}