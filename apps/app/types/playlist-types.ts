// lib/playlist-types.ts

export type Track = {
  title: string;
  artist: string;
  reason: string; // 1 sentence
  spotifyQuery: string; // we will build the URL client-side
};

export type PlaylistResult = {
  playlistTitle: string;
  playlistSubtitle: string;
  summaryText: string; // this is what you’ll send to Deepgram TTS later
  tracks: Track[];
};
