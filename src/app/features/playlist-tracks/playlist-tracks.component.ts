import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Track } from '../../core/models/track.model';

@Component({
  selector: 'app-playlist-tracks',
  standalone: true,
  templateUrl: './playlist-tracks.component.html',
  styleUrls: ['./playlist-tracks.component.scss']
})
export class PlaylistTracksComponent {

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  tracks: Track[] = this.route.snapshot.data['tracks'] || [];

  formatDuration(ms: number): string {
    if (!ms) return '0:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  goBack(): void {
    this.router.navigate(['/playlists']);
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }
}