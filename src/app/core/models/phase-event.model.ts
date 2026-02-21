export interface PhaseEvent {
  phase: 'DISCOVERY' | 'REVEAL' | 'WAITING';
  trackId: string;
  trackName: string;
  artists?: string[];
  albumCoverUrl?: string;
  durationSeconds: number;
  currentRound: number;
  totalRounds: number;
  timestamp: number;
}