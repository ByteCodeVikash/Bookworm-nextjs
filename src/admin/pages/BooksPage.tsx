// src/admin/pages/BooksPage.tsx
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { adminApi } from "../services/adminApi";
import { AdminBook } from "../types";
import { DataTable, Column, TableActionDropdown } from "../components/ui/DataTable";
import { Modal } from "../components/ui/Modal";

export const BooksPage: React.FC = () => {
  const router = useRouter();
  const [books, setBooks] = useState<AdminBook[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<AdminBook | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  const loadBooks = () => {
    setIsLoading(true);
    adminApi.getBooks({ search, page, limit })
      .then((res) => {
        if (res.status === "success") {
          setBooks(res.data.books);
          setPagination(res.data.pagination);
        } else {
          setError("Failed to fetch books.");
        }
      })
      .catch((err) => {
        setError("Error fetching books: " + err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadBooks();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, page, limit]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await adminApi.deleteBook(deleteTarget.id);
      if (res.status === "success") {
        setDeleteTarget(null);
        setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
        loadBooks();
      } else {
        alert("Failed to delete book.");
      }
    } catch (err) {
      alert("Error deleting book: " + err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async (ids: (string | number)[]) => {
    if (!confirm(`Are you sure you want to delete the ${ids.length} selected books?`)) return;
    setIsLoading(true);
    try {
      await Promise.all(ids.map((id) => adminApi.deleteBook(String(id))));
      setSelectedIds([]);
      loadBooks();
    } catch (err) {
      alert("Error executing bulk delete: " + err);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: Column<AdminBook>[] = [
    {
      header: "Book",
      accessor: (item) => (
        <div className="flex items-center gap-3">
          <img
            src={item.image_url}
            alt={item.title}
            className="w-10 h-14 object-cover rounded bg-gray-100 shadow-sm border border-gray-100 shrink-0"
          />
          <div className="flex flex-col text-left">
            <span className="font-bold text-gray-800 line-clamp-1 max-w-[200px]">{item.title}</span>
            <span className="text-[10px] font-semibold text-gray-400">ID: {item.id}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Author",
      accessor: (item) => (
        <span className="text-gray-700 font-medium">{item.author_name || "Unknown"}</span>
      ),
    },
    {
      header: "Category",
      accessor: (item) => (
        <span className="bw-badge bw-badge-neutral">
          {item.category_name || "General"}
        </span>
      ),
    },
    {
      header: "Price",
      accessor: (item) => (
        <div className="flex flex-col text-left font-mono">
          <span className="font-bold text-gray-900">${Number(item.price).toFixed(2)}</span>
          {item.original_price && (
            <span className="text-[10px] text-gray-400 line-through">
              ${Number(item.original_price).toFixed(2)}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Stock",
      accessor: (item) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            item.stock_status === 1
              ? "bg-green-50 text-green-700 border border-green-100"
              : "bg-rose-50 text-rose-700 border border-rose-100"
          }`}
        >
          {item.stock_status === 1 ? "In Stock" : "Out of Stock"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (item) => (
        <TableActionDropdown
          actions={[
            {
              label: "Edit Book",
              onClick: () => router.push(`/admin/books/edit/${item.id}`),
              icon: (
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              ),
            },
            {
              label: "Delete Book",
              onClick: () => setDeleteTarget(item),
              variant: "danger",
              icon: (
                <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Manage Catalog</h2>
          <p className="text-xs font-medium text-gray-400 mt-0.5">Add, edit, or remove books from the bookstore.</p>
        </div>
        <Link
          href="/admin/books/new"
          className="bw-btn-red px-4 py-2.5 text-sm inline-flex items-center justify-center cursor-pointer decoration-transparent"
        >
          Create Book
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-sm text-rose-600 font-medium">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={books}
        isLoading={isLoading}
        searchPlaceholder="Search by book title, author, or ID..."
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
            label: "Delete Selected",
            onClick: handleBulkDelete,
            className: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-500/20",
          },
        ]}
        emptyMessage="No matching books found in the catalog."
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Deletion"
        footer={
          <>
            <button
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-500/10 cursor-pointer flex items-center gap-1.5"
            >
              {isDeleting ? "Deleting..." : "Delete Book"}
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete <span className="font-bold text-gray-800">{deleteTarget?.title}</span>?
            This action is permanent and will remove the book from all user search results and categories.
          </p>
        </div>
      </Modal>
    </div>
  );
};

