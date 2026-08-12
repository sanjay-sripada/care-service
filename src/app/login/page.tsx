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

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const handleSendOtp = () => {
    if (phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    setOtpSent(true);
    toast.success("OTP sent to your phone!");
  };

  const handleLogin = () => {
    if (otp.length < 4) {
      toast.error("Please enter the OTP");
      return;
    }
    toast.success("Logged in successfully!");
    router.push("/home");
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
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground mt-1">Sign in to your account</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1.5 h-12"
                disabled={otpSent}
              />
            </div>

            {otpSent && (
              <div>
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="mt-1.5 h-12"
                  maxLength={6}
                />
                <p className="text-xs text-muted-foreground mt-1">Demo: enter any 4+ digits</p>
              </div>
            )}

            <Button
              className="w-full h-12"
              onClick={otpSent ? handleLogin : handleSendOtp}
            >
              {otpSent ? "Verify & Login" : "Send OTP"}
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>

          <div className="mt-4 text-center">
            <Link href="/caregiver/login" className="text-sm text-muted-foreground hover:text-foreground">
              Login as Caregiver →
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
