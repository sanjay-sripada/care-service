"use client";

import { useEffect, useState } from "react";
import type { UserRole } from "@/lib/types";
import type { Caregiver } from "@/lib/types";

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  role: UserRole;
  emergencyContact?: string | null;
  emergencyPhone?: string | null;
  caregiverProfile?: Caregiver | null;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  return { user, loading, refresh, logout };
}
