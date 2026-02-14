export interface PhaseEvent {
  phase: 'DISCOVERY' | 'REVEAL' | 'WAITING';
  trackId: string;
  trackName: string;
  durationSeconds: number;
  timestamp: number;
}