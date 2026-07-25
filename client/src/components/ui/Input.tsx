import React from "react";
import { cn } from "../../utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, icon, type = "text", ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-medium text-surface-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 text-surface-500 pointer-events-none flex items-center">
              {icon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            className={cn(
              "w-full bg-surface-900 border border-surface-800 rounded-lg px-3 py-2 text-xs text-surface-100 placeholder:text-surface-500 transition-colors focus:outline-none focus:border-surface-600 focus:ring-1 focus:ring-surface-600 disabled:opacity-50 disabled:bg-surface-950",
              icon && "pl-9",
              error && "border-rose-700/80 focus:border-rose-500 focus:ring-rose-500",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-[11px] text-rose-400">{error}</p>}
        {hint && !error && <p className="text-[11px] text-surface-500">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
