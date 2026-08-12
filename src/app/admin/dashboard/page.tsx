"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_CAREGIVERS, MOCK_BOOKINGS, MOCK_REVIEWS } from "@/lib/mock-data";
import { formatCurrency, getStatusColor, getStatusLabel } from "@/lib/matching";
import {
  LayoutDashboard, Users, UserCheck, Calendar, CreditCard,
  MessageSquare, BarChart3, Settings, Shield,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/caregivers", label: "Caregivers", icon: UserCheck },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/verification", label: "Verification", icon: Shield },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default function AdminDashboardPage() {
  const pendingVerification = MOCK_CAREGIVERS.filter((c) => c.verificationStatus === "pending");
  const activeBookings = MOCK_BOOKINGS.filter((b) => b.status === "in-progress");
  const totalRevenue = MOCK_BOOKINGS.filter((b) => b.paymentStatus === "paid").reduce((s, b) => s + b.totalAmount, 0);

  return (
    <div className="min-h-screen flex bg-muted/20">
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card">
        <div className="p-6 border-b border-border">
          <h2 className="font-bold text-lg">Admin Panel</h2>
          <p className="text-sm text-muted-foreground">SaathiCare</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                item.href === "/admin/dashboard"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Total Caregivers</p>
              <p className="text-2xl font-bold">{MOCK_CAREGIVERS.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Active Bookings</p>
              <p className="text-2xl font-bold">{activeBookings.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(totalRevenue)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Pending Verification</p>
              <p className="text-2xl font-bold text-warning">{pendingVerification.length}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="p-5">
              <h2 className="font-semibold mb-4">Recent Bookings</h2>
              <div className="space-y-3">
                {MOCK_BOOKINGS.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{booking.customerName}</p>
                      <p className="text-muted-foreground">{booking.serviceName}</p>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {getStatusLabel(booking.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h2 className="font-semibold mb-4">Caregivers</h2>
              <div className="space-y-3">
                {MOCK_CAREGIVERS.slice(0, 5).map((cg) => (
                  <div key={cg.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{cg.name}</p>
                      <p className="text-muted-foreground">{cg.location}</p>
                    </div>
                    <Badge className={getStatusColor(cg.verificationStatus)}>
                      {getStatusLabel(cg.verificationStatus)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardContent className="p-5">
            <h2 className="font-semibold mb-4">Recent Reviews</h2>
            <div className="space-y-3">
              {MOCK_REVIEWS.map((review) => (
                <div key={review.id} className="text-sm border-b border-border pb-3 last:border-0">
                  <div className="flex justify-between">
                    <p className="font-medium">{review.customerName}</p>
                    <span>{"⭐".repeat(review.rating)}</span>
                  </div>
                  <p className="text-muted-foreground mt-1">{review.comment}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
