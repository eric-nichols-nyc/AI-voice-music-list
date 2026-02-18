// app/api/recommend/route.ts

import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { NextResponse } from "next/server";
import {
  capitalize,
  cleanSummary,
  getMoodWord,
} from "@/lib/recommend-utils";
import { FALLBACK_TRACKS } from "@/lib/constants";
import {
  searchSpotifyTrackExact,
  searchSpotifyTrackFallback,
} from "@/lib/spotify";
import type { PlaylistResult } from "@/types/playlist-types";
import { z } from "zod";

/**
 * Env needed:
 * - GOOGLE_GENERATIVE_AI_API_KEY=...
 * - SPOTIFY_CLIENT_ID=...
 * - SPOTIFY_CLIENT_SECRET=...
 *
 * This route:
 * 1) Takes { normalized } from client
 * 2) Uses Gemini to generate EXACTLY 5 track candidates (JSON only)
 * 3) Enriches each track via Spotify Search API (album art, preview, spotifyUrl, trackId)
 * 4) Returns PlaylistResult
 */

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: route + fallback orchestration
export async function POST(req: Request) {
  const body = await req.json();
  const n = body?.normalized ?? {};
  const moodCategory = n.moodCategory ?? "neutral";
  const anxietyScore = n.anxietyScore ?? 5;
  const anxietyBand = n.anxietyBand ?? "medium";
  const energyScore = n.energyScore ?? 5;
  const energyBand = n.energyBand ?? "medium";
  const moodWord = getMoodWord(moodCategory);

  try {

    const playlistSchema = z.object({
      playlistTitle: z.string(),
      playlistSubtitle: z.string(),
      summaryText: z.string(),
      tracks: z.array(
        z.object({
          title: z.string(),
          artist: z.string(),
          reason: z.string(),
          spotifyQuery: z.string(),
        })
      ),
    });

    // 1) Gemini returns structured object (no raw JSON parsing)
    const { object: parsed } = await generateObject({
      model: google("gemini-2.5-flash") as unknown as Parameters<
        typeof generateObject
      >[0]["model"],
      schema: playlistSchema,
      system: [
        "You are a minimal, professional music recommender.",
        "All songs must be real songs by real artists.",
        "summaryText: 1–2 sentences, calm/serious, no emojis, no diagnosing.",
        "Each reason: 1 sentence max. spotifyQuery = title + space + artist.",
      ].join(" "),
      prompt: `
User state: mood ${moodWord} (${moodCategory}), anxiety ${anxietyScore}/10 (${anxietyBand}), energy ${energyScore}/10 (${energyBand}).
Generate a playlist with EXACTLY 5 tracks. summaryText: address the user, mention mood/anxiety/energy and why you chose these tracks (calming/uplifting/steady/energizing).
`.trim(),
      maxOutputTokens: 1600,
    });

    const playlistTitle =
      parsed.playlistTitle?.trim() || `${capitalize(moodCategory)} Reset`;
    const playlistSubtitle =
      parsed.playlistSubtitle?.trim() ||
      "A short list generated from your answers.";
    const summaryText =
      cleanSummary(parsed.summaryText ?? "") ||
      `It sounds like you're feeling ${moodWord} with ${anxietyBand} anxiety and ${energyBand} energy, so I selected calming and uplifting songs with a steady pace to ease tension and lift your mood.`;

    const candidates = (parsed.tracks ?? []).filter(Boolean);
    const five = candidates
      .slice(0, 5)
      .map((t) => ({
        title: String(t.title ?? "").trim(),
        artist: String(t.artist ?? "").trim(),
        reason: String(t.reason ?? "").trim(),
        spotifyQuery: String(
          t.spotifyQuery ?? `${t.title ?? ""} ${t.artist ?? ""}`
        ).trim(),
      }))
      .filter((t) => t.title && t.artist);

    if (five.length !== 5) {
      throw new Error(
        `Model returned ${five.length} usable tracks (expected 5).`
      );
    }

    // 2) Spotify enrichment (server-side)
    const enriched = await Promise.all(
      five.map(async (t) => {
        const meta =
          (await searchSpotifyTrackExact(t.title, t.artist)) ??
          (await searchSpotifyTrackFallback(t.spotifyQuery));

        return {
          ...t,
          spotifyTrackId: meta?.id ?? null,
          spotifyUrl: meta?.spotifyUrl ?? null,
          albumImage: meta?.albumImage ?? null,
          previewUrl: meta?.previewUrl ?? null,
        };
      })
    );

    const result: PlaylistResult = {
      playlistTitle,
      playlistSubtitle,
      summaryText,
      // NOTE: Update your Track type to include optional spotifyUrl/albumImage/previewUrl/spotifyTrackId
      tracks: enriched,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.warn("Recommend: model or pipeline failed, using fallback playlist.", error);

    try {
      const fallback = buildFallbackPlaylist(
        moodCategory,
        moodWord,
        anxietyBand,
        energyBand
      );
      const enriched = await Promise.all(
        fallback.tracks.map(async (t) => {
          const meta =
            (await searchSpotifyTrackExact(t.title, t.artist)) ??
            (await searchSpotifyTrackFallback(t.spotifyQuery));
          return {
            ...t,
            spotifyTrackId: meta?.id ?? null,
            spotifyUrl: meta?.spotifyUrl ?? null,
            albumImage: meta?.albumImage ?? null,
            previewUrl: meta?.previewUrl ?? null,
          };
        })
      );
      return NextResponse.json({
        ...fallback,
        tracks: enriched,
      });
    } catch (fallbackError) {
      console.error("Error in /api/recommend:", fallbackError);
      return new Response(
        JSON.stringify({
          error: "Failed to generate recommendation",
          details:
            fallbackError instanceof Error
              ? fallbackError.message
              : "Unknown error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }
}

/* ----------------------------- helpers ----------------------------- */

function buildFallbackPlaylist(
  moodCategory: string,
  moodWord: string,
  anxietyBand: string,
  energyBand: string
): PlaylistResult {
  return {
    playlistTitle: `${capitalize(moodCategory)} Reset`,
    playlistSubtitle: "A short list generated from your answers.",
    summaryText: `It sounds like you're feeling ${moodWord} with ${anxietyBand} anxiety and ${energyBand} energy, so I selected calming and uplifting songs with a steady pace to ease tension and lift your mood.`,
    tracks: [...FALLBACK_TRACKS],
  };
}
