"use client";

import { FAQ_ITEMS, CITIES } from "@/lib/constants";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Frequently Asked Questions</h2>
        </div>

        <div className="mx-auto max-w-3xl space-y-3">
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              <button
                className="flex w-full items-center justify-between p-5 text-left font-medium"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                {item.question}
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-muted-foreground transition-transform",
                    openIndex === index && "rotate-180"
                  )}
                />
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5 text-muted-foreground">{item.answer}</div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold mb-4">Available Cities</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {CITIES.map((city, i) => (
              <span
                key={city}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium",
                  i === 0
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <MapPin className="h-3.5 w-3.5" />
                {city}
                {i > 0 && <span className="text-xs opacity-70">(Soon)</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
