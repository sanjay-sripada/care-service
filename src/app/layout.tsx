import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { BookingProvider } from "@/contexts/booking-context";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${APP_NAME} — ${APP_TAGLINE}`,
  description:
    "Find verified caregivers and reliable assistance for elderly parents, patients, hospital visits, and everyday care in Hyderabad.",
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col font-sans">
        <BookingProvider>
          {children}
          <Toaster position="top-center" richColors />
        </BookingProvider>
      </body>
    </html>
  );
}
