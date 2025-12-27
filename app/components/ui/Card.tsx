"use client";

import { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "flat" | "bordered";
}

export default function Card({
  children,
  className = "",
  onClick,
  variant = "default",
  ...props
}: CardProps) {
  // 高級感のあるカードスタイル：角丸を大きく、影を柔らかく、ボーダーを繊細に
  const baseStyles = "rounded-2xl transition-all duration-300 overflow-hidden";
  
  const variants = {
    default: "bg-card text-card-foreground shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] border border-border/50 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.1)]",
    flat: "bg-secondary/50 text-card-foreground border-none",
    bordered: "bg-transparent border border-border text-card-foreground",
  };

  const interactiveStyles = onClick
    ? "cursor-pointer active:scale-[0.99]"
    : "";

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${interactiveStyles} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
