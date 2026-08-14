"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BookingSteps } from "@/components/booking/booking-steps";
import { ServiceSelector } from "@/components/booking/service-selector";
import { AIRequirementAssistant } from "@/components/booking/ai-requirement-assistant";
import { CaregiverCard } from "@/components/caregiver/caregiver-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useBooking } from "@/contexts/booking-context";
import { Caregiver, CaregiverMatch, ServiceCategory } from "@/lib/types";
import { DURATION_OPTIONS } from "@/lib/constants";
import { calculateBookingAmount, formatCurrency } from "@/lib/matching";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const STEPS = ["Service", "Requirement", "Details", "Caregivers", "Confirm"];

function BookPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { formData, updateFormData, setParsedRequirement } = useBooking();
  const [step, setStep] = useState(0);
  const [matches, setMatches] = useState<CaregiverMatch[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

  useEffect(() => {
    const service = searchParams.get("service") as ServiceCategory | null;
    if (service) updateFormData({ serviceCategory: service });
  }, [searchParams, updateFormData]);

  const selectedCaregiver = matches.find(
    (m) => m.caregiver.id === formData.selectedCaregiverId
  )?.caregiver;

  const handleFindCaregivers = async () => {
    setLoadingMatches(true);
    try {
      const res = await fetch("/api/caregivers/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requirement: formData.parsedRequirement || {
            careType: formData.serviceCategory,
            requiredSkills: [],
            requiredLanguages: [],
            mobilityRequirements: [],
            subServices: [],
            date: formData.date,
            time: formData.startTime,
            duration: formData.duration,
            patientAge: formData.patientAge ? parseInt(formData.patientAge) : null,
            specialInstructions: formData.requirement,
            location: formData.location,
            isOvernight: formData.duration >= 12,
          },
          location: formData.location,
        }),
      });
      const data = await res.json();
      setMatches(data.matches || []);
      setStep(3);
    } catch {
      toast.error("Failed to find caregivers. Please try again.");
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedCaregiver) return;
    const amount = calculateBookingAmount(selectedCaregiver.hourlyRate, formData.duration);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caregiverId: selectedCaregiver.id,
          serviceCategory: formData.serviceCategory,
          requirement: formData.requirement,
          location: formData.location,
          date: formData.date,
          startTime: formData.startTime,
          duration: formData.duration,
          totalAmount: amount,
          patientName: formData.patientName,
          patientAge: formData.patientAge,
          specialInstructions: formData.specialInstructions,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          toast.error("Please log in to complete booking");
          router.push("/login?redirect=/book");
          return;
        }
        throw new Error(data.error);
      }
      toast.success("Booking created! Redirecting to payment...");
      router.push(`/booking/payment?bookingId=${data.booking.id}`);
    } catch {
      toast.error("Failed to create booking");
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0: return !!formData.serviceCategory;
      case 1: return formData.requirement.length > 10;
      case 2: return formData.location && formData.date && formData.startTime;
      case 3: return !!formData.selectedCaregiverId;
      default: return true;
    }
  };

  return (
    <>
      <Navbar variant="app" />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-2">Book Care</h1>
          <p className="text-muted-foreground mb-6">Find the right caregiver for your loved one</p>

          <BookingSteps currentStep={step} steps={STEPS} />

          {step === 0 && (
            <ServiceSelector
              selected={formData.serviceCategory}
              onSelect={(cat) => updateFormData({ serviceCategory: cat })}
            />
          )}

          {step === 1 && (
            <AIRequirementAssistant
              initialValue={formData.requirement}
              onChange={(v) => updateFormData({ requirement: v })}
              onParsed={(parsed) => {
                setParsedRequirement(parsed);
                updateFormData({ requirement: parsed.specialInstructions });
              }}
            />
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <Label htmlFor="location" className="text-base">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g. Banjara Hills, Hyderabad"
                  value={formData.location}
                  onChange={(e) => updateFormData({ location: e.target.value })}
                  className="mt-1.5 h-12"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="date" className="text-base">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => updateFormData({ date: e.target.value })}
                    className="mt-1.5 h-12"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="time" className="text-base">Start Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => updateFormData({ startTime: e.target.value })}
                    className="mt-1.5 h-12"
                  />
                </div>
              </div>
              <div>
                <Label className="text-base">Duration</Label>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {DURATION_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateFormData({ duration: opt.value })}
                      className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                        formData.duration === opt.value
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="patientName" className="text-base">Patient Name (optional)</Label>
                  <Input
                    id="patientName"
                    placeholder="e.g. Father, Mother"
                    value={formData.patientName}
                    onChange={(e) => updateFormData({ patientName: e.target.value })}
                    className="mt-1.5 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="patientAge" className="text-base">Patient Age (optional)</Label>
                  <Input
                    id="patientAge"
                    type="number"
                    placeholder="e.g. 78"
                    value={formData.patientAge}
                    onChange={(e) => updateFormData({ patientAge: e.target.value })}
                    className="mt-1.5 h-12"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Recommended Caregivers</h2>
              {loadingMatches ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : matches.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No caregivers found. Try adjusting your requirements.</p>
              ) : (
                matches.map((match) => (
                  <CaregiverCard
                    key={match.caregiver.id}
                    caregiver={match.caregiver}
                    matchScore={match.matchScore}
                    matchReasons={match.reasons}
                    showMatch
                    selected={formData.selectedCaregiverId === match.caregiver.id}
                    onSelect={(id) => updateFormData({ selectedCaregiverId: id })}
                  />
                ))
              )}
            </div>
          )}

          {step === 4 && selectedCaregiver && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">Booking Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Caregiver</span>
                    <span className="font-medium">{selectedCaregiver.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium capitalize">{formData.serviceCategory?.replace("-", " ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date & Time</span>
                    <span className="font-medium">{formData.date} at {formData.startTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{formData.duration} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium">{formData.location}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between text-base">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-primary">
                      {formatCurrency(calculateBookingAmount(selectedCaregiver.hourlyRate, formData.duration))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
            >
              Back
            </Button>
            {step < 4 ? (
              <Button
                onClick={() => {
                  if (step === 2) handleFindCaregivers();
                  else setStep(step + 1);
                }}
                disabled={!canProceed() || loadingMatches}
              >
                {loadingMatches ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Finding caregivers...</>
                ) : step === 2 ? (
                  "Find Caregivers"
                ) : (
                  "Continue"
                )}
              </Button>
            ) : (
              <Button onClick={handleConfirmBooking}>Proceed to Payment</Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <BookPageContent />
    </Suspense>
  );
}
