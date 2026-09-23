import React from "react";
import { cn } from "../../utils/cn";

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn("bg-white border border-slate-200 rounded-lg", className)} {...props}>
      {children}
    </div>
  );
};

