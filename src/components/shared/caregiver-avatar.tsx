"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface CaregiverAvatarProps {
  name: string;
  photo: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "h-10 w-10",
  md: "h-14 w-14",
  lg: "h-20 w-20",
  xl: "h-28 w-28",
};

export function CaregiverAvatar({ name, photo, size = "md", className }: CaregiverAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Avatar className={cn(sizeMap[size], "ring-2 ring-primary/10", className)}>
      <AvatarImage src={photo} alt={name} />
      <AvatarFallback className="bg-primary/10 text-primary font-semibold">{initials}</AvatarFallback>
    </Avatar>
  );
}
