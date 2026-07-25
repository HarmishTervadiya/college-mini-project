import React from "react";
import { cn } from "../../utils/cn";

export interface ProgressProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  status?: "default" | "success" | "warning" | "error";
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  showLabel = false,
  size = "md",
  className,
  status = "default"
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3"
  };

  const statusColors = {
    default: "bg-surface-200",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-rose-500"
  };

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs font-mono text-surface-400">
          <span>Progress</span>
          <span>{percentage.toFixed(1)}%</span>
        </div>
      )}
      <div className={cn("w-full bg-surface-800 rounded-full overflow-hidden", sizeClasses[size])}>
        <div
          className={cn("h-full transition-all duration-300 rounded-full", statusColors[status])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
