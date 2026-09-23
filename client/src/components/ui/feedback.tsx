import React from "react";
import { cn } from "../../utils/cn";

export const Alert: React.FC<{ tone?: "error" | "success" | "info"; children: React.ReactNode; className?: string }> = ({
  tone = "error",
  children,
  className,
}) => {
  const tones = {
    error: "bg-red-50 border-red-200 text-red-800",
    success: "bg-green-50 border-green-200 text-green-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };
  return (
    <div className={cn("border rounded-md px-3 py-2 text-sm", tones[tone], className)}>
      {children}
    </div>
  );
};

export const EmptyState: React.FC<{ title: string; description: string; action?: React.ReactNode }> = ({
  title,
  description,
  action,
}) => {
  return (
    <div className="border border-slate-200 rounded-lg bg-white px-6 py-10 text-center">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">{description}</p>
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
};

export const PageHeader: React.FC<{ title: string; description?: string; action?: React.ReactNode }> = ({
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 mb-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        {description && <p className="text-sm text-slate-600 mt-1 max-w-2xl">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={cn("animate-pulse bg-slate-200 rounded", className)} />;
};

