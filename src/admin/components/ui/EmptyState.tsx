// src/admin/components/ui/EmptyState.tsx
import React from "react";

interface EmptyStateProps {
  /** One of the preset types, or provide custom icon + heading + body */
  type?: "transactions" | "categories" | "orders" | "stock" | "books" | "authors" | "banners" | "users" | "generic";
  heading?: string;
  body?: string;
  /** Optional CTA */
  action?: {
    label: string;
    onClick: () => void;
    variant?: "dark" | "outline";
  };
}

const PRESETS: Record<
  NonNullable<EmptyStateProps["type"]>,
  { svg: React.ReactNode; heading: string; body: string }
> = {
  transactions: {
    svg: (
      <svg width="48" height="48" fill="none" stroke="#dee2e6" viewBox="0 0 24 24" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    heading: "No transactions yet",
    body:    "Completed order payments will appear here.",
  },
  categories: {
    svg: (
      <svg width="48" height="48" fill="none" stroke="#dee2e6" viewBox="0 0 24 24" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    heading: "No categories created",
    body:    "Add your first category to organise the catalogue.",
  },
  orders: {
    svg: (
      <svg width="48" height="48" fill="none" stroke="#dee2e6" viewBox="0 0 24 24" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    heading: "No orders placed yet",
    body:    "Customer orders will show up here once they start shopping.",
  },
  stock: {
    svg: (
      <svg width="48" height="48" fill="none" stroke="#dee2e6" viewBox="0 0 24 24" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    heading: "All books well-stocked",
    body:    "Low stock alerts will appear here when inventory runs low.",
  },
  books: {
    svg: (
      <svg width="48" height="48" fill="none" stroke="#dee2e6" viewBox="0 0 24 24" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    heading: "No books in the catalogue",
    body:    "Add your first book to begin selling.",
  },
  authors: {
    svg: (
      <svg width="48" height="48" fill="none" stroke="#dee2e6" viewBox="0 0 24 24" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    heading: "No authors added",
    body:    "Authors help customers discover books by their favourite writers.",
  },
  banners: {
    svg: (
      <svg width="48" height="48" fill="none" stroke="#dee2e6" viewBox="0 0 24 24" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    heading: "No banners configured",
    body:    "Create promotional banners to highlight featured books and sales.",
  },
  users: {
    svg: (
      <svg width="48" height="48" fill="none" stroke="#dee2e6" viewBox="0 0 24 24" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    heading: "No registered users",
    body:    "Customer accounts will appear here after they sign up.",
  },
  generic: {
    svg: (
      <svg width="48" height="48" fill="none" stroke="#dee2e6" viewBox="0 0 24 24" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    ),
    heading: "Nothing here yet",
    body:    "Items will appear here once added.",
  },
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = "generic",
  heading,
  body,
  action,
}) => {
  const preset = PRESETS[type];

  return (
    <div
      className="flex flex-col items-center justify-center text-center py-16 px-6"
      style={{ minHeight: 240 }}
    >
      {/* Icon ring */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
        style={{ background: "#f8f9fa", border: "1px solid rgba(0,0,0,0.08)" }}
      >
        {preset.svg}
      </div>

      {/* Heading */}
      <h3
        className="text-base font-bold mb-2"
        style={{ color: "#161619", letterSpacing: "-0.01em" }}
      >
        {heading ?? preset.heading}
      </h3>

      {/* Body */}
      <p className="text-sm max-w-xs leading-relaxed" style={{ color: "#7c6e65" }}>
        {body ?? preset.body}
      </p>

      {/* CTA */}
      {action && (
        <button
          onClick={action.onClick}
          className={`mt-6 px-5 py-2 text-sm font-bold rounded transition-all cursor-pointer ${
            action.variant === "outline" ? "bw-btn-outline" : "bw-btn-dark"
          }`}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
