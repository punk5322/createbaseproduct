import React from "react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <img 
      src="/assets/CreateBase-WORDMARK-02.png"
      alt="CreateBase"
      className={`h-8 ${className}`}
    />
  );
}
