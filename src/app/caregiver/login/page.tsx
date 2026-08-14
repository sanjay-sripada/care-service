"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CaregiverLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setOtpSent(true);
      if (data.devOtp) setDevOtp(data.devOtp);
      toast.success("OTP sent!");
    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp, role: "caregiver" }),
      });
      if (!res.ok) throw new Error();
      toast.success("Welcome back!");
      router.push("/caregiver/dashboard");
    } catch {
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Heart className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">{APP_NAME}</span>
            </Link>
            <h1 className="text-2xl font-bold">Caregiver Login</h1>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Phone Number</Label>
              <Input type="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5 h-12" disabled={otpSent} />
            </div>
            {otpSent && (
              <div>
                <Label>OTP</Label>
                <Input value={otp} onChange={(e) => setOtp(e.target.value)} className="mt-1.5 h-12" maxLength={6} />
                {devOtp && <p className="text-xs text-primary mt-1">Dev OTP: {devOtp}</p>}
              </div>
            )}
            <Button className="w-full h-12" onClick={otpSent ? handleLogin : handleSendOtp} disabled={loading}>
              {loading ? "Please wait..." : otpSent ? "Login" : "Send OTP"}
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            New caregiver?{" "}
            <Link href="/caregiver/register" className="text-primary font-medium hover:underline">Apply now</Link>
          </p>
          <p className="text-xs text-center text-muted-foreground mt-4">
            Demo: +91 98765 43210 (Lakshmi Devi)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
