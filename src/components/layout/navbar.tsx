"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { Bell, Heart, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  variant?: "landing" | "app";
}

export function Navbar({ variant = "landing" }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks =
    variant === "landing"
      ? [
          { href: "#services", label: "Services" },
          { href: "#how-it-works", label: "How it Works" },
          { href: "#trust", label: "Trust & Safety" },
          { href: "#faq", label: "FAQ" },
        ]
      : [
          { href: "/home", label: "Home" },
          { href: "/book", label: "Book Care" },
          { href: "/family", label: "Family Dashboard" },
          { href: "/history", label: "History" },
        ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Heart className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">{APP_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {variant === "landing" ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/caregiver/register">Become a Caregiver</Link>
              </Button>
              <Button asChild>
                <Link href="/book">Find Care</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/notifications" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/profile">Profile</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={cn(
          "md:hidden border-t border-border bg-background",
          mobileOpen ? "block" : "hidden"
        )}
      >
        <div className="flex flex-col gap-1 p-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-3 text-sm font-medium hover:bg-muted"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
            <Button asChild className="w-full">
              <Link href="/book">Find Care</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/caregiver/register">Become a Caregiver</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
