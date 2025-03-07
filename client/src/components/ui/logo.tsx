import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  isLoading?: boolean;
}

export function Logo({ className = "", isLoading = false }: LogoProps) {
  return (
    <div className={cn(
      "text-xl font-semibold",
      isLoading && "animate-spin duration-1000",
      className
    )}>
      CreateBase
    </div>
  );
}