// src/admin/components/ui/StatsCard.tsx
import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string | number;
    isPositive: boolean;
  };
  /** accent: 'red' | 'dark' | 'green' | 'amber' */
  accent?: "red" | "dark" | "green" | "amber" | "muted";
  /** Optional subtitle shown below value */
  subtitle?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  accent = "dark",
  subtitle,
}) => {
  const accentConfig: Record<
    string,
    { iconBg: string; iconColor: string; border: string; dotColor: string }
  > = {
    red: {
      iconBg: "#fff5f5",
      iconColor: "#f75454",
      border: "rgba(247,84,84,0.15)",
      dotColor: "#f75454",
    },
    dark: {
      iconBg: "#f8f9fa",
      iconColor: "#161619",
      border: "rgba(0,0,0,0.1)",
      dotColor: "#161619",
    },
    green: {
      iconBg: "#f0fdf4",
      iconColor: "#16a34a",
      border: "rgba(22,163,74,0.15)",
      dotColor: "#16a34a",
    },
    amber: {
      iconBg: "#fffbeb",
      iconColor: "#d97706",
      border: "rgba(217,119,6,0.15)",
      dotColor: "#d97706",
    },
    muted: {
      iconBg: "#f5f4f8",
      iconColor: "#7c6e65",
      border: "rgba(0,0,0,0.08)",
      dotColor: "#7c6e65",
    },
  };

  const cfg = accentConfig[accent] ?? accentConfig.dark;

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        borderRadius: 0,
        padding: "24px 22px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 16,
        boxShadow: "none",
        cursor: "default",
        position: "relative",
        zIndex: 0,
        overflow: "hidden",
        height: "100%",
      }}
    >
      {/* Top row: title + icon */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <span
          style={{
            fontSize: "0.72rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "#71717a",
            lineHeight: 1,
          }}
        >
          {title}
        </span>
        {/* Icon container */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: cfg.iconBg,
            color: cfg.iconColor,
            border: `1px solid ${cfg.border}`,
            flexShrink: 0,
            position: "relative",
            zIndex: 1,
          }}
        >
          {icon}
        </div>
      </div>

      {/* Value */}
      <div style={{ marginTop: 2 }}>
        <p
          style={{
            margin: 0,
            fontSize: "1.85rem",
            fontWeight: 800,
            color: "#161619",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          {value}
        </p>
        {subtitle && (
          <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "#71717a", fontWeight: 450 }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Trend indicator */}
      {trend && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: "0.72rem",
              fontWeight: 700,
              color: trend.isPositive ? "#16a34a" : "#f75454",
              background: trend.isPositive ? "#f0fdf4" : "#fff5f5",
              border: `1px solid ${trend.isPositive ? "rgba(22,163,74,0.12)" : "rgba(247,84,84,0.12)"}`,
              padding: "2px 8px",
              borderRadius: 0,
            }}
          >
            {trend.isPositive ? (
              <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor">
                <path d="M5 2L9 8H1L5 2Z" />
              </svg>
            ) : (
              <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor">
                <path d="M5 8L9 2H1L5 8Z" />
              </svg>
            )}
            {trend.value}
          </span>
          <span style={{ fontSize: "0.72rem", color: "#a1a1aa", fontWeight: 450 }}>
            vs last month
          </span>
        </div>
      )}
    </div>
  );
};
