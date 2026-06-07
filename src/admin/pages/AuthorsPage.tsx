// src/admin/pages/AuthorsPage.tsx
import React, { useEffect, useState } from "react";
import { adminApi } from "../services/adminApi";
import { AdminAuthor } from "../types";
import { DataTable, Column, TableActionDropdown } from "../components/ui/DataTable";
import { Modal } from "../components/ui/Modal";

export const AuthorsPage: React.FC = () => {
  const [authors, setAuthors] = useState<AdminAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form modal states
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formAuthor, setFormAuthor] = useState({
    id: "",
    name: "",
    image_url: "",
    bio: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // Delete target
  const [deleteTarget, setDeleteTarget] = useState<AdminAuthor | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  const loadAuthors = () => {
    setIsLoading(true);
    adminApi.getAuthors()
      .then((res) => {
        if (res.status === "success") {
          setAuthors(res.data);
          setSelectedIds([]);
        } else {
          setError("Failed to fetch authors list.");
        }
      })
      .catch((err) => {
        setError("Error fetching authors: " + err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setFormAuthor({ id: "", name: "", image_url: "", bio: "" });
    setIsOpen(true);
  };

  const handleOpenEdit = (item: AdminAuthor) => {
    setIsEditMode(true);
    setFormAuthor({
      id: item.id,
      name: item.name,
      image_url: item.image_url || "",
      bio: item.bio || "",
    });
    setIsOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAuthor.name) {
      alert("Author Name is required.");
      return;
    }
    setIsSaving(true);
    try {
      let res;
      if (isEditMode) {
        res = await adminApi.updateAuthor(formAuthor.id, formAuthor);
      } else {
        res = await adminApi.createAuthor(formAuthor);
      }
      
      if (res.status === "success") {
        setIsOpen(false);
        loadAuthors();
      } else {
        alert("Failed to save author record.");
      }
    } catch (err) {
      alert("Error saving author: " + err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await adminApi.deleteAuthor(deleteTarget.id);
      if (res.status === "success") {
        setDeleteTarget(null);
        setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
        loadAuthors();
      } else {
        alert("Failed to delete author.");
      }
    } catch (err) {
      alert("Error deleting author: " + err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async (ids: (string | number)[]) => {
    if (!confirm(`Are you sure you want to delete the ${ids.length} selected authors?`)) return;
    setIsLoading(true);
    try {
      await Promise.all(ids.map((id) => adminApi.deleteAuthor(String(id))));
      setSelectedIds([]);
      loadAuthors();
    } catch (err) {
      alert("Error executing bulk delete: " + err);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: Column<AdminAuthor>[] = [
    {
      header: "Author Details",
      accessor: (item) => (
        <div className="flex items-center gap-3 text-left">
          <img
            src={item.image_url || "https://placehold.co/100x100/f3f4f6/9ca3af?text=Author"}
            alt={item.name}
            className="w-10 h-10 object-cover rounded-full border border-gray-100 shadow-sm bg-gray-50 shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://placehold.co/100x100/f3f4f6/9ca3af?text=Author";
            }}
          />
          <div className="flex flex-col">
            <span className="font-bold text-gray-800">{item.name}</span>
            <span className="text-[10px] text-gray-400 font-semibold uppercase">ID: {item.id}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Biography Summary",
      accessor: (item) => (
        <span className="text-gray-500 text-xs line-clamp-1 max-w-sm font-medium">
          {item.bio || "No biography provided."}
        </span>
      ),
    },
    {
      header: "Books Cataloged",
      accessor: (item) => (
        <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
          {item.books_count || 0} books
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (item) => (
        <TableActionDropdown
          actions={[
            {
              label: "Edit Author",
              onClick: () => handleOpenEdit(item),
              icon: (
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              ),
            },
            {
              label: "Delete Author",
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
          <h2 className="text-xl font-bold text-gray-900">Manage Authors</h2>
          <p className="text-xs font-medium text-gray-400 mt-0.5">Maintain the biographies and photos of store authors.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bw-btn-red px-4 py-2.5 text-sm cursor-pointer"
        >
          Add Author
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-sm text-rose-600 font-medium">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={authors}
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
        emptyMessage="No authors records configured."
      />

      {/* Editor Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={isEditMode ? "Modify Author details" : "Create Author profile"}
        footer={
          <>
            <button
              onClick={() => setIsOpen(false)}
              disabled={isSaving}
              className="bw-btn-outline px-4 py-2 text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleFormSubmit}
              disabled={isSaving}
              className="bw-btn-red px-4 py-2 text-sm cursor-pointer flex items-center gap-1.5"
            >
              {isSaving ? "Saving..." : "Save Author"}
            </button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Author Name *</label>
            <input
              type="text"
              name="name"
              value={formAuthor.name}
              onChange={(e) => setFormAuthor((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. F. Scott Fitzgerald"
              className="bw-input px-4 py-2.5 w-full text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Image Profile URL (optional)</label>
            <input
              type="text"
              name="image_url"
              value={formAuthor.image_url}
              onChange={(e) => setFormAuthor((prev) => ({ ...prev, image_url: e.target.value }))}
              placeholder="e.g. https://example.com/fitzgerald.jpg"
              className="bw-input px-4 py-2.5 w-full text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Short Biography</label>
            <textarea
              name="bio"
              value={formAuthor.bio}
              onChange={(e) => setFormAuthor((prev) => ({ ...prev, bio: e.target.value }))}
              rows={4}
              placeholder="F. Scott Fitzgerald was an American novelist, essayist, and short story writer..."
              className="bw-input px-4 py-3 w-full text-sm"
            />
          </div>
        </form>
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
              {isDeleting ? "Deleting..." : "Delete Author"}
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete author <span className="font-bold text-gray-800">{deleteTarget?.name}</span>?
            This will dissociate all books under this author, setting their author link to general.
          </p>
        </div>
      </Modal>
    </div>
  );
};
