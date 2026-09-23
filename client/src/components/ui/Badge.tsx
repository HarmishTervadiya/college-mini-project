import React from "react";
import { cn } from "../../utils/cn";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "neutral" | "success" | "warning" | "error" | "info";
}

export const Badge: React.FC<BadgeProps> = ({ children, className, tone = "neutral", ...props }) => {
  const tones = {
    neutral: "bg-slate-100 text-slate-700",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
    error: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-800",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded px-2 py-0.5 text-xs",
        tones[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

