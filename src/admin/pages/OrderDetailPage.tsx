// src/admin/pages/OrderDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { adminApi } from "../services/adminApi";
import { AdminOrder } from "../types";

export const OrderDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrderDetails = () => {
    if (!id) return;
    setIsLoading(true);
    adminApi.getOrderById(String(id))
      .then((res) => {
        if (res.status === "success") {
          setOrder(res.data);
        } else {
          setError("Order not found.");
        }
      })
      .catch((err) => {
        setError("Error loading order detail: " + err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadOrderDetails();
  }, [id]);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!order) return;
    const newStatus = e.target.value;
    setIsUpdating(true);
    try {
      const res = await adminApi.updateOrderStatus(order.id, newStatus);
      if (res.status === "success") {
        setOrder((prev) => prev ? { ...prev, status: newStatus as any } : null);
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      alert("Error updating order: " + err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse text-left">
        <div className="h-10 bg-gray-100 rounded w-1/4"></div>
        <div className="h-48 bg-white rounded border border-gray-100"></div>
        <div className="h-64 bg-white rounded border border-gray-100"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-4 rounded bg-rose-50 border border-rose-100 text-sm text-rose-600 font-medium text-left">
        {error || "Could not retrieve order details."}
      </div>
    );
  }

  const items = order.items || [];

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto print:p-0 print:bg-white print:shadow-none">
      {/* Top action header */}
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/orders")}
            className="bw-btn-outline p-2 cursor-pointer flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Order #{order.id}</h2>
            <p className="text-xs font-medium text-gray-400 mt-0.5">
              Placed on {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="bw-btn-outline px-4 py-2 text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Invoice
          </button>

          <div className="flex items-center gap-2 border-l border-gray-100 pl-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status:</span>
            <select
              value={order.status}
              onChange={handleStatusChange}
              disabled={isUpdating}
              className="bw-input px-3 py-2 text-xs font-semibold text-gray-700 cursor-pointer"
            >
              <option value="Processing">Processing</option>
              <option value="On hold">On hold</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoice Branding (for printing only) */}
      <div className="hidden print:flex items-center justify-between border-b border-gray-200 pb-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">BOOKWORM</h1>
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Store Invoice</span>
        </div>
        <div className="text-right flex flex-col text-xs text-gray-500 font-medium">
          <span className="font-bold text-gray-900 text-sm">Invoice ID: #{order.id}</span>
          <span>Date Placed: {new Date(order.created_at).toLocaleDateString()}</span>
          <span>Payment: {order.payment_method}</span>
        </div>
      </div>

      {/* Info grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer contact card */}
        <div className="bw-card p-5 shadow-sm space-y-3 print:border-none print:shadow-none print:p-0">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 pb-2">Customer Account</h3>
          <div className="space-y-1 text-xs">
            <span className="font-bold text-gray-800 block">{order.first_name} {order.last_name}</span>
            <span className="text-gray-500 block">{order.email}</span>
            <span className="text-gray-500 block">{order.phone}</span>
            {order.company_name && <span className="text-gray-400 block italic">Company: {order.company_name}</span>}
          </div>
        </div>

        {/* Shipping address card */}
        <div className="bw-card p-5 shadow-sm space-y-3 print:border-none print:shadow-none print:p-0">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 pb-2">Shipping Destination</h3>
          <div className="space-y-1 text-xs text-gray-500">
            <span className="text-gray-800 font-bold block">{order.first_name} {order.last_name}</span>
            <span className="block">{order.street_address}</span>
            {order.apartment && <span className="block">{order.apartment}</span>}
            <span className="block">{order.city}, {order.county || ""} {order.postcode}</span>
            <span className="block font-semibold text-gray-600">{order.country}</span>
          </div>
        </div>

        {/* Order Meta details */}
        <div className="bw-card p-5 shadow-sm space-y-3 print:border-none print:shadow-none print:p-0">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 pb-2">Logistics Summary</h3>
          <div className="space-y-1.5 text-xs text-gray-500">
            <div className="flex items-center justify-between">
              <span>Shipping Method:</span>
              <span className="font-semibold text-gray-700">{order.shipping_method}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Payment Mode:</span>
              <span className="font-semibold text-gray-700">{order.payment_method}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Coupon Code:</span>
              <span className="font-mono bg-gray-50 border border-gray-100 px-1 py-0.5 rounded text-[10px] text-gray-600">
                {order.coupon_code || "NONE"}
              </span>
            </div>
            {order.order_notes && (
              <div className="pt-2 border-t border-gray-50 text-[10px] text-gray-400">
                <span className="font-bold text-gray-500 uppercase tracking-wider block mb-0.5">Notes:</span>
                <p className="italic">"{order.order_notes}"</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ordered Line Items list */}
      <div className="bw-card shadow-sm overflow-hidden print:border-none print:shadow-none">
        <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/20 print:bg-white print:px-0">
          <h3 className="text-sm font-bold text-gray-800">Shopping Cart Items</h3>
        </div>
        
        <table className="min-w-full divide-y divide-gray-100 text-left text-xs font-medium text-gray-600 print:divide-gray-200">
          <thead className="bg-gray-50/50 text-[10px] uppercase font-bold text-gray-400 tracking-wider print:bg-white">
            <tr>
              <th className="px-6 py-3 print:px-0">Product Cover</th>
              <th className="px-6 py-3 print:px-0">Book Name</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3 text-center">Qty</th>
              <th className="px-6 py-3 text-right">Line Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">
            {items.map((item, idx) => (
              <tr key={item.id || idx} className="hover:bg-gray-50/20">
                <td className="px-6 py-4 print:px-0">
                  <img
                    src={item.image_url || "https://placehold.co/100x150/f3f4f6/9ca3af?text=Cover"}
                    alt={item.book_title}
                    className="w-10 h-14 object-cover rounded shadow-sm border border-gray-100"
                  />
                </td>
                <td className="px-6 py-4 print:px-0 font-bold text-gray-800">{item.book_title}</td>
                <td className="px-6 py-4 font-mono">${Number(item.price).toFixed(2)}</td>
                <td className="px-6 py-4 text-center">{item.quantity}</td>
                <td className="px-6 py-4 text-right font-bold font-mono text-gray-900">
                  ${(Number(item.price) * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Summary */}
        <div className="p-6 bg-gray-50/50 flex flex-col items-end gap-2 text-xs border-t border-gray-50 print:bg-white print:px-0">
          <div className="w-64 space-y-2 text-gray-500 font-semibold">
            <div className="flex items-center justify-between">
              <span>Subtotal:</span>
              <span className="font-mono text-gray-900 font-bold">${Number(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping Fee:</span>
              <span className="font-mono text-gray-900 font-bold">${Number(order.shipping_cost).toFixed(2)}</span>
            </div>
            {Number(order.discount_amount) > 0 && (
              <div className="flex items-center justify-between text-green-600">
                <span>Discount applied:</span>
                <span className="font-mono font-bold">-${Number(order.discount_amount).toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm border-t border-gray-200 pt-2 text-gray-900 font-extrabold uppercase">
              <span>Grand Total:</span>
              <span className="font-mono text-[#f75454] font-black">${Number(order.grand_total).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
