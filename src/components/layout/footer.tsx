import Link from "next/link";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Heart className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">{APP_NAME}</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">{APP_TAGLINE}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/book?service=elderly-care" className="hover:text-foreground">Elderly Care</Link></li>
              <li><Link href="/book?service=patient-care" className="hover:text-foreground">Patient Care</Link></li>
              <li><Link href="/book?service=hospital-assistance" className="hover:text-foreground">Hospital Assistance</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground">About Us</Link></li>
              <li><Link href="/caregiver/register" className="hover:text-foreground">Become a Caregiver</Link></li>
              <li><Link href="#trust" className="hover:text-foreground">Trust & Safety</Link></li>
              <li><Link href="#faq" className="hover:text-foreground">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>support@saathicare.in</li>
              <li>+91 1800-XXX-XXXX</li>
              <li>Hyderabad, India</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
          </div>
        </div>

        <p className="mt-4 text-xs text-muted-foreground text-center">
          SaathiCare provides trained caregivers and attendants for non-medical assistance.
          We do not offer licensed nursing or medical services.
        </p>
      </div>
    </footer>
  );
}
