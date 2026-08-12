"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { APP_NAME, LANGUAGES, SKILLS } from "@/lib/constants";
import { Heart, Upload } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CaregiverRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    experience: "",
    bio: "",
    hourlyRate: "",
    languages: [] as string[],
    skills: [] as string[],
  });

  const toggleArray = (key: "languages" | "skills", value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const handleSubmit = () => {
    toast.success("Application submitted! We'll verify your details within 48 hours.");
    router.push("/caregiver/login");
  };

  const steps = ["Personal Info", "Skills & Experience", "Verification"];

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="mx-auto max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Heart className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">{APP_NAME}</span>
          </Link>
          <h1 className="text-2xl font-bold">Become a Caregiver</h1>
          <p className="text-muted-foreground mt-1">Join our network of trusted caregivers</p>
        </div>

        <div className="flex gap-2 mb-6">
          {steps.map((s, i) => (
            <div key={s} className={`flex-1 h-1.5 rounded-full ${i <= step ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>

        <Card>
          <CardContent className="p-6">
            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <Label>Full Name *</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5 h-12" />
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1.5 h-12" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5 h-12" />
                </div>
                <div>
                  <Label>Location *</Label>
                  <Input placeholder="Area, City" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="mt-1.5 h-12" />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label>Years of Experience *</Label>
                  <Input type="number" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} className="mt-1.5 h-12" />
                </div>
                <div>
                  <Label>Expected Hourly Rate (₹) *</Label>
                  <Input type="number" value={form.hourlyRate} onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })} className="mt-1.5 h-12" />
                </div>
                <div>
                  <Label>Bio</Label>
                  <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="mt-1.5" placeholder="Tell families about your experience..." />
                </div>
                <div>
                  <Label className="mb-2 block">Languages</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {LANGUAGES.map((lang) => (
                      <label key={lang} className="flex items-center gap-2 text-sm">
                        <Checkbox checked={form.languages.includes(lang)} onCheckedChange={() => toggleArray("languages", lang)} />
                        {lang}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="mb-2 block">Skills</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {SKILLS.map((skill) => (
                      <label key={skill} className="flex items-center gap-2 text-sm">
                        <Checkbox checked={form.skills.includes(skill)} onCheckedChange={() => toggleArray("skills", skill)} />
                        {skill}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="font-medium">Upload Profile Photo</p>
                  <p className="text-sm text-muted-foreground">JPG or PNG, max 5MB</p>
                  <Button variant="outline" size="sm" className="mt-3">Choose File</Button>
                </div>
                <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="font-medium">Upload Government ID</p>
                  <p className="text-sm text-muted-foreground">Aadhaar, PAN, or Passport</p>
                  <Button variant="outline" size="sm" className="mt-3">Choose File</Button>
                </div>
                <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="font-medium">Upload Certifications (optional)</p>
                  <Button variant="outline" size="sm" className="mt-3">Choose File</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  By submitting, you agree to background verification. SaathiCare caregivers provide non-medical assistance only.
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
                Back
              </Button>
              {step < 2 ? (
                <Button onClick={() => setStep(step + 1)}>Continue</Button>
              ) : (
                <Button onClick={handleSubmit}>Submit Application</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
