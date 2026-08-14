"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/matching";
import {
  LayoutDashboard, Briefcase, Calendar, DollarSign, Star, User,
  LogOut, MapPin, Clock, Check, X, Play, Square, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Booking } from "@/lib/types";

const NAV_ITEMS = [
  { href: "/caregiver/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

interface DashboardData {
  pendingJobs: Booking[];
  activeBooking: Booking | null;
  stats: { totalEarnings: number; completedBookings: number; rating: number; reviewCount: number };
}

export default function CaregiverDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/caregiver/dashboard")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAction = async (bookingId: string, action: string) => {
    const res = await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (res.ok) {
      toast.success(`Booking ${action}ed`);
      load();
    } else {
      toast.error("Action failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card">
        <div className="p-6 border-b border-border">
          <h2 className="font-bold text-lg">Caregiver Portal</h2>
        </div>
        <nav className="flex-1 p-4">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium bg-primary/10 text-primary">
              <item.icon className="h-4 w-4" />{item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link href="/"><LogOut className="h-4 w-4" /> Log out</Link>
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-6 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {data && (
          <>
            <div className="grid gap-4 sm:grid-cols-3 mb-8">
              <Card>
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(data.stats.totalEarnings)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="text-2xl font-bold">{data.stats.rating}</p>
                  <p className="text-xs text-muted-foreground">{data.stats.reviewCount} reviews</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{data.stats.completedBookings}</p>
                </CardContent>
              </Card>
            </div>

            {data.activeBooking && (
              <Card className="mb-6 border-primary/30 bg-primary/5">
                <CardContent className="p-5">
                  <h2 className="font-semibold mb-2">Active Service</h2>
                  <p className="text-sm">{data.activeBooking.serviceName} — {data.activeBooking.customerName}</p>
                  <p className="text-sm text-muted-foreground">{data.activeBooking.location}</p>
                  <Button className="mt-3 gap-1" variant="destructive" onClick={() => handleAction(data.activeBooking!.id, "end")}>
                    <Square className="h-4 w-4" /> End Service
                  </Button>
                </CardContent>
              </Card>
            )}

            <h2 className="text-lg font-semibold mb-4">Job Requests</h2>
            <div className="space-y-4">
              {data.pendingJobs.map((job) => (
                <Card key={job.id}>
                  <CardContent className="p-5">
                    <div className="flex justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{job.serviceName}</h3>
                        <p className="text-sm text-muted-foreground">{job.customerName}</p>
                        <div className="mt-2 flex gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{job.date} at {job.startTime}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{formatCurrency(job.totalAmount)}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" className="gap-1" onClick={() => handleAction(job.id, "accept")}>
                        <Check className="h-4 w-4" /> Accept
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => handleAction(job.id, "reject")}>
                        <X className="h-4 w-4" /> Decline
                      </Button>
                      {job.status === "confirmed" && (
                        <Button size="sm" variant="secondary" className="gap-1" onClick={() => handleAction(job.id, "start")}>
                          <Play className="h-4 w-4" /> Start Service
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {data.pendingJobs.length === 0 && !data.activeBooking && (
                <p className="text-muted-foreground text-center py-8">No pending jobs</p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
