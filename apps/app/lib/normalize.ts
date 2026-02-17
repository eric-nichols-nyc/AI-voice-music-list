export type MoodCategory =
  | "positive"
  | "low"
  | "stressed"
  | "angry"
  | "neutral";

export type Band = "low" | "medium" | "high";

export type NormalizedAnswers = {
  moodLabel: string;
  moodCategory: MoodCategory;
  anxietyScore: number;
  anxietyBand: Band;
  energyScore: number;
  energyBand: Band;
};

function clamp(num: number, min: number, max: number) {
  return Math.max(min, Math.min(max, num));
}

function scoreToBand(score: number): Band {
  if (score <= 3) return "low";
  if (score <= 6) return "medium";
  return "high";
}

function normalizeMood(input: string) {
  const mood = input.trim().toLowerCase();

  const map: Record<string, MoodCategory> = {
    // positive
    happy: "positive",
    good: "positive",
    great: "positive",
    excited: "positive",
    grateful: "positive",
    hopeful: "positive",

    // low
    sad: "low",
    low: "low",
    depressed: "low",
    blue: "low",
    down: "low",

    // stressed
    anxious: "stressed",
    stressed: "stressed",
    tense: "stressed",
    overwhelmed: "stressed",
    worried: "stressed",

    // angry
    angry: "angry",
    mad: "angry",
    frustrated: "angry",
    irritated: "angry",

    // neutral
    ok: "neutral",
    fine: "neutral",
    meh: "neutral",
    normal: "neutral",
    neutral: "neutral",
  };

  return {
    moodLabel: mood,
    moodCategory: map[mood] ?? "neutral",
  };
}

function normalizeAnxiety(input: string) {
  const value = input.trim().toLowerCase();

  let score: number;

  // number?
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    const wordMap: Record<string, number> = {
      low: 3,
      medium: 5,
      high: 8,
      anxious: 7,
      stressed: 7,
      panicked: 9,
      calm: 2,
    };

    score = wordMap[value] ?? 5; // default to medium
  } else {
    score = clamp(numeric, 1, 10);
  }

  return {
    anxietyScore: score,
    anxietyBand: scoreToBand(score),
  };
}

function normalizeEnergy(input: string) {
  const value = input.trim().toLowerCase();

  let score: number;

  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    const wordMap: Record<string, number> = {
      low: 3,
      medium: 5,
      high: 8,
      tired: 2,
      exhausted: 1,
      wired: 9,
      energized: 8,
    };

    score = wordMap[value] ?? 5;
  } else {
    score = clamp(numeric, 1, 10);
  }

  return {
    energyScore: score,
    energyBand: scoreToBand(score),
  };
}

export function normalizeAll(answers: {
  mood?: string;
  anxiety?: string;
  energy?: string;
}): NormalizedAnswers {
  if (!(answers.mood && answers.anxiety && answers.energy)) {
    throw new Error("Missing answers for normalization");
  }

  const mood = normalizeMood(answers.mood);
  const anxiety = normalizeAnxiety(answers.anxiety);
  const energy = normalizeEnergy(answers.energy);

  return {
    ...mood,
    ...anxiety,
    ...energy,
  };
}
