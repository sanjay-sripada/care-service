import { Card, CardContent } from "@/components/ui/card";
import { MOCK_CAREGIVERS } from "@/lib/mock-data";
import { CaregiverAvatar } from "@/components/shared/caregiver-avatar";
import { RatingDisplay } from "@/components/shared/rating-display";
import { VerificationBadge } from "@/components/shared/verification-badge";
import { formatCurrency } from "@/lib/matching";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CaregiversSection() {
  const featured = MOCK_CAREGIVERS.filter((c) => c.rating >= 4.8).slice(0, 3);

  return (
    <section className="py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Meet Our Caregivers</h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Verified, experienced, and compassionate professionals
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((caregiver) => (
            <Card key={caregiver.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <CaregiverAvatar name={caregiver.name} photo={caregiver.photo} size="lg" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{caregiver.name}</h3>
                    <p className="text-sm text-muted-foreground">{caregiver.experience} years experience</p>
                    <RatingDisplay rating={caregiver.rating} reviewCount={caregiver.reviewCount} size="sm" className="mt-1" />
                  </div>
                </div>

                <VerificationBadge
                  identityVerified={caregiver.identityVerified}
                  backgroundVerified={caregiver.backgroundVerified}
                  className="mt-4"
                />

                <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{caregiver.bio}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {caregiver.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="text-xs bg-muted px-2 py-1 rounded-full">{skill}</span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="font-semibold text-primary">{formatCurrency(caregiver.hourlyRate)}/hr</span>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/caregivers/${caregiver.id}`}>View Profile</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
