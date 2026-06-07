// src/admin/pages/SubscribersPage.tsx
import React, { useEffect, useState } from "react";
import { adminApi } from "../services/adminApi";
import { AdminSubscriber } from "../types";
import { DataTable, Column, TableActionDropdown } from "../components/ui/DataTable";
import { Modal } from "../components/ui/Modal";

export const SubscribersPage: React.FC = () => {
  const [subscribers, setSubscribers] = useState<AdminSubscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  // Delete/Unsubscribe state
  const [deleteTarget, setDeleteTarget] = useState<AdminSubscriber | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadSubscribers = () => {
    setIsLoading(true);
    adminApi.getSubscribers()
      .then((res) => {
        if (res.status === "success") {
          setSubscribers(res.data);
          setSelectedIds([]);
        } else {
          setError("Failed to fetch newsletter subscribers.");
        }
      })
      .catch((err) => {
        setError("Error loading subscribers list: " + err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await adminApi.deleteSubscriber(deleteTarget.id);
      if (res.status === "success") {
        setDeleteTarget(null);
        setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
        loadSubscribers();
      } else {
        alert("Failed to remove subscriber.");
      }
    } catch (err) {
      alert("Error removing subscriber: " + err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async (ids: (string | number)[]) => {
    if (!confirm(`Are you sure you want to remove the ${ids.length} selected subscribers?`)) return;
    setIsLoading(true);
    try {
      await Promise.all(ids.map((id) => adminApi.deleteSubscriber(Number(id))));
      setSelectedIds([]);
      loadSubscribers();
    } catch (err) {
      alert("Error removing subscribers: " + err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem("bookworm_admin_token");
      const res = await fetch("/api/admin/subscribers.php?export=csv", {
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
      });
      if (!res.ok) {
        throw new Error("Server returned error response.");
      }
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `newsletter_subscribers_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("CSV Export failed: " + err);
    }
  };

  const columns: Column<AdminSubscriber>[] = [
    {
      header: "Subscriber ID",
      accessor: (item) => <span className="font-semibold text-gray-500">#{item.id}</span>,
    },
    {
      header: "Email Address",
      accessor: (item) => <span className="font-bold text-gray-800 select-all">{item.email}</span>,
    },
    {
      header: "Subscribed Date",
      accessor: (item) => (
        <span className="text-gray-500 font-semibold text-xs">
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
      header: "Actions",
      accessor: (item) => (
        <TableActionDropdown
          actions={[
            {
              label: "Unsubscribe",
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
          <h2 className="text-xl font-bold text-gray-900">Newsletter Subscribers</h2>
          <p className="text-xs font-medium text-gray-400 mt-0.5">View and manage email list campaign signups.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="bw-btn-outline px-4 py-2.5 text-sm cursor-pointer flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV List
        </button>
      </div>

      {error && (
        <div className="p-4 rounded bg-rose-50 border border-rose-100 text-sm text-rose-600 font-medium">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={subscribers}
        isLoading={isLoading}
        selectedIds={selectedIds}
        onSelectedIdsChange={setSelectedIds}
        bulkActions={[
          {
            label: "Remove Selected",
            onClick: handleBulkDelete,
            className: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-500/20",
          },
        ]}
        emptyMessage="No customer signups currently subscribed."
      />

      {/* Delete/Unsubscribe Modal */}
      <Modal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Unsubscribe User"
        footer={
          <>
            <button
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
              className="bw-btn-outline px-4 py-2 text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bw-btn bg-rose-600 hover:bg-rose-700 text-white cursor-pointer flex items-center gap-1.5"
            >
              {isDeleting ? "Processing..." : "Confirm Removal"}
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            Are you sure you want to remove <span className="font-bold text-gray-800">{deleteTarget?.email}</span>?
            This will permanently delete their entry from the newsletter subscribers database.
          </p>
        </div>
      </Modal>
    </div>
  );
};
