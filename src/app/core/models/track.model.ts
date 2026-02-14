export interface Track {
  id: string;
  name: string;
  artistNames: string[];
  durationMs: number;
  releaseYear: string;
  imageUrl: string | null;
}
