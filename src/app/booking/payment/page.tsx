"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/matching";
import { useBooking } from "@/contexts/booking-context";
import { toast } from "sonner";
import { CreditCard, Shield, Loader2 } from "lucide-react";
import type { Booking } from "@/lib/types";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { resetForm } = useBooking();
  const bookingId = searchParams.get("bookingId");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!bookingId) return;
    fetch(`/api/bookings/${bookingId}`)
      .then((r) => r.json())
      .then((data) => setBooking(data.booking))
      .finally(() => setLoading(false));
  }, [bookingId]);

  const handlePayment = async () => {
    if (!bookingId) return;
    setPaying(true);
    try {
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error);

      if (orderData.demo) {
        toast.success("Payment successful! Your booking is confirmed.");
        resetForm();
        router.push("/booking/active");
        return;
      }

      // Real Razorpay would open here with orderData.orderId
      await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      toast.success("Payment successful!");
      resetForm();
      router.push("/history");
    } catch {
      toast.error("Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Booking not found</p>
      </div>
    );
  }

  return (
    <>
      <Navbar variant="app" />
      <main className="flex-1">
        <div className="mx-auto max-w-lg px-4 py-8 sm:px-6">
          <h1 className="text-2xl font-bold mb-6">Complete Payment</h1>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-muted-foreground">Amount to pay</span>
                <span className="text-2xl font-bold text-primary">{formatCurrency(booking.totalAmount)}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {booking.caregiverName} • {booking.duration}h on {booking.date}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                Secured by Razorpay
              </div>
              <div>
                <Label>Card Number</Label>
                <Input placeholder="4111 1111 1111 1111" className="mt-1.5 h-12" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Expiry</Label>
                  <Input placeholder="MM/YY" className="mt-1.5 h-12" />
                </div>
                <div>
                  <Label>CVV</Label>
                  <Input placeholder="123" className="mt-1.5 h-12" type="password" />
                </div>
              </div>
              <Button className="w-full h-12 text-base gap-2" onClick={handlePayment} disabled={paying}>
                <CreditCard className="h-5 w-5" />
                {paying ? "Processing..." : `Pay ${formatCurrency(booking.totalAmount)}`}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Demo mode: payment completes without real charges.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <PaymentContent />
    </Suspense>
  );
}
