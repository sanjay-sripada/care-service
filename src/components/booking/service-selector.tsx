"use client";

import { cn } from "@/lib/utils";
import { ServiceCategory } from "@/lib/types";
import { SERVICES } from "@/lib/constants";
import { Heart, Stethoscope, Building2 } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Heart,
  Stethoscope,
  Building2,
};

interface ServiceSelectorProps {
  selected: ServiceCategory | null;
  onSelect: (category: ServiceCategory) => void;
}

export function ServiceSelector({ selected, onSelect }: ServiceSelectorProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">What do you need help with?</h2>
      <p className="text-muted-foreground mb-4">Select the type of care you&apos;re looking for</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {SERVICES.map((service) => {
          const Icon = iconMap[service.icon] || Heart;
          const isSelected = selected === service.category;
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onSelect(service.category)}
              className={cn(
                "flex flex-col items-center gap-3 rounded-xl border-2 p-5 text-center transition-all hover:border-primary/50",
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-card"
              )}
            >
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold">{service.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{service.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
