import React from "react";
import { cn } from "../../utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info" | "outline";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = "default",
  size = "md",
  ...props
}) => {
  const variants = {
    default: "bg-surface-800 text-surface-300 border-surface-700",
    success: "bg-emerald-950/60 text-emerald-400 border-emerald-800/50",
    warning: "bg-amber-950/60 text-amber-400 border-amber-800/50",
    error: "bg-rose-950/60 text-rose-400 border-rose-800/50",
    info: "bg-blue-950/60 text-blue-400 border-blue-800/50",
    outline: "bg-transparent text-surface-400 border-surface-700"
  };

  const sizes = {
    sm: "text-[10px] px-1.5 py-0.5 font-mono",
    md: "text-xs px-2.5 py-1"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-md border gap-1 select-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
