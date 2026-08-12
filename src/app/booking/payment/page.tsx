"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOCK_CAREGIVERS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/matching";
import { useBooking } from "@/contexts/booking-context";
import { toast } from "sonner";
import { CreditCard, Shield, Loader2 } from "lucide-react";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { formData, resetForm } = useBooking();
  const amount = parseInt(searchParams.get("amount") || "0");
  const caregiverId = searchParams.get("caregiver") || formData.selectedCaregiverId;
  const caregiver = MOCK_CAREGIVERS.find((c) => c.id === caregiverId);

  const handlePayment = () => {
    toast.success("Payment successful! Your booking is confirmed.");
    resetForm();
    router.push("/booking/active");
  };

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
                <span className="text-2xl font-bold text-primary">{formatCurrency(amount)}</span>
              </div>
              {caregiver && (
                <p className="text-sm text-muted-foreground">
                  Caregiver: {caregiver.name} • {formData.duration}h on {formData.date}
                </p>
              )}
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
              <div>
                <Label>Name on Card</Label>
                <Input placeholder="Full name" className="mt-1.5 h-12" />
              </div>

              <Button className="w-full h-12 text-base gap-2" onClick={handlePayment}>
                <CreditCard className="h-5 w-5" />
                Pay {formatCurrency(amount)}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                This is a demo payment. No real charges will be made.
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
