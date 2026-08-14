"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CaregiverAvatar } from "@/components/shared/caregiver-avatar";
import { RatingDisplay } from "@/components/shared/rating-display";
import { VerificationBadge } from "@/components/shared/verification-badge";
import { formatCurrency } from "@/lib/matching";
import { MapPin, Languages, Calendar, Award, Clock, Loader2 } from "lucide-react";
import type { Caregiver } from "@/lib/types";

export default function CaregiverProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const [caregiver, setCaregiver] = useState<Caregiver | null>(null);
  const [reviews, setReviews] = useState<{ id: string; customerName: string; rating: number; comment: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/caregivers/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        setCaregiver(data.caregiver);
        setReviews(data.reviews || []);
      })
      .catch(() => setCaregiver(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!caregiver) {
    return (
      <>
        <Navbar variant="app" />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Caregiver not found</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar variant="app" />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <CaregiverAvatar name={caregiver.name} photo={caregiver.photo} size="xl" />
                <div className="flex-1">
                  <h1 className="text-2xl font-bold">{caregiver.name}</h1>
                  <p className="text-muted-foreground mt-1">{caregiver.experience} years • {caregiver.completedBookings} bookings</p>
                  <RatingDisplay rating={caregiver.rating} reviewCount={caregiver.reviewCount} className="mt-2" />
                  <VerificationBadge identityVerified={caregiver.identityVerified} backgroundVerified={caregiver.backgroundVerified} className="mt-3" />
                  <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />{caregiver.location}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-bold text-primary">{formatCurrency(caregiver.hourlyRate)}</p>
                  <p className="text-sm text-muted-foreground">per hour</p>
                  <Button className="mt-3" asChild>
                    <Link href={`/book?caregiver=${caregiver.id}`}>Book Now</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardContent className="p-5">
              <h2 className="font-semibold mb-3">About</h2>
              <p className="text-sm text-muted-foreground">{caregiver.bio}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {caregiver.skills.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h2 className="font-semibold mb-4">Reviews ({reviews.length})</h2>
              {reviews.length === 0 ? (
                <p className="text-sm text-muted-foreground">No reviews yet.</p>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="border-b border-border pb-4 mb-4 last:border-0">
                    <div className="flex justify-between">
                      <p className="font-medium text-sm">{r.customerName}</p>
                      <RatingDisplay rating={r.rating} showCount={false} size="sm" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{r.comment}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
