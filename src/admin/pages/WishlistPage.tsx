// src/admin/pages/WishlistPage.tsx
// Read-only admin viewer for user wishlists
import React, { useEffect, useState } from "react";
import { adminApi } from "../services/adminApi";
import { AdminWishlistItem } from "../types";
import { DataTable, Column } from "../components/ui/DataTable";

const PAGE_SIZE = 20;

export const WishlistPage: React.FC = () => {
  const [items, setItems] = useState<AdminWishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [pagination, setPagination] = useState<any>(null);

  const loadWishlist = () => {
    setIsLoading(true);
    adminApi
      .getWishlist({ page, limit })
      .then((res) => {
        if (res.status === "success") {
          setItems(res.data.wishlist);
          setPagination(res.data.pagination);
        } else {
          setError("Failed to fetch wishlist.");
        }
      })
      .catch((err) => setError("Error loading wishlist: " + err.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadWishlist();
  }, [page, limit]);

  const columns: Column<AdminWishlistItem>[] = [
    {
      header: "Book",
      accessor: (item) => (
        <div className="flex items-center gap-3 text-left">
          {item.book_image_url && (
            <img
              src={item.book_image_url}
              alt={item.book_title || "Book"}
              className="w-10 h-14 object-cover rounded border border-gray-100 flex-shrink-0"
            />
          )}
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800 text-sm">
              {item.book_title || <span className="text-gray-400 italic">Book deleted</span>}
            </span>
            <span className="text-xs text-gray-400 font-mono">ID: {item.book_id}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Price",
      accessor: (item) =>
        item.book_price != null ? (
          <span className="text-sm font-semibold text-gray-700">${Number(item.book_price).toFixed(2)}</span>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        ),
    },
    {
      header: "Customer",
      accessor: (item) => (
        <div className="flex flex-col text-left">
          <span className="text-sm font-semibold text-gray-800">
            {item.user_name || <span className="text-gray-400 italic">Unknown</span>}
          </span>
          <span className="text-xs text-gray-400">{item.user_email}</span>
        </div>
      ),
    },
    {
      header: "Saved At",
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Wishlist Viewer</h2>
          <p className="text-xs font-medium text-gray-400 mt-0.5">
            Read-only view of books customers have saved to their wishlists.
          </p>
        </div>
        <span className="bw-badge bw-badge-neutral">
          {pagination?.total || 0} total entries
        </span>
      </div>

      {error && (
        <div className="p-4 rounded bg-rose-50 border border-rose-100 text-sm text-rose-600 font-medium">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={(p) => setPage(p)}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(1);
        }}
        emptyMessage="No wishlist entries found."
      />
    </div>
  );
};
