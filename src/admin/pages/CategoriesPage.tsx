// src/admin/pages/CategoriesPage.tsx
import React, { useEffect, useState } from "react";
import { adminApi } from "../services/adminApi";
import { AdminCategory } from "../types";
import { DataTable, Column, TableActionDropdown } from "../components/ui/DataTable";
import { Modal } from "../components/ui/Modal";

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal form states
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formCategory, setFormCategory] = useState({
    id: "",
    name: "",
    icon_class: "",
    image_url: "",
    slug: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // Delete states
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  const loadCategories = () => {
    setIsLoading(true);
    adminApi.getCategories()
      .then((res) => {
        if (res.status === "success") {
          setCategories(res.data);
          setSelectedIds([]);
        } else {
          setError("Failed to fetch categories.");
        }
      })
      .catch((err) => {
        setError("Error loading categories: " + err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setFormCategory({ id: "", name: "", icon_class: "", image_url: "", slug: "" });
    setIsOpen(true);
  };

  const handleOpenEdit = (item: AdminCategory) => {
    setIsEditMode(true);
    setFormCategory({
      id: item.id,
      name: item.name,
      icon_class: item.icon_class || "",
      image_url: item.image_url || "",
      slug: item.slug,
    });
    setIsOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCategory.name || !formCategory.slug) {
      alert("Name and Slug are required.");
      return;
    }
    setIsSaving(true);
    try {
      let res;
      if (isEditMode) {
        res = await adminApi.updateCategory(formCategory.id, formCategory);
      } else {
        res = await adminApi.createCategory(formCategory);
      }
      
      if (res.status === "success") {
        setIsOpen(false);
        loadCategories();
      } else {
        alert("Failed to save category.");
      }
    } catch (err) {
      alert("Error saving category: " + err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await adminApi.deleteCategory(deleteTarget.id);
      if (res.status === "success") {
        setDeleteTarget(null);
        setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
        loadCategories();
      } else {
        alert("Failed to delete category.");
      }
    } catch (err) {
      alert("Error deleting category: " + err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async (ids: (string | number)[]) => {
    if (!confirm(`Are you sure you want to delete the ${ids.length} selected categories?`)) return;
    setIsLoading(true);
    try {
      await Promise.all(ids.map((id) => adminApi.deleteCategory(String(id))));
      setSelectedIds([]);
      loadCategories();
    } catch (err) {
      alert("Error executing bulk delete: " + err);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: Column<AdminCategory>[] = [
    {
      header: "Category Name",
      accessor: (item) => (
        <div className="flex items-center gap-3 text-left">
          {item.icon_class && (
            <span className="w-8 h-8 rounded bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-750 text-sm">
              <i className={item.icon_class}></i>
            </span>
          )}
          <div className="flex flex-col">
            <span className="font-bold text-gray-800">{item.name}</span>
            <span className="text-[10px] text-gray-400 font-semibold uppercase">ID: {item.id}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Slug URL",
      accessor: (item) => <span className="font-mono text-xs text-gray-500">{item.slug}</span>,
    },
    {
      header: "Products Count",
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
              label: "Edit Category",
              onClick: () => handleOpenEdit(item),
              icon: (
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              ),
            },
            {
              label: "Delete Category",
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
          <h2 className="text-xl font-bold text-gray-900">Manage Categories</h2>
          <p className="text-xs font-medium text-gray-400 mt-0.5">Edit store categories and map icons.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bw-btn-red px-4 py-2.5 text-sm cursor-pointer"
        >
          Add Category
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-sm text-rose-600 font-medium">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={categories}
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
        emptyMessage="No categories created yet."
      />

      {/* Save/Edit Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={isEditMode ? "Modify Category" : "Create New Category"}
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
              {isSaving ? "Saving..." : "Save Category"}
            </button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Category Name *</label>
            <input
              type="text"
              name="name"
              value={formCategory.name}
              onChange={(e) => {
                const name = e.target.value;
                const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                setFormCategory((prev) => ({
                  ...prev,
                  name,
                  slug: prev.slug === "" || prev.slug === prev.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") ? slug : prev.slug,
                }));
              }}
              placeholder="e.g. Science Fiction"
              className="bw-input px-4 py-2.5 w-full text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">URL Slug *</label>
            <input
              type="text"
              name="slug"
              value={formCategory.slug}
              onChange={(e) => setFormCategory((prev) => ({ ...prev, slug: e.target.value }))}
              placeholder="e.g. science-fiction"
              className="bw-input px-4 py-2.5 w-full text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Icon Class CSS (optional)</label>
            <input
              type="text"
              name="icon_class"
              value={formCategory.icon_class}
              onChange={(e) => setFormCategory((prev) => ({ ...prev, icon_class: e.target.value }))}
              placeholder="e.g. flaticon-science"
              className="bw-input px-4 py-2.5 w-full text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Category Image URL (optional)</label>
            <input
              type="text"
              name="image_url"
              value={formCategory.image_url}
              onChange={(e) => setFormCategory((prev) => ({ ...prev, image_url: e.target.value }))}
              placeholder="https://example.com/category-image.jpg"
              className="bw-input px-4 py-2.5 w-full text-sm"
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
              {isDeleting ? "Deleting..." : "Delete Category"}
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete category <span className="font-bold text-gray-800">{deleteTarget?.name}</span>?
            This will dissociate all books under this category, setting their category link to general.
          </p>
        </div>
      </Modal>
    </div>
  );
};
