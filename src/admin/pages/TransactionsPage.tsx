// src/admin/pages/TransactionsPage.tsx
// Read-only admin viewer for payment transactions
import React, { useEffect, useState } from "react";
import { adminApi } from "../services/adminApi";
import { AdminTransaction } from "../types";
import { DataTable, Column } from "../components/ui/DataTable";

const PAGE_SIZE = 20;

const STATUS_COLORS: Record<AdminTransaction["status"], string> = {
  pending:   "text-amber-600 bg-amber-50",
  completed: "text-emerald-600 bg-emerald-50",
  failed:    "text-rose-600 bg-rose-50",
  refunded:  "text-gray-600 bg-gray-100",
};

const STATUS_LABELS: Record<AdminTransaction["status"], string> = {
  pending:   "Pending",
  completed: "Completed",
  failed:    "Failed",
  refunded:  "Refunded",
};

export const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [pagination, setPagination] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadTransactions = () => {
    setIsLoading(true);
    adminApi
      .getTransactions({ search, status: statusFilter || undefined, page, limit })
      .then((res) => {
        if (res.status === "success") {
          setTransactions(res.data.transactions);
          setPagination(res.data.pagination);
        } else {
          setError("Failed to fetch transactions.");
        }
      })
      .catch((err) => setError("Error loading transactions: " + err.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTransactions();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, limit, search, statusFilter]);

  const columns: Column<AdminTransaction>[] = [
    {
      header: "Transaction Ref",
      accessor: (item) => (
        <div className="flex flex-col text-left">
          <span className="font-mono text-xs font-semibold text-gray-700">{item.transaction_ref}</span>
          <span className="text-xs text-gray-400 mt-0.5">via {item.payment_gateway}</span>
        </div>
      ),
    },
    {
      header: "Order",
      accessor: (item) => (
        <div className="flex flex-col text-left">
          <span className="font-mono text-xs text-gray-900 font-bold">#{item.order_id}</span>
          {(item.first_name || item.last_name) && (
            <span className="text-xs text-gray-400">
              {[item.first_name, item.last_name].filter(Boolean).join(" ")}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Amount",
      accessor: (item) => (
        <span className="text-sm font-bold text-gray-800">
          {item.currency} {Number(item.amount).toFixed(2)}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (item) => (
        <span
          className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[item.status]}`}
        >
          {STATUS_LABELS[item.status]}
        </span>
      ),
    },
    {
      header: "Date",
      accessor: (item) => (
        <span className="text-xs text-gray-500">
          {new Date(item.created_at).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Transactions Viewer</h2>
          <p className="text-xs font-medium text-gray-400 mt-0.5">
            Read-only log of all payment transactions linked to orders.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bw-input px-3 py-2 text-xs font-semibold text-gray-700 cursor-pointer"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded bg-rose-50 border border-rose-100 text-sm text-rose-600 font-medium">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={transactions}
        isLoading={isLoading}
        searchPlaceholder="Search by transaction reference or order ID..."
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
        emptyMessage="No transactions found."
      />
    </div>
  );
};
