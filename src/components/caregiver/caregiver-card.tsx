"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CaregiverAvatar } from "@/components/shared/caregiver-avatar";
import { RatingDisplay } from "@/components/shared/rating-display";
import { VerificationBadge } from "@/components/shared/verification-badge";
import { Caregiver } from "@/lib/types";
import { formatCurrency } from "@/lib/matching";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Languages } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CaregiverCardProps {
  caregiver: Caregiver;
  matchScore?: number;
  matchReasons?: string[];
  onSelect?: (id: string) => void;
  selected?: boolean;
  showMatch?: boolean;
}

export function CaregiverCard({
  caregiver,
  matchScore,
  matchReasons,
  onSelect,
  selected,
  showMatch = false,
}: CaregiverCardProps) {
  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md",
        selected && "ring-2 ring-primary border-primary",
        !caregiver.isAvailable && "opacity-60"
      )}
    >
      <CardContent className="p-5">
        <div className="flex gap-4">
          <CaregiverAvatar name={caregiver.name} photo={caregiver.photo} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-lg">{caregiver.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {caregiver.experience} years • {caregiver.completedBookings} bookings
                </p>
              </div>
              {showMatch && matchScore !== undefined && (
                <div className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                  {matchScore}% match
                </div>
              )}
            </div>

            <RatingDisplay
              rating={caregiver.rating}
              reviewCount={caregiver.reviewCount}
              size="sm"
              className="mt-1"
            />

            <VerificationBadge
              identityVerified={caregiver.identityVerified}
              backgroundVerified={caregiver.backgroundVerified}
              className="mt-2"
            />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {caregiver.location}
          </span>
          <span className="flex items-center gap-1">
            <Languages className="h-3.5 w-3.5" />
            {caregiver.languages.slice(0, 2).join(", ")}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {caregiver.skills.slice(0, 4).map((skill) => (
            <span key={skill} className="text-xs bg-muted px-2.5 py-1 rounded-full">
              {skill}
            </span>
          ))}
        </div>

        {showMatch && matchReasons && matchReasons.length > 0 && (
          <div className="mt-3 rounded-lg bg-accent/50 p-3">
            <p className="text-xs font-medium text-accent-foreground mb-1.5">Why recommended:</p>
            <ul className="space-y-1">
              {matchReasons.map((reason) => (
                <li key={reason} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <span className="text-primary mt-0.5">✓</span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-primary">{formatCurrency(caregiver.hourlyRate)}</span>
            <span className="text-sm text-muted-foreground">/hour</span>
            {!caregiver.isAvailable && (
              <p className="text-xs text-destructive flex items-center gap-1 mt-0.5">
                <Clock className="h-3 w-3" /> Currently unavailable
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/caregivers/${caregiver.id}`}>Profile</Link>
            </Button>
            {onSelect && (
              <Button
                size="sm"
                onClick={() => onSelect(caregiver.id)}
                disabled={!caregiver.isAvailable}
                variant={selected ? "secondary" : "default"}
              >
                {selected ? "Selected" : "Select"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
