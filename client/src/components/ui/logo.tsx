import React from "react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <img 
      src="/attached_assets/CreateBase-WORDMARK-02.png"
      alt="CreateBase"
      className={`h-12 w-auto ${className}`}
      style={{ maxWidth: '200px' }}
    />
  );
}