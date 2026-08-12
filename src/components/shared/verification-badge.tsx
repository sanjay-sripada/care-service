import { cn } from "@/lib/utils";
import { Badge as BadgePrimitive } from "@/components/ui/badge";
import { ShieldCheck, CheckCircle } from "lucide-react";

interface VerificationBadgeProps {
  identityVerified?: boolean;
  backgroundVerified?: boolean;
  className?: string;
}

export function VerificationBadge({
  identityVerified = false,
  backgroundVerified = false,
  className,
}: VerificationBadgeProps) {
  if (!identityVerified && !backgroundVerified) return null;

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {identityVerified && (
        <BadgePrimitive variant="secondary" className="bg-success/10 text-success border-success/20 gap-1">
          <ShieldCheck className="h-3 w-3" />
          ID Verified
        </BadgePrimitive>
      )}
      {backgroundVerified && (
        <BadgePrimitive variant="secondary" className="bg-primary/10 text-primary border-primary/20 gap-1">
          <CheckCircle className="h-3 w-3" />
          Background Checked
        </BadgePrimitive>
      )}
    </div>
  );
}
