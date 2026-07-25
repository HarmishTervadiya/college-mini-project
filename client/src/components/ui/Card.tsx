import React from "react";
import { cn } from "../../utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hover = false, ...props }) => {
  return (
    <div
      className={cn(
        "bg-surface-900/70 backdrop-blur-sm border border-surface-800 rounded-xl p-5",
        hover && "transition-all duration-200 hover:border-surface-700 hover:bg-surface-900/90",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 pb-4 border-b border-surface-800/80 mb-4", className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className, ...props }) => (
  <h3 className={cn("text-base font-semibold text-surface-100 tracking-tight", className)} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ children, className, ...props }) => (
  <p className={cn("text-xs text-surface-400 leading-relaxed", className)} {...props}>
    {children}
  </p>
);
