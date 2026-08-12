import { Caregiver, CaregiverMatch, ParsedRequirement } from "./types";

interface MatchWeights {
  location: number;
  availability: number;
  serviceType: number;
  skills: number;
  experience: number;
  rating: number;
  language: number;
  price: number;
}

const DEFAULT_WEIGHTS: MatchWeights = {
  location: 15,
  availability: 20,
  serviceType: 15,
  skills: 20,
  experience: 10,
  rating: 10,
  language: 10,
  price: 0,
};

const SERVICE_SKILL_MAP: Record<string, string[]> = {
  "elderly-care": ["Companion care", "Mobility assistance", "Medicine reminders", "Feeding assistance", "Bathing & grooming"],
  "patient-care": ["Bedridden care", "Overnight care", "Post-surgery care", "Feeding assistance"],
  "hospital-assistance": ["Hospital accompaniment", "Mobility assistance", "Medicine reminders"],
};

function scoreLocation(caregiver: Caregiver, location?: string | null): { score: number; reason?: string } {
  if (!location) return { score: 50 };
  const loc = location.toLowerCase();
  const cgLoc = caregiver.location.toLowerCase();
  const city = caregiver.city.toLowerCase();

  if (cgLoc.includes(loc) || loc.includes(cgLoc.split(",")[0])) {
    return { score: 100, reason: `Located in ${caregiver.location}` };
  }
  if (loc.includes(city) || city.includes(loc)) {
    return { score: 80, reason: `Serves ${caregiver.city} area` };
  }
  return { score: 40 };
}

function scoreAvailability(caregiver: Caregiver): { score: number; reason?: string } {
  if (!caregiver.isAvailable) return { score: 0, reason: "Currently unavailable" };
  return { score: 100, reason: "Available for booking" };
}

function scoreSkills(caregiver: Caregiver, required: string[]): { score: number; reason?: string } {
  if (required.length === 0) return { score: 70 };
  const matched = required.filter((s) =>
    caregiver.skills.some((cs) => cs.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(cs.toLowerCase()))
  );
  const ratio = matched.length / required.length;
  if (ratio === 1) return { score: 100, reason: `Has all required skills: ${matched.join(", ")}` };
  if (ratio >= 0.5) return { score: 70 + ratio * 30, reason: `Matches ${matched.length}/${required.length} required skills` };
  return { score: ratio * 70, reason: `Partial skill match (${matched.length}/${required.length})` };
}

function scoreServiceType(caregiver: Caregiver, careType: string | null): { score: number; reason?: string } {
  if (!careType) return { score: 60 };
  const expectedSkills = SERVICE_SKILL_MAP[careType] || [];
  const matched = expectedSkills.filter((s) => caregiver.skills.includes(s));
  const ratio = matched.length / Math.max(expectedSkills.length, 1);
  if (ratio >= 0.6) return { score: 90 + ratio * 10, reason: `Experienced in ${careType.replace("-", " ")}` };
  return { score: ratio * 80 };
}

function scoreExperience(caregiver: Caregiver): { score: number; reason?: string } {
  const years = caregiver.experience;
  if (years >= 10) return { score: 100, reason: `${years} years of experience` };
  if (years >= 5) return { score: 80, reason: `${years} years of experience` };
  if (years >= 2) return { score: 60, reason: `${years} years of experience` };
  return { score: 40, reason: `${years} year(s) of experience` };
}

function scoreRating(caregiver: Caregiver): { score: number; reason?: string } {
  const rating = caregiver.rating;
  if (rating >= 4.8) return { score: 100, reason: `Excellent rating: ${rating}/5 (${caregiver.reviewCount} reviews)` };
  if (rating >= 4.5) return { score: 85, reason: `Great rating: ${rating}/5` };
  if (rating >= 4.0) return { score: 70, reason: `Good rating: ${rating}/5` };
  return { score: 50 };
}

function scoreLanguage(caregiver: Caregiver, required: string[]): { score: number; reason?: string } {
  if (required.length === 0) return { score: 70 };
  const matched = required.filter((l) => caregiver.languages.includes(l));
  if (matched.length === required.length) {
    return { score: 100, reason: `Speaks ${matched.join(", ")}` };
  }
  if (matched.length > 0) {
    return { score: 70, reason: `Speaks ${matched.join(", ")}` };
  }
  return { score: 20 };
}

function scoreVerification(caregiver: Caregiver): number {
  let bonus = 0;
  if (caregiver.identityVerified) bonus += 5;
  if (caregiver.backgroundVerified) bonus += 5;
  return bonus;
}

export function matchCaregivers(
  caregivers: Caregiver[],
  requirement: ParsedRequirement,
  location?: string,
  weights: MatchWeights = DEFAULT_WEIGHTS
): CaregiverMatch[] {
  const requiredSkills = [
    ...requirement.requiredSkills,
    ...(requirement.isOvernight ? ["Overnight care"] : []),
    ...requirement.mobilityRequirements.map(() => "Mobility assistance"),
  ];

  const uniqueSkills = [...new Set(requiredSkills)];

  const matches: CaregiverMatch[] = caregivers.map((caregiver) => {
    const reasons: string[] = [];
    let totalScore = 0;
    let totalWeight = 0;

    const scores = [
      { ...scoreLocation(caregiver, location || requirement.location), weight: weights.location },
      { ...scoreAvailability(caregiver), weight: weights.availability },
      { ...scoreServiceType(caregiver, requirement.careType), weight: weights.serviceType },
      { ...scoreSkills(caregiver, uniqueSkills), weight: weights.skills },
      { ...scoreExperience(caregiver), weight: weights.experience },
      { ...scoreRating(caregiver), weight: weights.rating },
      { ...scoreLanguage(caregiver, requirement.requiredLanguages), weight: weights.language },
    ];

    for (const s of scores) {
      totalScore += s.score * s.weight;
      totalWeight += s.weight;
      if (s.reason && s.score >= 70) reasons.push(s.reason);
    }

    let matchScore = Math.round(totalScore / totalWeight);
    matchScore = Math.min(99, matchScore + scoreVerification(caregiver));

    if (caregiver.identityVerified && caregiver.backgroundVerified) {
      reasons.unshift("Fully verified caregiver");
    }

    return { caregiver, matchScore, reasons: reasons.slice(0, 4) };
  });

  return matches
    .filter((m) => m.caregiver.isAvailable || m.matchScore > 50)
    .sort((a, b) => b.matchScore - a.matchScore);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateBookingAmount(hourlyRate: number, duration: number): number {
  if (duration >= 24) return Math.round(hourlyRate * 20);
  if (duration >= 12) return Math.round(hourlyRate * duration * 0.9);
  return hourlyRate * duration;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "bg-warning/15 text-warning-foreground",
    confirmed: "bg-primary/15 text-primary",
    "caregiver-assigned": "bg-primary/15 text-primary",
    "in-progress": "bg-success/15 text-success",
    completed: "bg-muted text-muted-foreground",
    cancelled: "bg-destructive/15 text-destructive",
    paid: "bg-success/15 text-success",
    verified: "bg-success/15 text-success",
    rejected: "bg-destructive/15 text-destructive",
  };
  return colors[status] || "bg-muted text-muted-foreground";
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    "caregiver-assigned": "Caregiver Assigned",
    "in-progress": "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
    paid: "Paid",
    verified: "Verified",
    rejected: "Rejected",
  };
  return labels[status] || status;
}
