// src/admin/pages/DashboardPage.tsx
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi } from "../services/adminApi";
import { AdminDashboardData } from "../types";
import { StatsCard } from "../components/ui/StatsCard";
import { Modal } from "../components/ui/Modal";

// ── Demo fallback data (shown when DB is empty) ──────────────────────────────
const DEMO_SALES_CHART = [
  { date: "Mon", sales: 1240 },
  { date: "Tue", sales: 2850 },
  { date: "Wed", sales: 1980 },
  { date: "Thu", sales: 3410 },
  { date: "Fri", sales: 4200 },
  { date: "Sat", sales: 3760 },
  { date: "Sun", sales: 2930 },
];
const DEMO_CATEGORIES = [
  { name: "Fiction",          sales_count: 148 },
  { name: "Science & Tech",   sales_count: 112 },
  { name: "Self-Help",        sales_count: 94  },
  { name: "Biography",        sales_count: 67  },
  { name: "Children's Books", sales_count: 43  },
];
const DEMO_ORDERS = [
  { id: "ORD-2901", first_name: "Sarah",   last_name: "Connor",  grand_total: 78.49,  status: "Completed"  },
  { id: "ORD-2900", first_name: "John",    last_name: "Doe",     grand_total: 124.00, status: "Processing" },
  { id: "ORD-2899", first_name: "Priya",   last_name: "Sharma",  grand_total: 39.99,  status: "Completed"  },
  { id: "ORD-2898", first_name: "Marcus",  last_name: "Webb",    grand_total: 215.30, status: "On hold"    },
  { id: "ORD-2897", first_name: "Emily",   last_name: "Zhang",   grand_total: 54.00,  status: "Cancelled"  },
  { id: "ORD-2896", first_name: "Liam",    last_name: "O'Brien", grand_total: 89.75,  status: "Completed"  },
];
const DEMO_LOW_STOCK = [
  { id: "BK-0042", title: "React 19 & Next.js 15 Handbook",  image_url: "https://placehold.co/40x52/f8f9fa/161619?text=R19",  price: 49.99 },
  { id: "BK-0017", title: "The Design of Everyday Things",   image_url: "https://placehold.co/40x52/f8f9fa/161619?text=DE",  price: 34.50 },
];
const DEMO_KPIS = {
  totalSales: 28_640,
  totalOrders: 847,
  totalBooks: 312,
  totalCustomers: 1_204,
  lowStockCount: 2,
};


