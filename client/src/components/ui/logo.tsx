import React from "react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`text-3xl font-bold ${className}`}>
      CreateBase
    </div>
  );
}