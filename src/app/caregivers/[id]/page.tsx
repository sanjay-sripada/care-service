import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_CAREGIVERS, MOCK_REVIEWS } from "@/lib/mock-data";
import { CaregiverAvatar } from "@/components/shared/caregiver-avatar";
import { RatingDisplay } from "@/components/shared/rating-display";
import { VerificationBadge } from "@/components/shared/verification-badge";
import { formatCurrency } from "@/lib/matching";
import { MapPin, Languages, Calendar, Award, Clock } from "lucide-react";

export default async function CaregiverProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const caregiver = MOCK_CAREGIVERS.find((c) => c.id === id);

  if (!caregiver) notFound();

  const reviews = MOCK_REVIEWS.filter((r) => r.caregiverId === id);

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
                  <p className="text-muted-foreground mt-1">
                    {caregiver.experience} years experience • {caregiver.completedBookings} bookings completed
                  </p>
                  <RatingDisplay
                    rating={caregiver.rating}
                    reviewCount={caregiver.reviewCount}
                    className="mt-2"
                  />
                  <VerificationBadge
                    identityVerified={caregiver.identityVerified}
                    backgroundVerified={caregiver.backgroundVerified}
                    className="mt-3"
                  />
                  <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {caregiver.location}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-bold text-primary">{formatCurrency(caregiver.hourlyRate)}</p>
                  <p className="text-sm text-muted-foreground">per hour</p>
                  <Button className="mt-3 w-full sm:w-auto" asChild>
                    <Link href={`/book?caregiver=${caregiver.id}`}>Book Now</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <Card>
              <CardContent className="p-5">
                <h2 className="font-semibold mb-3">About</h2>
                <p className="text-sm text-muted-foreground">{caregiver.bio}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <h2 className="font-semibold mb-3 flex items-center gap-2">
                  <Languages className="h-4 w-4" /> Languages
                </h2>
                <div className="flex flex-wrap gap-2">
                  {caregiver.languages.map((lang) => (
                    <Badge key={lang} variant="secondary">{lang}</Badge>
                  ))}
                </div>
                <h2 className="font-semibold mt-4 mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Availability
                </h2>
                <div className="flex flex-wrap gap-2">
                  {caregiver.availability.map((day) => (
                    <Badge key={day} variant="outline">{day}</Badge>
                  ))}
                </div>
                <p className="text-sm mt-2 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {caregiver.isAvailable ? (
                    <span className="text-success font-medium">Available now</span>
                  ) : (
                    <span className="text-destructive">Currently unavailable</span>
                  )}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardContent className="p-5">
              <h2 className="font-semibold mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {caregiver.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {caregiver.certifications.length > 0 && (
            <Card className="mb-6">
              <CardContent className="p-5">
                <h2 className="font-semibold mb-3 flex items-center gap-2">
                  <Award className="h-4 w-4" /> Certifications
                </h2>
                <ul className="space-y-2">
                  {caregiver.certifications.map((cert) => (
                    <li key={cert} className="text-sm flex items-center gap-2">
                      <span className="text-primary">✓</span> {cert}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-5">
              <h2 className="font-semibold mb-4">Reviews ({reviews.length})</h2>
              {reviews.length === 0 ? (
                <p className="text-sm text-muted-foreground">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-border pb-4 last:border-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{review.customerName}</p>
                        <RatingDisplay rating={review.rating} showCount={false} size="sm" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <p className="mt-6 text-xs text-muted-foreground text-center">
            SaathiCare caregivers provide non-medical assistance. They are not licensed nurses or doctors.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
