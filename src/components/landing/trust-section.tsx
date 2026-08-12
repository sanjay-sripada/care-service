import { TRUST_FEATURES } from "@/lib/constants";
import { ShieldCheck, UserCheck, MapPin, Siren, Star, Headphones } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  ShieldCheck,
  UserCheck,
  MapPin,
  Siren,
  Star,
  Headphones,
};

export function TrustSection() {
  return (
    <section id="trust" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Trust & Safety</h2>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Your family&apos;s safety is our highest priority. Every caregiver is thoroughly vetted.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TRUST_FEATURES.map((feature) => {
            const Icon = iconMap[feature.icon] || ShieldCheck;
            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-card p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
