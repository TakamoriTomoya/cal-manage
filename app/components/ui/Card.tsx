"use client";

import { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function Card({
  children,
  className = "",
  onClick,
  ...props
}: CardProps) {
  const baseStyles =
    "rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow";

  const interactiveStyles = onClick
    ? "cursor-pointer hover:shadow-md"
    : "";

  return (
    <div
      className={`${baseStyles} ${interactiveStyles} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

