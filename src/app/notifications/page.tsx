"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, CheckCircle2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const NOTIFICATIONS = [
  {
    id: "n-001",
    title: "Caregiver checked in",
    message: "Lakshmi Devi arrived at 9:02 AM for Dad's care session.",
    time: "2 hours ago",
    type: "activity" as const,
    read: false,
    href: "/booking/active",
  },
  {
    id: "n-002",
    title: "Booking confirmed",
    message: "Rajesh Kumar will accompany your father to the hospital on Friday at 10:00 AM.",
    time: "Yesterday",
    type: "booking" as const,
    read: false,
    href: "/history",
  },
  {
    id: "n-003",
    title: "Medicine reminder completed",
    message: "Morning blood pressure medication was administered at 10:00 AM.",
    time: "Yesterday",
    type: "activity" as const,
    read: true,
    href: "/family",
  },
  {
    id: "n-004",
    title: "Leave a review",
    message: "How was Sunita Reddy's overnight care? Share your experience.",
    time: "5 days ago",
    type: "review" as const,
    read: true,
    href: "/reviews",
  },
];

const typeIcons = {
  activity: CheckCircle2,
  booking: Calendar,
  review: Star,
};

export default function NotificationsPage() {
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <>
      <Navbar variant="app" />
      <main className="flex-1">
        <div className="mx-auto max-w-lg px-4 py-8 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
              )}
            </div>
            <Bell className="h-6 w-6 text-muted-foreground" />
          </div>

          {NOTIFICATIONS.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No notifications yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {NOTIFICATIONS.map((notification) => {
                const Icon = typeIcons[notification.type];
                return (
                  <Link key={notification.id} href={notification.href}>
                    <Card
                      className={cn(
                        "transition-colors hover:bg-muted/50",
                        !notification.read && "border-primary/20 bg-primary/5"
                      )}
                    >
                      <CardContent className="p-4 flex gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-medium text-sm">{notification.title}</p>
                            {!notification.read && (
                              <Badge variant="secondary" className="shrink-0 text-xs bg-primary/10 text-primary">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
