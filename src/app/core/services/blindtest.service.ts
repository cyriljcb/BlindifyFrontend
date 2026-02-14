import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Playlist } from '../models/playlist.model';
import { Track } from '../models/track.model';

interface BlindtestConfig {
  playlistId: string;
  tracks: number;
  revealTimeSec: number;     
  discoveryTimeSec: number;   
}

@Injectable({
  providedIn: 'root'
})
export class BlindtestService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/blindtest';

  getPlaylists(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(`${this.apiUrl}/playlists`);
  }

   getPlaylistTracks(playlistId: string): Observable<Track[]> {
    return this.http.get<Track[]>(`${this.apiUrl}/playlists/${playlistId}/tracks`);
  }

  startBlindtest(config: BlindtestConfig): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/start`, config);
  }
}