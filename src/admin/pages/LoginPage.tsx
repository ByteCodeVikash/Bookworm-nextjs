// src/admin/pages/LoginPage.tsx
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAdminAuth } from "../hooks/useAdminAuth";

export const LoginPage: React.FC = () => {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.replace("/admin/dashboard");
    }
  }, [isAuthenticated, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const success = await login({ email, password });
      if (!success) {
        setError("Invalid credentials. Please try again.");
      }
    } catch {
      setError("Login failed. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f8f9fa" }}>
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: "#161619", borderTopColor: "transparent" }}
          />
          <span className="text-sm font-medium" style={{ color: "#7c6e65" }}>
            Verifying session...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "#f8f9fa", fontFamily: "Inter, sans-serif" }}
    >
      <div className="w-full" style={{ maxWidth: 420 }}>

        {/* ── Brand Header ── */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <span
              className="font-black tracking-tighter text-2xl"
              style={{ color: "#161619", letterSpacing: "-0.045em" }}
            >
              BOOKWORM
            </span>
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-none"
              style={{
                color: "#f75454",
                background: "#fff5f5",
                border: "1px solid rgba(247,84,84,0.2)",
              }}
            >
              Admin
            </span>
          </div>
          <p className="text-sm font-medium" style={{ color: "#7c6e65" }}>
            Sign in to the management console
          </p>
        </div>

        {/* ── Login Card ── */}
        <div
          className="bw-card p-8"
          style={{
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "none",
          }}
        >
          {/* Error banner */}
          {error && (
            <div
              className="flex items-start gap-2.5 p-3 rounded-none mb-5"
              style={{
                background: "#fff5f5",
                border: "1px solid rgba(247,84,84,0.2)",
              }}
            >
              <svg className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#f75454" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium" style={{ color: "#f75454" }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-email"
                className="block text-[11px] font-bold uppercase tracking-wider"
                style={{ color: "#7c6e65" }}
              >
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bookworm.com"
                disabled={isLoading}
                className="bw-input w-full px-3.5 py-2.5 text-sm disabled:opacity-60"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-password"
                className="block text-[11px] font-bold uppercase tracking-wider"
                style={{ color: "#7c6e65" }}
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="bw-input w-full px-3.5 py-2.5 text-sm disabled:opacity-60"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="bw-btn-dark w-full py-2.5 text-sm flex items-center justify-center gap-2"
              style={{ marginTop: 20 }}
            >
              {isLoading ? (
                <>
                  <div
                    className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: "rgba(255,255,255,0.5)", borderTopColor: "transparent" }}
                  />
                  Signing in...
                </>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>
          </form>
        </div>

        {/* ── Demo credentials ── */}
        <div
          className="mt-4 rounded-none p-4 bg-white"
          style={{ border: "1px solid rgba(0,0,0,0.08)" }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-2.5"
            style={{ color: "#7f7f83" }}
          >
            Demo Credentials
          </p>
          <div className="space-y-1.5">
            {[
              { label: "Email", value: "admin@bookworm.com" },
              { label: "Password", value: "admin123" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-3 text-xs">
                <span className="font-medium w-16 shrink-0" style={{ color: "#7c6e65" }}>
                  {label}
                </span>
                <code
                  className="font-mono font-semibold text-[11px] px-2 py-0.5 rounded-none"
                  style={{
                    color: "#161619",
                    background: "#f8f9fa",
                    border: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  {value}
                </code>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
