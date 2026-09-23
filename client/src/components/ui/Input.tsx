import React from "react";
import { cn } from "../../utils/cn";

interface FieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

export const Field: React.FC<FieldProps> = ({ label, htmlFor, hint, error, children }) => {
  return (
    <div className="w-full">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      ) : hint ? (
        <p className="text-sm text-slate-500 mt-1">{hint}</p>
      ) : null}
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full bg-white border rounded-md px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-1 disabled:bg-slate-100 disabled:opacity-60",
          error ? "border-red-500" : "border-slate-300",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

