import { Card, CardContent } from "@/components/ui/card";
import { MOCK_CARE_EVENTS } from "@/lib/mock-data";
import { Activity, CheckCircle2 } from "lucide-react";

export function FamilyTrackingSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Monitor care from anywhere
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our Family Care Dashboard keeps you connected to your loved one&apos;s care —
              even when you can&apos;t be there in person. See real-time updates on check-ins,
              activities, medications, and more.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Real-time check-in/check-out notifications",
                "Activity updates throughout the day",
                "Medication reminder confirmations",
                "Emergency SOS alerts",
                "Share access with family members",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Dad&apos;s Care — Today</h3>
                  <p className="text-sm text-muted-foreground">Lakshmi Devi • Elderly Care</p>
                </div>
              </div>

              <div className="space-y-4">
                {MOCK_CARE_EVENTS.map((event) => (
                  <div key={event.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-success ring-4 ring-success/20" />
                      <div className="w-px flex-1 bg-border mt-1" />
                    </div>
                    <div className="pb-4">
                      <p className="font-medium text-sm">{event.title}</p>
                      {event.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">{event.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
