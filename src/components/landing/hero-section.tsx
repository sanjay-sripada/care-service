"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Users, Clock } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/30" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Shield className="h-4 w-4" />
            Verified caregivers across Hyderabad
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
            Care you can trust.{" "}
            <span className="text-primary">Even when you can&apos;t be there.</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground sm:text-xl text-balance max-w-2xl mx-auto">
            Find verified caregivers and reliable assistance for elderly parents, patients,
            hospital visits, and everyday care.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-14 px-8 text-base w-full sm:w-auto" asChild>
              <Link href="/book">Find Care</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-base w-full sm:w-auto" asChild>
              <Link href="/caregiver/register">Become a Caregiver</Link>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span>500+ Verified Caregivers</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>Background Checked</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
