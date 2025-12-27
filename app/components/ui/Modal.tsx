"use client";

import { ReactNode, useEffect, useState } from "react";
import Button from "./Button";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  showCloseButton?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // ESCキーで閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // モーダルが開いている時は背景のスクロールを無効化
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        className="relative w-full max-w-lg transform overflow-hidden rounded-3xl bg-card shadow-2xl ring-1 ring-black/5 transition-all animate-in zoom-in-95 slide-in-from-bottom-2 duration-300 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {title && (
          <div className="flex-shrink-0 border-b border-border/50 px-6 py-4 bg-secondary/20">
            <h2 className="text-lg font-bold tracking-tight text-foreground">{title}</h2>
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto px-6 py-6 text-foreground">
          {children}
        </div>
        
        {showCloseButton && (
          <div className="flex-shrink-0 flex justify-end px-6 py-4 bg-secondary/20 border-t border-border/50">
            <Button variant="secondary" onClick={onClose} size="sm">
              閉じる
            </Button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
