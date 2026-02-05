export interface Playlist {
  id: string;
  name: string;
  description?: string;
  image?: string;
  tracks: number;
  owner: string;
}