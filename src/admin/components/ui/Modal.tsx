// src/admin/components/ui/Modal.tsx
import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
}) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidths = { sm: 448, md: 560, lg: 672, xl: 896 };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop — Bookworm brand dark */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(22,22,25,0.50)" }}
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className="relative z-10 w-full bg-white flex flex-col bw-fade-in"
        style={{
          maxWidth: maxWidths[size],
          maxHeight: "90vh",
          borderRadius: 0,
          border: "1px solid rgba(0,0,0,0.09)",
          boxShadow: "none",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}
        >
          <h3
            className="text-sm font-bold"
            style={{ color: "#161619", letterSpacing: "-0.01em" }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded-none transition-colors cursor-pointer"
            style={{ color: "#7c6e65", border: "1px solid rgba(0,0,0,0.08)", background: "transparent" }}
            aria-label="Close modal"
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#f8f9fa"; (e.currentTarget as HTMLButtonElement).style.color = "#161619"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#7c6e65"; }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 text-sm" style={{ color: "#7c6e65" }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className="px-6 py-4 flex items-center justify-end gap-3 shrink-0"
            style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
