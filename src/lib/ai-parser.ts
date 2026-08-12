import { ParsedRequirement, ServiceCategory } from "./types";
import { LANGUAGES, SKILLS } from "./constants";

const CARE_TYPE_KEYWORDS: Record<ServiceCategory, string[]> = {
  "elderly-care": [
    "elderly", "old", "father", "mother", "grandmother", "grandfather",
    "grandma", "grandpa", "senior", "aged", "companion", "daily assistance",
    "walking", "mobility", "feeding", "bathing", "grooming", "medicine reminder",
  ],
  "patient-care": [
    "patient", "bedridden", "post-surgery", "post hospitalization", "hospitalization",
    "recovery", "attendant", "overnight", "day-care", "sick", "ill", "bedridden",
    "surgery", "recovering",
  ],
  "hospital-assistance": [
    "hospital", "doctor", "appointment", "clinic", "medical visit", "accompany",
    "pick up", "return home", "wait", "medicine collection", "report collection",
    "apollo", "diagnostic",
  ],
};

const SKILL_KEYWORDS: Record<string, string[]> = {
  "Mobility assistance": ["mobility", "walking", "walker", "wheelchair", "move"],
  "Medicine reminders": ["medicine", "medication", "pill", "drug", "reminder"],
  "Feeding assistance": ["feeding", "feed", "meal", "eat", "food"],
  "Bathing & grooming": ["bathing", "bath", "grooming", "hygiene", "shower"],
  "Companion care": ["companion", "company", "lonely", "talk", "conversation"],
  "Post-surgery care": ["post-surgery", "surgery", "operation", "recovering"],
  "Bedridden care": ["bedridden", "bed bound", "bed-ridden", "cannot walk"],
  "Hospital accompaniment": ["hospital", "doctor", "appointment", "clinic", "accompany"],
  "Overnight care": ["overnight", "night", "12 hour", "24 hour", "through the night"],
  "Dementia care": ["dementia", "alzheimer", "memory", "confusion"],
  "Diabetes management": ["diabetes", "sugar", "insulin", "diabetic"],
  "Physiotherapy support": ["physiotherapy", "physio", "exercise", "rehabilitation"],
};

function extractAge(text: string): number | null {
  const patterns = [
    /(\d{1,3})[- ]?year[- ]?old/i,
    /age[d]?\s+(\d{1,3})/i,
    /(\d{1,3})\s+years?\s+old/i,
    /(\d{2})\s+(?:year|yr)/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const age = parseInt(match[1], 10);
      if (age > 0 && age < 120) return age;
    }
  }
  return null;
}

function extractDate(text: string): string | null {
  const today = new Date();
  const lower = text.toLowerCase();

  if (lower.includes("today")) {
    return today.toISOString().split("T")[0];
  }
  if (lower.includes("tomorrow")) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  }

  const datePatterns = [
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/,
    /(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*(\d{0,4})?/i,
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      try {
        const parsed = new Date(match[0]);
        if (!isNaN(parsed.getTime())) {
          return parsed.toISOString().split("T")[0];
        }
      } catch {
        // continue
      }
    }
  }
  return null;
}

function extractTime(text: string): string | null {
  const patterns = [
    /(\d{1,2})\s*:\s*(\d{2})\s*(am|pm)?/i,
    /(\d{1,2})\s*(am|pm)/i,
    /from\s+(\d{1,2})\s*(am|pm)?/i,
    /at\s+(\d{1,2})\s*(am|pm)?/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      let hours = parseInt(match[1], 10);
      const minutes = match[2] && !isNaN(parseInt(match[2], 10)) ? parseInt(match[2], 10) : 0;
      const period = (match[3] || match[2])?.toLowerCase();

      if (period === "pm" && hours < 12) hours += 12;
      if (period === "am" && hours === 12) hours = 0;

      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    }
  }
  return null;
}

function extractDuration(text: string): number | null {
  const lower = text.toLowerCase();

  if (lower.includes("overnight") || lower.includes("24 hour") || lower.includes("through the night")) {
    return 24;
  }

  const hourMatch = lower.match(/(\d+)\s*hours?/);
  if (hourMatch) return parseInt(hourMatch[1], 10);

  const rangeMatch = lower.match(/from\s+\d+\s*(?:am|pm)?\s+to\s+(\d+)\s*(?:am|pm)?/i);
  if (rangeMatch) {
    const fromMatch = lower.match(/from\s+(\d+)\s*(am|pm)?/i);
    const toMatch = lower.match(/to\s+(\d+)\s*(am|pm)?/i);
    if (fromMatch && toMatch) {
      let fromH = parseInt(fromMatch[1], 10);
      let toH = parseInt(toMatch[1], 10);
      if (fromMatch[2]?.toLowerCase() === "pm" && fromH < 12) fromH += 12;
      if (toMatch[2]?.toLowerCase() === "pm" && toH < 12) toH += 12;
      if (toH > fromH) return toH - fromH;
    }
  }

  return null;
}

function detectCareType(text: string): ServiceCategory | null {
  const lower = text.toLowerCase();
  let bestCategory: ServiceCategory | null = null;
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(CARE_TYPE_KEYWORDS)) {
    const score = keywords.filter((kw) => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category as ServiceCategory;
    }
  }

  return bestScore > 0 ? bestCategory : null;
}

function detectSkills(text: string): string[] {
  const lower = text.toLowerCase();
  return SKILLS.filter((skill) => {
    const keywords = SKILL_KEYWORDS[skill] || [skill.toLowerCase()];
    return keywords.some((kw) => lower.includes(kw));
  });
}

function detectLanguages(text: string): string[] {
  const lower = text.toLowerCase();
  return LANGUAGES.filter((lang) => lower.includes(lang.toLowerCase()));
}

export function parseRequirement(text: string): ParsedRequirement {
  const lower = text.toLowerCase();
  const careType = detectCareType(text);
  const requiredSkills = detectSkills(text);
  const requiredLanguages = detectLanguages(text);

  const mobilityKeywords = ["mobility", "walking", "walker", "wheelchair", "cannot walk", "move around"];
  const mobilityRequirements = mobilityKeywords.filter((kw) => lower.includes(kw));

  return {
    careType,
    subServices: requiredSkills,
    date: extractDate(text),
    time: extractTime(text),
    duration: extractDuration(text),
    patientAge: extractAge(text),
    mobilityRequirements,
    requiredSkills,
    requiredLanguages,
    specialInstructions: text,
    location: null,
    isOvernight: lower.includes("overnight") || lower.includes("night") || (extractDuration(text) ?? 0) >= 12,
  };
}
