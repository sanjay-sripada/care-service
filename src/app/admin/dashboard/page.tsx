"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, getStatusColor, getStatusLabel } from "@/lib/matching";
import { LayoutDashboard, Shield, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Booking, Caregiver } from "@/lib/types";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ totalCaregivers: 0, activeBookings: 0, totalRevenue: 0, pendingVerification: 0 });
  const [pendingCaregivers, setPendingCaregivers] = useState<Caregiver[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/admin")
      .then((r) => r.json())
      .then((data) => {
        setStats(data.stats);
        setPendingCaregivers(data.pendingCaregivers || []);
        setRecentBookings(data.recentBookings || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const verifyCaregiver = async (caregiverId: string, status: string) => {
    const res = await fetch("/api/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caregiverId, status }),
    });
    if (res.ok) {
      toast.success(`Caregiver ${status}`);
      load();
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
    <div className="min-h-screen flex bg-muted/20">
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card p-6">
        <h2 className="font-bold text-lg">Admin Panel</h2>
        <p className="text-sm text-muted-foreground">SaathiCare</p>
      </aside>

      <main className="flex-1 p-6 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Caregivers</p><p className="text-2xl font-bold">{stats.totalCaregivers}</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Active Bookings</p><p className="text-2xl font-bold">{stats.activeBookings}</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Revenue</p><p className="text-2xl font-bold text-primary">{formatCurrency(stats.totalRevenue)}</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Pending Verification</p><p className="text-2xl font-bold">{stats.pendingVerification}</p></CardContent></Card>
        </div>

        {pendingCaregivers.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-5">
              <h2 className="font-semibold mb-4 flex items-center gap-2"><Shield className="h-4 w-4" /> Pending Verification</h2>
              {pendingCaregivers.map((cg) => (
                <div key={cg.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium">{cg.name}</p>
                    <p className="text-sm text-muted-foreground">{cg.location}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => verifyCaregiver(cg.id, "verified")}>Approve</Button>
                    <Button size="sm" variant="outline" onClick={() => verifyCaregiver(cg.id, "rejected")}>Reject</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-5">
            <h2 className="font-semibold mb-4">Recent Bookings</h2>
            {recentBookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between py-2 text-sm border-b last:border-0">
                <div>
                  <p className="font-medium">{b.customerName}</p>
                  <p className="text-muted-foreground">{b.serviceName}</p>
                </div>
                <Badge className={getStatusColor(b.status)}>{getStatusLabel(b.status)}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
