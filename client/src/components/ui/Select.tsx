import React from "react";
import { cn } from "../../utils/cn";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  error?: boolean;
}

export const Select: React.FC<SelectProps> = ({ className, options, error, ...props }) => {
  return (
    <select
      className={cn(
        "w-full bg-white border rounded-md px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-1 disabled:bg-slate-100 disabled:opacity-60",
        error ? "border-red-500" : "border-slate-300",
        className
      )}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

