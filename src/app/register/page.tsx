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

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!name || phone.replace(/\D/g, "").length < 10) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOtpSent(true);
      if (data.devOtp) setDevOtp(data.devOtp);
      toast.success("OTP sent!");
    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp, name, role: "customer" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Account created!");
      router.push("/home");
    } catch {
      toast.error("Registration failed");
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
            <h1 className="text-2xl font-bold">Create your account</h1>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Full Name *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 h-12" disabled={otpSent} />
            </div>
            <div>
              <Label>Phone Number *</Label>
              <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5 h-12" disabled={otpSent} />
            </div>
            {otpSent && (
              <div>
                <Label>OTP</Label>
                <Input value={otp} onChange={(e) => setOtp(e.target.value)} className="mt-1.5 h-12" maxLength={6} />
                {devOtp && <p className="text-xs text-primary mt-1">Dev OTP: {devOtp}</p>}
              </div>
            )}
            <Button className="w-full h-12" onClick={otpSent ? handleRegister : handleSendOtp} disabled={loading}>
              {loading ? "Please wait..." : otpSent ? "Create Account" : "Send OTP"}
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
