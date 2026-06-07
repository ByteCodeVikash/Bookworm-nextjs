// src/admin/pages/SettingsPage.tsx
import React, { useEffect, useState } from "react";
import { adminApi } from "../services/adminApi";

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({
    store_name: "",
    store_email: "",
    store_phone: "",
    store_address: "",
    shipping_cost_flat: "0.00",
    currency_symbol: "$",
    paypal_client_id: "",
    stripe_public_key: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    adminApi.getSettings()
      .then((res) => {
        if (res.status === "success") {
          setSettings((prev) => ({
            ...prev,
            ...res.data,
          }));
        } else {
          setError("Failed to fetch settings.");
        }
      })
      .catch((err) => {
        setError("Error loading settings: " + err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsSaving(true);

    try {
      const res = await adminApi.updateSettings(settings);
      if (res.status === "success") {
        setSuccessMsg("Settings updated successfully!");
        // Clear message after 3 seconds
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        setError((res as any).error || "Failed to update store settings.");
      }
    } catch (err: any) {
      setError("Error saving settings: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse text-left max-w-4xl mx-auto">
        <div className="h-10 bg-gray-100 rounded w-1/4"></div>
        <div className="h-96 bg-white rounded border border-gray-100"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Store Configurations</h2>
        <p className="text-xs font-medium text-gray-400 mt-0.5">Manage details, checkout parameters, and checkout API keys.</p>
      </div>

      {successMsg && (
        <div className="p-4 rounded bg-green-50 border border-green-100 text-sm text-green-600 font-semibold flex items-center gap-2">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded bg-rose-50 border border-rose-100 text-sm text-rose-600 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Store info */}
        <div className="bw-card p-6 shadow-sm space-y-6">
          <h3 className="text-md font-bold text-gray-800 border-b border-gray-50 pb-3">General Store Info</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Store Title</label>
              <input
                type="text"
                name="store_name"
                value={settings.store_name}
                onChange={handleChange}
                placeholder="Bookworm Bookstore"
                className="bw-input px-4 py-2.5 w-full text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Customer Support Email</label>
              <input
                type="email"
                name="store_email"
                value={settings.store_email}
                onChange={handleChange}
                placeholder="support@bookworm.com"
                className="bw-input px-4 py-2.5 w-full text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Contact Phone Number</label>
              <input
                type="text"
                name="store_phone"
                value={settings.store_phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                className="bw-input px-4 py-2.5 w-full text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Warehouse/Billing Address</label>
              <textarea
                name="store_address"
                value={settings.store_address}
                onChange={handleChange}
                rows={2}
                placeholder="123 Bookstore St, Booktown, BK 10001"
                className="bw-input px-4 py-2.5 w-full text-sm resize-none"
              />
            </div>
          </div>
        </div>

        {/* Ecommerce Settings */}
        <div className="bw-card p-6 shadow-sm space-y-6">
          <h3 className="text-md font-bold text-gray-800 border-b border-gray-50 pb-3">Checkout Logistics & Currency</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Flat Rate Shipping Fee ($)</label>
              <input
                type="number"
                step="0.01"
                name="shipping_cost_flat"
                value={settings.shipping_cost_flat}
                onChange={handleChange}
                placeholder="5.00"
                className="bw-input px-4 py-2.5 w-full text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Currency Symbol</label>
              <input
                type="text"
                name="currency_symbol"
                value={settings.currency_symbol}
                onChange={handleChange}
                placeholder="$"
                maxLength={3}
                className="bw-input px-4 py-2.5 w-full text-sm"
              />
            </div>
          </div>
        </div>

        {/* Integration API keys */}
        <div className="bw-card p-6 shadow-sm space-y-6">
          <h3 className="text-md font-bold text-gray-800 border-b border-gray-50 pb-3">Payment Credentials Integration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">PayPal Client ID</label>
              <input
                type="text"
                name="paypal_client_id"
                value={settings.paypal_client_id}
                onChange={handleChange}
                placeholder="e.g. ARz... (PayPal REST API sandbox/live client ID)"
                className="bw-input px-4 py-2.5 w-full text-sm font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Stripe Publishable Key</label>
              <input
                type="text"
                name="stripe_public_key"
                value={settings.stripe_public_key}
                onChange={handleChange}
                placeholder="e.g. pk_test_..."
                className="bw-input px-4 py-2.5 w-full text-sm font-mono"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="bw-btn-red px-6 py-3 text-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving settings...</span>
              </>
            ) : (
              <span>Save Configurations</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
