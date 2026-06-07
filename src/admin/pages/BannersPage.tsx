// src/admin/pages/BannersPage.tsx
import React, { useEffect, useState } from "react";
import { adminApi } from "../services/adminApi";
import { AdminBanner } from "../types";
import { DataTable, Column, TableActionDropdown } from "../components/ui/DataTable";
import { Modal } from "../components/ui/Modal";
import { ImageUploader } from "../components/ui/ImageUploader";

const emptyForm = {
  title_prefix: "",
  title_highlighted: "",
  title_suffix: "",
  subtitle: "",
  image_url: "",
  action_url: "",
  sort_order: 0,
  is_active: 1,
};

export const BannersPage: React.FC = () => {
  const [banners, setBanners] = useState<AdminBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  // Modal form states
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  // Delete states
  const [deleteTarget, setDeleteTarget] = useState<AdminBanner | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadBanners = () => {
    setIsLoading(true);
    adminApi
      .getBanners()
      .then((res) => {
        if (res.status === "success") {
          setBanners(res.data);
          setSelectedIds([]);
        } else {
          setError("Failed to fetch banners.");
        }
      })
      .catch((err) => setError("Error loading banners: " + err.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setEditId(null);
    setForm(emptyForm);
    setIsOpen(true);
  };

  const handleOpenEdit = (item: AdminBanner) => {
    setIsEditMode(true);
    setEditId(item.id);
    setForm({
      title_prefix: item.title_prefix || "",
      title_highlighted: item.title_highlighted || "",
      title_suffix: item.title_suffix || "",
      subtitle: item.subtitle || "",
      image_url: item.image_url,
      action_url: item.action_url || "",
      sort_order: item.sort_order,
      is_active: item.is_active,
    });
    setIsOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image_url) {
      alert("Banner image URL is required.");
      return;
    }
    setIsSaving(true);
    try {
      let res;
      if (isEditMode && editId !== null) {
        res = await adminApi.updateBanner(editId, form);
      } else {
        res = await adminApi.createBanner(form);
      }
      if (res.status === "success") {
        setIsOpen(false);
        loadBanners();
      } else {
        alert("Failed to save banner.");
      }
    } catch (err) {
      alert("Error saving banner: " + err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await adminApi.deleteBanner(deleteTarget.id);
      if (res.status === "success") {
        setDeleteTarget(null);
        setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
        loadBanners();
      } else {
        alert("Failed to delete banner.");
      }
    } catch (err) {
      alert("Error deleting banner: " + err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async (ids: (string | number)[]) => {
    if (!confirm(`Are you sure you want to delete ${ids.length} selected banners?`)) return;
    setIsLoading(true);
    try {
      await Promise.all(ids.map((id) => adminApi.deleteBanner(Number(id))));
      setSelectedIds([]);
      loadBanners();
    } catch (err) {
      alert("Error deleting banners: " + err);
    } finally {
      setIsLoading(false);
    }
  };

  const setField = <K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const columns: Column<AdminBanner>[] = [
    {
      header: "Preview",
      accessor: (item) =>
        item.image_url ? (
          <img
            src={item.image_url}
            alt="Banner"
            className="w-24 h-14 object-cover rounded-lg border border-gray-100"
          />
        ) : (
          <div className="w-24 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
            No image
          </div>
        ),
    },
    {
      header: "Title",
      accessor: (item) => (
        <div className="flex flex-col gap-0.5 text-left">
          <span className="font-semibold text-gray-800 text-sm">
            {[item.title_prefix, item.title_highlighted, item.title_suffix].filter(Boolean).join(" ") || (
              <span className="text-gray-400 italic">No title set</span>
            )}
          </span>
          {item.subtitle && (
            <span className="text-xs text-gray-400 truncate max-w-xs">{item.subtitle}</span>
          )}
        </div>
      ),
    },
    {
      header: "Order",
      accessor: (item) => (
        <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
          #{item.sort_order}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (item) =>
        item.is_active ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
            Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block"></span>
            Inactive
          </span>
        ),
    },
    {
      header: "Actions",
      accessor: (item) => (
        <TableActionDropdown
          actions={[
            {
              label: "Edit Banner",
              onClick: () => handleOpenEdit(item),
              icon: (
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              ),
            },
            {
              label: "Delete Banner",
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Manage Banners</h2>
          <p className="text-xs font-medium text-gray-400 mt-0.5">
            Control homepage promotional slides and banner content.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bw-btn-red px-4 py-2.5 text-sm cursor-pointer"
        >
          Add Banner
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-sm text-rose-600 font-medium">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={banners}
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
        emptyMessage="No banners created yet."
      />

      {/* Save / Edit Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={isEditMode ? "Edit Banner" : "Create New Banner"}
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
              {isSaving ? "Saving..." : "Save Banner"}
            </button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Image */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              Banner Image *
            </label>
            <ImageUploader
              currentImageUrl={form.image_url || undefined}
              onUploadComplete={(url) => setField("image_url", url)}
              onRemove={() => setField("image_url", "")}
              onUpload={adminApi.uploadBookCover}
            />
            {/* Manual URL fallback */}
            <input
              type="text"
              value={form.image_url}
              onChange={(e) => setField("image_url", e.target.value)}
              placeholder="Or paste an image URL directly"
              className="bw-input px-4 py-2.5 w-full text-sm mt-2"
            />
          </div>

          {/* Title parts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Title Prefix
              </label>
              <input
                type="text"
                value={form.title_prefix}
                onChange={(e) => setField("title_prefix", e.target.value)}
                placeholder="e.g. Books that make you"
                className="bw-input px-3 py-2.5 w-full text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Highlighted Word
              </label>
              <input
                type="text"
                value={form.title_highlighted}
                onChange={(e) => setField("title_highlighted", e.target.value)}
                placeholder="e.g. think,"
                className="bw-input px-3 py-2.5 w-full text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Title Suffix
              </label>
              <input
                type="text"
                value={form.title_suffix}
                onChange={(e) => setField("title_suffix", e.target.value)}
                placeholder="e.g. feel, and grow."
                className="bw-input px-3 py-2.5 w-full text-sm"
              />
            </div>
          </div>

          {/* Subtitle */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              Subtitle
            </label>
            <textarea
              value={form.subtitle}
              onChange={(e) => setField("subtitle", e.target.value)}
              rows={2}
              placeholder="Short description shown below the title"
              className="bw-input px-4 py-2.5 w-full text-sm resize-none"
            />
          </div>

          {/* Action URL + Sort Order */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Action URL
              </label>
              <input
                type="text"
                value={form.action_url}
                onChange={(e) => setField("action_url", e.target.value)}
                placeholder="/shop"
                className="bw-input px-3 py-2.5 w-full text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Sort Order
              </label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setField("sort_order", Number(e.target.value))}
                min={0}
                className="bw-input px-3 py-2.5 w-full text-sm"
              />
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => setField("is_active", form.is_active ? 0 : 1)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                form.is_active ? "bg-[#f75454]" : "bg-gray-200"
              }`}
              aria-pressed={form.is_active === 1}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  form.is_active ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-sm font-semibold text-gray-700">Active</span>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete Banner"
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
              {isDeleting ? "Deleting..." : "Delete Banner"}
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-500">
          Are you sure you want to delete this banner? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};
