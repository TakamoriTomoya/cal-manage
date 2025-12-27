"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-xl font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ring-offset-background active:scale-[0.98]";

  const variantStyles = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90 border border-transparent", // shadow-md hover:shadow-lg を削除
    secondary:
      "bg-white text-secondary-foreground border border-border/60 hover:bg-secondary/50 hover:border-border shadow-sm",
    danger:
      "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 hover:border-red-200 shadow-sm",
    ghost:
      "hover:bg-secondary/80 text-foreground/80 hover:text-foreground",
    outline:
      "border-2 border-primary text-primary bg-transparent hover:bg-primary/5",
  };

  const sizeStyles = {
    sm: "h-9 px-4 text-xs",
    md: "h-11 px-6 text-sm",
    lg: "h-14 px-8 text-base",
    icon: "h-11 w-11",
  };

  const widthStyles = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
