import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_BOOKINGS } from "@/lib/mock-data";
import { getStatusColor, getStatusLabel, formatCurrency } from "@/lib/matching";
import { Calendar, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HistoryPage() {
  return (
    <>
      <Navbar variant="app" />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <h1 className="text-2xl font-bold mb-6">Booking History</h1>

          <div className="space-y-4">
            {MOCK_BOOKINGS.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{booking.serviceName}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Caregiver: {booking.caregiverName}
                      </p>
                    </div>
                    <Badge className={cn("shrink-0", getStatusColor(booking.status))}>
                      {getStatusLabel(booking.status)}
                    </Badge>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> {booking.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {booking.startTime} ({booking.duration}h)
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {booking.location}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-semibold text-primary">{formatCurrency(booking.totalAmount)}</span>
                    <div className="flex gap-2">
                      {booking.status === "in-progress" && (
                        <Button size="sm" variant="outline" asChild>
                          <Link href="/booking/active">Track</Link>
                        </Button>
                      )}
                      {booking.status === "completed" && (
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/reviews?booking=${booking.id}`}>Review</Link>
                        </Button>
                      )}
                      <Button size="sm" asChild>
                        <Link href={`/booking/${booking.id}`}>Details</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
