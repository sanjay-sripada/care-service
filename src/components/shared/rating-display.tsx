import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingDisplayProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}

export function RatingDisplay({
  rating,
  reviewCount,
  size = "md",
  showCount = true,
  className,
}: RatingDisplayProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div className={cn("flex items-center gap-1.5", sizeClasses[size], className)}>
      <Star className={cn(iconSizes[size], "fill-warning text-warning")} />
      <span className="font-semibold">{rating.toFixed(1)}</span>
      {showCount && reviewCount !== undefined && (
        <span className="text-muted-foreground">({reviewCount})</span>
      )}
    </div>
  );
}
