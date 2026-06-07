// src/admin/pages/OrdersPage.tsx
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { adminApi } from "../services/adminApi";
import { AdminOrder } from "../types";
import { DataTable, Column, TableActionDropdown } from "../components/ui/DataTable";

export const OrdersPage: React.FC = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  const loadOrders = () => {
    setIsLoading(true);
    adminApi.getOrders({ search, status: statusFilter, page, limit })
      .then((res) => {
        if (res.status === "success") {
          setOrders(res.data.orders);
          setPagination(res.data.pagination);
          setSelectedIds([]);
        } else {
          setError("Failed to fetch orders.");
        }
      })
      .catch((err) => {
        setError("Error loading orders: " + err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadOrders();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter, page, limit]);

  const handleBulkStatusChange = async (ids: (string | number)[], status: string) => {
    if (!confirm(`Are you sure you want to change status of ${ids.length} selected orders to "${status}"?`)) return;
    setIsLoading(true);
    try {
      await Promise.all(ids.map((id) => adminApi.updateOrderStatus(String(id), status)));
      setSelectedIds([]);
      loadOrders();
    } catch (err) {
      alert("Error updating order statuses: " + err);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: Column<AdminOrder>[] = [
    {
      header: "Order ID",
      accessor: (item) => (
        <Link href={`/admin/orders/${item.id}`} className="font-bold text-gray-900 hover:text-[#f75454] hover:underline">
          #{item.id}
        </Link>
      ),
    },
    {
      header: "Customer",
      accessor: (item) => (
        <div className="flex flex-col text-left">
          <span className="font-semibold text-gray-800">
            {item.first_name} {item.last_name}
          </span>
          <span className="text-[10px] text-gray-400 font-medium">{item.email}</span>
        </div>
      ),
    },
    {
      header: "Date Placed",
      accessor: (item) => (
        <span className="text-gray-500 font-medium text-xs">
          {new Date(item.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      header: "Grand Total",
      accessor: (item) => (
        <span className="font-bold text-gray-900 font-mono">${Number(item.grand_total).toFixed(2)}</span>
      ),
    },
    {
      header: "Status",
      accessor: (item) => {
        const colors = {
          "Completed": "bg-green-50 text-green-700 border border-green-100",
          "Processing": "bg-orange-50 text-orange-700 border border-orange-100",
          "On hold": "bg-amber-50 text-amber-700 border border-amber-100",
          "Cancelled": "bg-rose-50 text-rose-700 border border-rose-100",
        };
        return (
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
              colors[item.status] || colors["On hold"]
            }`}
          >
            {item.status}
          </span>
        );
      },
    },
    {
      header: "Actions",
      accessor: (item) => (
        <TableActionDropdown
          actions={[
            {
              label: "View Details",
              onClick: () => router.push(`/admin/orders/${item.id}`),
              icon: (
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ),
            },
            {
              label: "Mark Completed",
              onClick: async () => {
                try {
                  await adminApi.updateOrderStatus(String(item.id), "Completed");
                  loadOrders();
                } catch (err) {
                  alert("Failed to update status: " + err);
                }
              },
              icon: (
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
            {
              label: "Mark Processing",
              onClick: async () => {
                try {
                  await adminApi.updateOrderStatus(String(item.id), "Processing");
                  loadOrders();
                } catch (err) {
                  alert("Failed to update status: " + err);
                }
              },
              icon: (
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
          ]}
        />
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Manage Orders</h2>
          <p className="text-xs font-medium text-gray-400 mt-0.5">Track and update customer bookstore purchases.</p>
        </div>

        {/* Status quick toggle */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none cursor-pointer"
          >
            <option value="">All Orders</option>
            <option value="Processing">Processing</option>
            <option value="On hold">On hold</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-sm text-rose-600 font-medium">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={orders}
        isLoading={isLoading}
        searchPlaceholder="Search by customer name, order ID, or email..."
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        pagination={pagination}
        onPageChange={(p) => setPage(p)}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(1);
        }}
        selectedIds={selectedIds}
        onSelectedIdsChange={setSelectedIds}
        bulkActions={[
          {
            label: "Mark Completed",
            onClick: (ids) => handleBulkStatusChange(ids, "Completed"),
            className: "bg-green-600 hover:bg-green-700 text-white shadow-sm shadow-green-500/20",
          },
          {
            label: "Mark Processing",
            onClick: (ids) => handleBulkStatusChange(ids, "Processing"),
            className: "bg-orange-600 hover:bg-orange-700 text-white shadow-sm shadow-orange-500/20",
          },
          {
            label: "Cancel Selected",
            onClick: (ids) => handleBulkStatusChange(ids, "Cancelled"),
            className: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-500/20",
          },
        ]}
        emptyMessage="No customer orders found matching filter criteria."
      />
    </div>
  );
};

