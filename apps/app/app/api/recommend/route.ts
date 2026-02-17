import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";
import type { PlaylistResult } from "@/types/playlist-types";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY, // or switch to GOOGLE_GENERATIVE_AI_API_KEY
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const n = body?.normalized ?? {};

    const moodCategory = n.moodCategory ?? "neutral";
    const anxietyScore = n.anxietyScore ?? 5;
    const anxietyBand = n.anxietyBand ?? "medium";
    const energyScore = n.energyScore ?? 5;
    const energyBand = n.energyBand ?? "medium";

    const moodWord =
      moodCategory === "low"
        ? "sad"
        : moodCategory === "positive"
          ? "happy"
          : moodCategory === "stressed"
            ? "anxious"
            : moodCategory === "angry"
              ? "frustrated"
              : "neutral";

    const { text: raw } = await generateText({
      model: google("gemini-2.5-flash"),
      system:
        "You are a minimal, professional music recommender. " +
        "Write 1–2 sentences. No emojis. Do not diagnose. " +
        "Use empathetic-but-neutral language (e.g., 'It sounds like...').",
      prompt: `
User state:
- mood: ${moodWord} (category: ${moodCategory})
- anxiety: ${anxietyScore}/10 (${anxietyBand})
- energy: ${energyScore}/10 (${energyBand})

Write a short summary addressed to the user:
- Mention mood + anxiety + energy explicitly.
- Say what kind of songs you selected (calming, uplifting, steady, energizing).
- Keep it concrete and natural (like: "I understand you're feeling sad and anxious...").
`,
      maxOutputTokens: 120,
    });

    const summaryText =
      cleanSummary(raw ?? "") ||
      `It sounds like you're feeling ${moodWord} with ${anxietyBand} anxiety and ${energyBand} energy, so I selected calming and uplifting songs with a steady pace to ease tension and lift your mood.`;

    const result: PlaylistResult = {
      playlistTitle: `${capitalize(moodCategory)} Reset`,
      playlistSubtitle: "A short list generated from your answers.",
      summaryText,
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
  } catch (error) {
    console.error("Error in recommend route:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate recommendation",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

function capitalize(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

function cleanSummary(raw: string): string {
  let s = raw.trim();
  s = s
    .replace(/^["'“”]+/, "")
    .replace(/["'“”]+$/, "")
    .trim();
  if (s.length < 20) return "";
  const last = s.slice(-1);
  if (![".", "!", "?"].includes(last)) s += ".";
  return s;
}
