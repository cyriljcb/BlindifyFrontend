import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { BlindtestService } from '../services/blindtest.service';
import { Track } from '../models/track.model';

export const playlistTracksResolver: ResolveFn<Track[]> = (route) => {
  const blindtestService = inject(BlindtestService);

  const playlistId = route.paramMap.get('playlistId');
  if (!playlistId) {
    throw new Error('playlistId manquant dans la route');
  }

  return blindtestService.getPlaylistTracks(playlistId);
};
