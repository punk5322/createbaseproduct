import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  isLoading?: boolean;
}

export function Logo({ className = "", isLoading = false }: LogoProps) {
  return (
    <div className={cn(
      "relative",
      isLoading && "animate-spin duration-1000",
      className
    )}>
      <img 
        src="/CreateBase_Emblem.png" 
        alt="CreateBase" 
        className="w-8 h-8 object-contain"
      />
    </div>
  );
}