import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-primary px-8 py-16 text-center text-primary-foreground sm:px-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
            Ready to find trusted care?
          </h2>
          <p className="mt-4 text-lg opacity-90 max-w-xl mx-auto">
            Join hundreds of families in Hyderabad who trust SaathiCare for their loved ones.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" className="h-14 px-8 text-base w-full sm:w-auto" asChild>
              <Link href="/book">Find Care Now</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-base w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <Link href="/caregiver/register">Join as Caregiver</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
