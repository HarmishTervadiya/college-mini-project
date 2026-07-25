import React from "react";
import { cn } from "../../utils/cn";

export interface SliderProps {
  label?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  className?: string;
  helpText?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
  className,
  helpText
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="flex justify-between items-center text-xs">
        {label && <span className="font-medium text-surface-300">{label}</span>}
        <span className="font-mono text-xs text-surface-200 bg-surface-800 px-2 py-0.5 rounded border border-surface-700">
          {value}{unit}
        </span>
      </div>
      <div className="relative flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-surface-800 rounded-lg appearance-none cursor-pointer accent-surface-200 focus:outline-none"
          style={{
            background: `linear-gradient(to right, #71717a ${percentage}%, #27272a ${percentage}%)`
          }}
        />
      </div>
      {helpText && <p className="text-[11px] text-surface-500">{helpText}</p>}
    </div>
  );
};
