"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_JOB_REQUESTS, MOCK_CAREGIVERS } from "@/lib/mock-data";
import { formatCurrency, getStatusColor } from "@/lib/matching";
import {
  LayoutDashboard, Briefcase, Calendar, DollarSign, Star, User,
  Bell, LogOut, MapPin, Clock, Check, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/caregiver/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/caregiver/jobs", label: "Job Requests", icon: Briefcase },
  { href: "/caregiver/availability", label: "Availability", icon: Calendar },
  { href: "/caregiver/earnings", label: "Earnings", icon: DollarSign },
  { href: "/caregiver/reviews", label: "Reviews", icon: Star },
  { href: "/caregiver/profile", label: "Profile", icon: User },
];

const caregiver = MOCK_CAREGIVERS[0];

export default function CaregiverDashboardPage() {
  const [jobs, setJobs] = useState(MOCK_JOB_REQUESTS);

  const handleAccept = (id: string) => {
    setJobs(jobs.map((j) => j.id === id ? { ...j, status: "accepted" as const } : j));
    toast.success("Job accepted!");
  };

  const handleReject = (id: string) => {
    setJobs(jobs.map((j) => j.id === id ? { ...j, status: "rejected" as const } : j));
    toast.info("Job declined");
  };

  return (
    <div className="min-h-screen flex">
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card">
        <div className="p-6 border-b border-border">
          <h2 className="font-bold text-lg">Caregiver Portal</h2>
          <p className="text-sm text-muted-foreground">{caregiver.name}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                item.href === "/caregiver/dashboard"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground" asChild>
            <Link href="/"><LogOut className="h-4 w-4" /> Log out</Link>
          </Button>
        </div>
      </aside>

      <div className="flex-1">
        <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between lg:hidden">
          <h2 className="font-bold">Caregiver Portal</h2>
          <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
        </header>

        <main className="p-6 max-w-4xl">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(28500)}</p>
                <p className="text-xs text-muted-foreground mt-1">12 bookings completed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Rating</p>
                <p className="text-2xl font-bold">{caregiver.rating}</p>
                <p className="text-xs text-muted-foreground mt-1">{caregiver.reviewCount} reviews</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Pending Requests</p>
                <p className="text-2xl font-bold">{jobs.filter((j) => j.status === "pending").length}</p>
                <p className="text-xs text-muted-foreground mt-1">Awaiting response</p>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-lg font-semibold mb-4">New Job Requests</h2>
          <div className="space-y-4">
            {jobs.filter((j) => j.status === "pending").map((job) => (
              <Card key={job.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{job.serviceName}</h3>
                      <p className="text-sm text-muted-foreground">{job.customerName}</p>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{job.date} at {job.startTime}</span>
                      </div>
                      <p className="text-sm mt-2">{job.requirement}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-primary">{formatCurrency(job.amount)}</p>
                      <p className="text-xs text-muted-foreground">{job.duration}h</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" className="gap-1" onClick={() => handleAccept(job.id)}>
                      <Check className="h-4 w-4" /> Accept
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => handleReject(job.id)}>
                      <X className="h-4 w-4" /> Decline
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {jobs.filter((j) => j.status === "pending").length === 0 && (
              <p className="text-muted-foreground text-center py-8">No pending requests</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
