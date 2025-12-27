"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", ...props }, ref) => {
    const baseStyles =
      "flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm hover:border-input/80 hover:bg-background";

    const errorStyles = error
      ? "border-red-500/50 text-red-900 focus-visible:ring-red-500 bg-red-50/10"
      : "";

    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-sm font-semibold tracking-tight text-foreground/80 ml-1">
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`${baseStyles} ${errorStyles} ${className}`}
          {...props}
        />
        {helperText && !error && (
          <p className="text-xs text-muted-foreground ml-1">{helperText}</p>
        )}
        {error && (
          <p className="text-xs font-medium text-red-500 ml-1 animate-in slide-in-from-top-1 fade-in duration-200">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