export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Chart hover interaction state
  const [activePointIdx, setActivePointIdx] = useState<number | null>(null);

  // Low stock update modal state
  const [updatingBook, setUpdatingBook] = useState<any | null>(null);
  const [newStockStatus, setNewStockStatus] = useState<number>(1);
  const [isUpdatingStock, setIsUpdatingStock] = useState<boolean>(false);

  const loadDashboardStats = () => {
    setIsLoading(true);
    adminApi.getDashboardStats()
      .then((res) => {
        if (res.status === "success") {
          setStats(res.data);
        } else {
          setError("Failed to fetch dashboard data.");
        }
      })
      .catch((err) => {
        setError("Error loading dashboard metrics: " + err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const handleQuickStockUpdate = async () => {
    if (!updatingBook) return;
    setIsUpdatingStock(true);
    try {
      // 1. Get current full book details
      const bookRes = await adminApi.getBookById(updatingBook.id);
      if (bookRes.status === "success") {
        const fullBook = bookRes.data;
        // 2. Perform the update
        const updateRes = await adminApi.updateBook(updatingBook.id, {
          ...fullBook,
          stock_status: newStockStatus,
        });
        if (updateRes.status === "success") {
          setUpdatingBook(null);
          // Reload dashboard stats
          const freshRes = await adminApi.getDashboardStats();
          if (freshRes.status === "success") {
            setStats(freshRes.data);
          }
        } else {
          alert("Failed to update stock status.");
        }
      } else {
        alert("Failed to retrieve book details.");
      }
    } catch (err) {
      alert("Error updating stock: " + err);
    } finally {
      setIsUpdatingStock(false);
    }
  };

  if (isLoading && !stats) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-32 bg-white rounded-none border border-gray-100"></div>
          ))}
        </div>
        <div className="h-96 bg-white rounded-none border border-gray-100"></div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6 rounded-none bg-rose-50 border border-rose-100 text-sm font-medium text-rose-600">
        {error || "Could not retrieve statistics."}
      </div>
    );
  }

  const { kpis: rawKpis, salesChart: rawChart, recentOrders: rawOrders, lowStockBooks: rawLowStock, popularCategories: rawCats } = stats;

  // Use demo data when real data is empty/zero
  const isNoData =
    rawOrders.length === 0 &&
    rawCats.length === 0 &&
    rawKpis.totalOrders === 0;

  const kpis           = isNoData ? DEMO_KPIS                                               : rawKpis;
  const salesChart     = (!rawChart.length || rawChart.every((d) => d.sales === 0)) ? DEMO_SALES_CHART : rawChart;
  const recentOrders   = isNoData ? DEMO_ORDERS                                             : rawOrders;
  const lowStockBooks  = isNoData ? DEMO_LOW_STOCK                                          : rawLowStock;
  const popularCategories = isNoData ? DEMO_CATEGORIES                                      : rawCats;


  // Compute SVG chart coordinates
  const chartWidth = 500;
  const chartHeight = 200;
  const padding = 35;
  const maxSales = Math.max(...salesChart.map((d) => d.sales), 50.0);

  const points = salesChart.map((d, index) => {
    const x = padding + (index * (chartWidth - padding * 2)) / (salesChart.length - 1);
    // Invert y because SVG 0 is top
    const y = chartHeight - padding - (d.sales * (chartHeight - padding * 2)) / maxSales;
    return { x, y, sales: d.sales, date: d.date };
  });

  const generateBezierPath = (pts: typeof points) => {
    if (pts.length === 0) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i];
      const next = pts[i + 1];
      const cp1x = curr.x + (next.x - curr.x) / 3;
      const cp1y = curr.y;
      const cp2x = curr.x + (2 * (next.x - curr.x)) / 3;
      const cp2y = next.y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }
    return d;
  };

  const pathD = generateBezierPath(points);

  const fillD = points.length
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`
    : "";

  return (
    <div className="space-y-8 text-left">
      {/* Demo data notice */}
      {isNoData && (
        <div
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-none text-xs font-semibold"
          style={{
            background: "#fffbeb",
            border: "1px solid rgba(217,119,6,0.2)",
            color: "#92400e",
          }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Showing demo data — connect your database to see live statistics.
        </div>
      )}

      {/* KPI Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Revenue"
          value={`$${Number(kpis.totalSales).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          accent="red"
          trend={{ value: "4.8%", isPositive: true }}
          subtitle="Lifetime gross sales"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Total Orders"
          value={Number(kpis.totalOrders).toLocaleString()}
          accent="dark"
          trend={{ value: "1.2%", isPositive: true }}
          subtitle="All time order count"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          }
        />
        <StatsCard
          title="Books in Catalog"
          value={Number(kpis.totalBooks).toLocaleString()}
          accent="muted"
          subtitle="Published listings"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
        />
        <StatsCard
          title="Active Customers"
          value={Number(kpis.totalCustomers).toLocaleString()}
          accent="green"
          trend={{ value: "6.3%", isPositive: true }}
          subtitle="Registered accounts"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
      </div>

      {/* Sales Trend Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bw-card p-6 lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold" style={{ color: "#161619" }}>Weekly Sales Analytics</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Visual representation of daily gross revenues</p>
            </div>
            <span className="bw-badge bw-badge-neutral text-[10px] uppercase tracking-wider font-semibold">Revenues (USD)</span>
          </div>
          
          {/* Custom SVG Line Graph */}
          <div className="w-full relative pt-2">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-64 overflow-visible"
              role="img"
              aria-label="Weekly Sales Analytics chart showing revenue trends"
            >
              {/* Defs for gradients & shadows */}
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f75454" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#f75454" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal grid lines (Vercel style) */}
              <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="#f4f4f5" strokeWidth={1} strokeDasharray="3 3" />
              <line x1={padding} y1={padding + (chartHeight - padding * 2) * 0.33} x2={chartWidth - padding} y2={padding + (chartHeight - padding * 2) * 0.33} stroke="#f4f4f5" strokeWidth={1} strokeDasharray="3 3" />
              <line x1={padding} y1={padding + (chartHeight - padding * 2) * 0.66} x2={chartWidth - padding} y2={padding + (chartHeight - padding * 2) * 0.66} stroke="#f4f4f5" strokeWidth={1} strokeDasharray="3 3" />
              <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#e4e4e7" strokeWidth={1} />
              
              {/* Path calculations */}
              {points.length > 0 && (
                <>
                  <path d={fillD} fill="url(#chartGrad)" />
                  <path d={pathD} fill="none" stroke="#f75454" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                </>
              )}

              {/* Draw hover line indicator */}
              {activePointIdx !== null && points[activePointIdx] && (
                <g>
                  <line x1={points[activePointIdx].x} y1={padding} x2={points[activePointIdx].x} y2={chartHeight - padding} stroke="rgba(247, 84, 84, 0.25)" strokeWidth={1} strokeDasharray="3 3" />
                  <circle cx={points[activePointIdx].x} cy={points[activePointIdx].y} r={6} fill="#f75454" fillOpacity={0.15} />
                  <circle cx={points[activePointIdx].x} cy={points[activePointIdx].y} r={3.5} fill="#f75454" stroke="#fff" strokeWidth={1.5} />
                </g>
              )}

              {/* Data points and static labels */}
              {points.map((p, idx) => (
                <g key={idx}>
                  <circle cx={p.x} cy={p.y} r={3} fill="#fff" stroke="#f75454" strokeWidth={1.5} />
                  {/* X Axis labels */}
                  <text
                    x={p.x}
                    y={chartHeight - padding + 16}
                    textAnchor="middle"
                    className="text-[10px] font-medium text-gray-400"
                  >
                    {p.date}
                  </text>
                </g>
              ))}

              {/* Interactive invisible hover rectangles */}
              {points.map((p, idx) => {
                const rectWidth = (chartWidth - padding * 2) / (points.length - 1);
                const xStart = p.x - rectWidth / 2;
                return (
                  <rect
                    key={`hover-trigger-${idx}`}
                    x={xStart}
                    y={padding}
                    width={rectWidth}
                    height={chartHeight - padding * 2}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setActivePointIdx(idx)}
                    onMouseLeave={() => setActivePointIdx(null)}
                  />
                );
              })}
            </svg>

            {/* Custom Interactive HTML Tooltip with cursor values */}
            {activePointIdx !== null && points[activePointIdx] && (
              <div className="absolute z-20 pointer-events-none bw-tooltip flex flex-col gap-0.5 shadow-lg" style={{ left: `${(points[activePointIdx].x / chartWidth) * 100}%`, top: `${(points[activePointIdx].y / chartHeight) * 100 - 65}%`, transform: "translateX(-50%)" }}>
                <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.6)" }}>{points[activePointIdx].date}</span>
                <span className="font-bold text-xs">${points[activePointIdx].sales.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Popular Categories Card */}
        <div className="bw-card p-6 space-y-5">
          <div>
            <h4 className="text-sm font-bold" style={{ color: "#161619" }}>Popular Categories</h4>
            <p className="text-[11px] text-gray-400 mt-0.5">Top-selling genres in current lifecycle</p>
          </div>
          <div className="space-y-4">
            {popularCategories.length === 0 ? (
              <span className="text-sm text-gray-400 block py-6 text-center">No categories stats.</span>
            ) : (
              popularCategories.map((c, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-gray-700">{c.name}</span>
                    <span className="text-gray-400">{c.sales_count} orders</span>
                  </div>
                  <div className="w-full h-2 rounded-none overflow-hidden" style={{ background: "rgba(0,0,0,0.04)" }}>
                    <div className="h-full rounded-none transition-all duration-500" style={{ background: "linear-gradient(90deg, #161619, #f75454)", width: `${Math.min((c.sales_count / Math.max(...popularCategories.map((x) => x.sales_count), 1)) * 100, 100)}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Orders & Low Stock warning */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders table */}
        <div className="bw-card p-6 lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold" style={{ color: "#161619" }}>Recent Transactions</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Latest customer orders processed</p>
            </div>
            <Link href="/admin/orders" className="text-xs font-bold uppercase tracking-wider hover:opacity-80 transition-opacity" style={{ color: "#f75454", textDecoration: "none" }}>View all →</Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-left text-xs font-medium text-gray-500">
              <thead style={{ background: "#f8f9fa", color: "#71717a" }} className="text-[10px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Order ID</th>
                  <th className="px-4 py-3.5">Customer</th>
                  <th className="px-4 py-3.5">Total Amount</th>
                  <th className="px-4 py-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600 bg-white">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#f8f9fa] transition-colors" style={{ borderBottom: "1px solid rgba(0,0,0,0.03)" }}>
                    <td className="px-4 py-4 font-bold" style={{ color: "#161619" }}>
                      <Link href={`/admin/orders/${o.id}`} style={{ textDecoration: "none", color: "inherit" }} className="hover:text-[#f75454] transition-colors">#{o.id}</Link>
                    </td>
                    <td className="px-4 py-4 text-gray-700">
                      {o.first_name} {o.last_name}
                    </td>
                    <td className="px-4 py-4 font-semibold text-gray-900">${Number(o.grand_total).toFixed(2)}</td>
                    <td className="px-4 py-4 text-right">
                      <span className={`bw-badge ${
                        o.status === "Completed" ? "bw-badge-success" : o.status === "Processing" ? "bw-badge-info" : o.status === "Cancelled" ? "bw-badge-danger" : "bw-badge-warning"
                      }`}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Warning Panel */}
        <div className="bw-card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold" style={{ color: "#161619" }}>Stock Shortages</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Products running low or out of stock</p>
            </div>
            {kpis.lowStockCount > 0 && (
              <span className="bw-badge bw-badge-danger font-semibold">{kpis.lowStockCount} items</span>
            )}
          </div>

          <div className="space-y-3">
            {lowStockBooks.length === 0 ? (
              <div className="py-6 text-center text-xs text-gray-400">All books are currently in-stock.</div>
            ) : (
              lowStockBooks.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-none transition-all border border-gray-100 hover:border-red-100 hover:bg-rose-50/20"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={b.image_url}
                      alt={b.title}
                      className="w-9 h-11 object-cover rounded-none bg-gray-50 shadow-none flex-shrink-0"
                    />
                    <div className="flex flex-col text-left min-w-0">
                      <span className="text-xs font-bold text-gray-800 truncate line-clamp-1">{b.title}</span>
                      <span className="text-[10px] font-semibold text-gray-400 mt-0.5">Price: ${Number(b.price).toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => { setUpdatingBook(b); setNewStockStatus(1); }}
                    className="bw-btn-dark text-[10px] px-2.5 py-1.5 flex-shrink-0 uppercase tracking-wider font-semibold"
                  >
                    Restock
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Stock Update Modal */}
      {updatingBook && (
        <Modal
          isOpen={true}
          onClose={() => setUpdatingBook(null)}
          title="Restock Product"
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <button onClick={() => setUpdatingBook(null)} className="bw-btn-outline px-4 py-2 text-xs font-semibold">Cancel</button>
              <button disabled={isUpdatingStock} onClick={handleQuickStockUpdate} className="bw-btn-dark px-4 py-2 text-xs font-semibold">{isUpdatingStock ? "Updating…" : "Save Changes"}</button>
            </div>
          }
        >
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-4 p-3 rounded-none bg-gray-50 border border-gray-100">
              <img
                src={updatingBook.image_url}
                alt={updatingBook.title}
                className="w-12 h-16 object-cover rounded-none bg-white border border-gray-200 shadow-none"
              />
              <div className="min-w-0">
                <h4 className="font-bold text-gray-900 text-sm truncate">{updatingBook.title}</h4>
                <p className="text-xs text-gray-400 mt-1 font-mono">ID: {updatingBook.id}</p>
                <p className="text-xs font-semibold text-[#f75454] mt-0.5">${Number(updatingBook.price).toFixed(2)}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: "#71717a" }}>Adjust Inventory Status</label>
              <select
                value={newStockStatus}
                onChange={(e) => setNewStockStatus(Number(e.target.value))}
                className="bw-input w-full px-3 py-2 text-sm cursor-pointer"
              >
                <option value={1}>In Stock (Make Available)</option>
                <option value={0}>Out of Stock (Mark Unavailable)</option>
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
