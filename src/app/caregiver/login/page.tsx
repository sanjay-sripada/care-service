"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CaregiverLoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    toast.success("Welcome back!");
    router.push("/caregiver/dashboard");
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
            <p className="text-muted-foreground mt-1">Access your caregiver dashboard</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Phone Number</Label>
              <Input type="tel" placeholder="+91 98765 43210" className="mt-1.5 h-12" />
            </div>
            <Button className="w-full h-12" onClick={handleLogin}>Login</Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            New caregiver?{" "}
            <Link href="/caregiver/register" className="text-primary font-medium hover:underline">Apply now</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
