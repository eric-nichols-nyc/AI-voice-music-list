const LEADING_QUOTES = /^["'\u201C\u201D]+/;
const TRAILING_QUOTES = /["'\u201C\u201D]+$/;

export function cleanSummary(raw: string): string {
  let s = raw.trim();
  s = s
    .replace(LEADING_QUOTES, "")
    .replace(TRAILING_QUOTES, "")
    .trim();
  if (s.length < 20) {
    return "";
  }
  const last = s.slice(-1);
  if (![".", "!", "?"].includes(last)) {
    s += ".";
  }
  return s;
}

export function capitalize(s: string): string {
  if (!s) {
    return s;
  }
  return s[0].toUpperCase() + s.slice(1);
}

export function getMoodWord(moodCategory: string): string {
  switch (moodCategory) {
    case "low":
      return "sad";
    case "positive":
      return "happy";
    case "stressed":
      return "anxious";
    case "angry":
      return "frustrated";
    default:
      return "neutral";
  }
}
