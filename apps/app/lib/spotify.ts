// lib/spotify.ts

export function spotifySearchUrl(query: string) {
  return `https://open.spotify.com/search/${encodeURIComponent(query)}`;
}

let cachedToken: { accessToken: string; expiresAt: number } | null = null;

export async function getSpotifyAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.accessToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!(clientId && clientSecret)) {
    throw new Error("Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET.");
  }

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Spotify token failed: ${res.status} ${errText}`);
  }

  const data = await res.json();
  const accessToken = data.access_token as string;
  const expiresIn = (data.expires_in as number) ?? 3600;
  cachedToken = {
    accessToken,
    expiresAt: Date.now() + (expiresIn - 30) * 1000,
  };
  return accessToken;
}

export type SpotifyTrackMeta = {
  id: string;
  spotifyUrl: string | undefined;
  previewUrl: string | null;
  albumImage: string | undefined | null;
};

async function searchTrack(query: string): Promise<SpotifyTrackMeta | null> {
  const token = await getSpotifyAccessToken();
  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Spotify search failed: ${res.status} ${errText}`);
  }

  const data = await res.json();
  const track = data?.tracks?.items?.[0];
  if (!track) {
    return null;
  }

  return {
    id: track.id as string,
    spotifyUrl: track.external_urls?.spotify as string | undefined,
    previewUrl: (track.preview_url as string | null) ?? null,
    albumImage: (track.album?.images?.[0]?.url as string | undefined) ?? null,
  };
}

export function searchSpotifyTrackExact(
  title: string,
  artist: string
): Promise<SpotifyTrackMeta | null> {
  const q = `track:${title} artist:${artist}`;
  return searchTrack(q);
}

export function searchSpotifyTrackFallback(
  spotifyQuery: string
): Promise<SpotifyTrackMeta | null> {
  return searchTrack(spotifyQuery);
}
