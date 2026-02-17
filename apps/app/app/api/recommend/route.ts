import { NextResponse } from "next/server";
import type { PlaylistResult } from "@/types/playlist-types";

export async function POST(req: Request) {
  const body = await req.json();

  // Expecting: { normalized: { moodCategory, anxietyScore, energyScore, ... } }
  // For now we’ll just use it to slightly change the title.
  const moodCategory = body?.normalized?.moodCategory ?? "neutral";

  const result: PlaylistResult = {
    playlistTitle: `${capitalize(moodCategory)} Reset (Demo)`,
    playlistSubtitle: "A short list generated from your answers (stubbed API).",
    summaryText:
      "Thanks — based on your mood, anxiety, and energy, here’s a focused list designed to match your state and gently shift it in a better direction.",
    tracks: [
      {
        title: "Holocene",
        artist: "Bon Iver",
        reason: "Grounding and steady without feeling heavy.",
        spotifyQuery: "Holocene Bon Iver",
      },
      {
        title: "Dog Days Are Over",
        artist: "Florence + The Machine",
        reason: "Bright momentum that lifts energy.",
        spotifyQuery: "Dog Days Are Over Florence + The Machine",
      },
      {
        title: "Put Your Records On",
        artist: "Corinne Bailey Rae",
        reason: "Warm, reassuring, and easy to stay with.",
        spotifyQuery: "Put Your Records On Corinne Bailey Rae",
      },
      {
        title: "Good as Hell",
        artist: "Lizzo",
        reason: "Confidence boost with a clean upbeat pulse.",
        spotifyQuery: "Good as Hell Lizzo",
      },
      {
        title: "Weightless",
        artist: "Marconi Union",
        reason: "Soft ambient calm to reduce tension.",
        spotifyQuery: "Weightless Marconi Union",
      },
    ],
  };

  return NextResponse.json(result);
}

function capitalize(s: string) {
  if (!s) return s;
  return s[0].toUpperCase() + s.slice(1);
}
