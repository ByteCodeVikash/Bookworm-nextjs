// src/admin/pages/ContactsPage.tsx
import React, { useEffect, useState } from "react";
import { adminApi } from "../services/adminApi";
import { AdminContactMessage } from "../types";
import { DataTable, Column, TableActionDropdown } from "../components/ui/DataTable";
import { Modal } from "../components/ui/Modal";

export const ContactsPage: React.FC = () => {
  const [messages, setMessages] = useState<AdminContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  // Read message Modal state
  const [readTarget, setReadTarget] = useState<AdminContactMessage | null>(null);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<AdminContactMessage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadMessages = () => {
    setIsLoading(true);
    adminApi.getContactMessages()
      .then((res) => {
        if (res.status === "success") {
          setMessages(res.data);
          setSelectedIds([]);
        } else {
          setError("Failed to fetch contact inquiries.");
        }
      })
      .catch((err) => {
        setError("Error loading contact logs: " + err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await adminApi.deleteContactMessage(deleteTarget.id);
      if (res.status === "success") {
        setDeleteTarget(null);
        setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
        loadMessages();
      } else {
        alert("Failed to delete contact message.");
      }
    } catch (err) {
      alert("Error deleting message: " + err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async (ids: (string | number)[]) => {
    if (!confirm(`Are you sure you want to delete ${ids.length} selected messages?`)) return;
    setIsLoading(true);
    try {
      await Promise.all(ids.map((id) => adminApi.deleteContactMessage(Number(id))));
      setSelectedIds([]);
      loadMessages();
    } catch (err) {
      alert("Error deleting messages: " + err);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: Column<AdminContactMessage>[] = [
    {
      header: "Customer Detail",
      accessor: (item) => (
        <div className="flex flex-col text-left">
          <span className="font-bold text-gray-800">{item.name}</span>
          <span className="text-[10px] text-gray-400 font-semibold">{item.email}</span>
        </div>
      ),
    },
    {
      header: "Subject Inquiry",
      accessor: (item) => <span className="font-semibold text-gray-700">{item.subject}</span>,
    },
    {
      header: "Message Snippet",
      accessor: (item) => (
        <span className="text-gray-400 text-xs line-clamp-1 max-w-xs font-medium">
          {item.text}
        </span>
      ),
    },
    {
      header: "Date Sent",
      accessor: (item) => (
        <span className="text-gray-500 font-medium text-xs">
          {new Date(item.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
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
              label: "Read Message",
              onClick: () => setReadTarget(item),
              icon: (
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ),
            },
            {
              label: "Delete Message",
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
      <div>
        <h2 className="text-xl font-bold text-gray-900">Inquiry Messages Logs</h2>
        <p className="text-xs font-medium text-gray-400 mt-0.5">Read and manage inquiries sent via the Contact Us form.</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-sm text-rose-600 font-medium">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={messages}
        isLoading={isLoading}
        selectedIds={selectedIds}
        onSelectedIdsChange={setSelectedIds}
        bulkActions={[
          {
            label: "Delete Selected",
            onClick: handleBulkDelete,
            className: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-500/20",
          },
        ]}
        emptyMessage="No customer inquiry messages found in the logs."
      />

      {/* Read Message details Modal */}
      <Modal
        isOpen={readTarget !== null}
        onClose={() => setReadTarget(null)}
        title={readTarget ? `Message from: ${readTarget.name}` : "View Message"}
        footer={
          <button
            onClick={() => setReadTarget(null)}
            className="bw-btn-outline px-4 py-2 text-sm cursor-pointer"
          >
            Done Reading
          </button>
        }
      >
        {readTarget && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4 border-b border-gray-50 pb-3 text-xs text-gray-400 font-semibold">
              <div className="space-y-1">
                <span>Sender:</span>
                <span className="text-gray-800 block text-sm">{readTarget.name}</span>
              </div>
              <div className="space-y-1">
                <span>Email address:</span>
                <a href={`mailto:${readTarget.email}`} className="text-[#f75454] hover:underline block text-sm font-semibold">
                  {readTarget.email}
                </a>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Subject:</span>
              <p className="font-bold text-gray-800 text-md">{readTarget.subject}</p>
            </div>
            <div className="space-y-1 bg-gray-50/50 border border-gray-100 rounded-xl p-4 mt-2">
              <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Message body:</span>
              <p className="text-gray-700 leading-relaxed font-medium whitespace-pre-wrap mt-2">{readTarget.text}</p>
            </div>
            <span className="text-[10px] text-gray-400 font-semibold block text-right">
              Received: {new Date(readTarget.created_at).toLocaleString()}
            </span>
          </div>
        )}
      </Modal>

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
              {isDeleting ? "Deleting..." : "Delete Inquiry"}
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this message log? This action is permanent and cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
};
