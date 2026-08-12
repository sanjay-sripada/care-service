import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { SERVICES } from "@/lib/constants";
import { Heart, Stethoscope, Building2, ArrowRight } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Heart,
  Stethoscope,
  Building2,
};

export function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Popular Services</h2>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional, non-medical care assistance tailored to your family&apos;s needs
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {SERVICES.map((service) => {
            const Icon = iconMap[service.icon] || Heart;
            return (
              <Link key={service.id} href={`/book?service=${service.category}`}>
                <Card className="h-full transition-all hover:shadow-lg hover:border-primary/30 group cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <ul className="space-y-1.5 mb-4">
                      {service.subServices.slice(0, 3).map((sub) => (
                        <li key={sub} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {sub}
                        </li>
                      ))}
                    </ul>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                      Book now <ArrowRight className="h-4 w-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
