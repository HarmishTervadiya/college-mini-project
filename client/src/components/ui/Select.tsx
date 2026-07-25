import React from "react";
import { cn } from "../../utils/cn";

export interface SelectOption {
  value: string;
  label: string;
  desc?: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: readonly SelectOption[] | SelectOption[];
  error?: string;
  hint?: string;
}

export const Select: React.FC<SelectProps> = ({
  className,
  label,
  options,
  error,
  hint,
  value,
  onChange,
  ...props
}) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-medium text-surface-300">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className={cn(
            "w-full bg-surface-900 border border-surface-800 rounded-lg px-3 py-2 text-xs text-surface-100 transition-colors focus:outline-none focus:border-surface-600 focus:ring-1 focus:ring-surface-600 disabled:opacity-50 appearance-none cursor-pointer pr-8",
            error && "border-rose-700/80 focus:border-rose-500",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-surface-900 text-surface-100 py-1">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-surface-500">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="text-[11px] text-rose-400">{error}</p>}
      {hint && !error && <p className="text-[11px] text-surface-500">{hint}</p>}
    </div>
  );
};
