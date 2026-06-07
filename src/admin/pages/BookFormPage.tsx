// src/admin/pages/BookFormPage.tsx
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { adminApi } from "../services/adminApi";
import { AdminAuthor, AdminCategory } from "../types";
import { ImageUploader } from "../components/ui/ImageUploader";
import { sanitizeHtml } from "@/utils/sanitize";

// Load the rich text editor only on the client (Quill requires browser APIs)
const RichTextEditor = dynamic(
  () => import("../components/ui/RichTextEditor").then((mod) => mod.RichTextEditor),
  { ssr: false }
);

interface BookFormPageProps {
  isEdit?: boolean;
}

export const BookFormPage: React.FC<BookFormPageProps> = ({ isEdit = false }) => {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    author_id: "",
    category_id: "",
    price: 0.0,
    original_price: "",
    price_range: "",
    format: "Paperback",
    image_url: "",
    rating: 5,
    stock_status: 1,
    publisher: "",
    publication_date: "",
    language: "English",
    description: "",
    is_bestseller: 0,
    is_featured: 0,
    is_onsale: 0,
    is_mostviewed: 0,
    is_deal_of_week: 0,
    is_new_release: 0,
    is_biography_book: 0,
    new_release_tab: "",
  });

  const [authors, setAuthors] = useState<AdminAuthor[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Track whether the URL field is shown as a manual override option
  const [showUrlField, setShowUrlField] = useState(false);

  useEffect(() => {
    // Load lists for select dropdowns
    const loadDropdownData = async () => {
      try {
        const [authorsRes, catsRes] = await Promise.all([
          adminApi.getAuthors(),
          adminApi.getCategories(),
        ]);
        if (authorsRes.status === "success") setAuthors(authorsRes.data);
        if (catsRes.status === "success") setCategories(catsRes.data);
      } catch (err) {
        console.error("Error loading dropdown data", err);
      }
    };

    loadDropdownData().then(() => {
      if (isEdit && id) {
        adminApi.getBookById(String(id))
          .then((res) => {
            if (res.status === "success" && res.data) {
              const book = res.data;
              setFormData({
                id: book.id || "",
                title: book.title || "",
                author_id: book.author_id || "",
                category_id: book.category_id || "",
                price: Number(book.price) || 0.0,
                original_price: book.original_price ? String(book.original_price) : "",
                price_range: book.price_range || "",
                format: book.format || "Paperback",
                image_url: book.image_url || "",
                rating: Number(book.rating) || 5,
                stock_status: Number(book.stock_status) ?? 1,
                publisher: book.publisher || "",
                publication_date: book.publication_date || "",
                language: book.language || "English",
                description: book.description || "",
                is_bestseller: Number(book.is_bestseller) || 0,
                is_featured: Number(book.is_featured) || 0,
                is_onsale: Number(book.is_onsale) || 0,
                is_mostviewed: Number(book.is_mostviewed) || 0,
                is_deal_of_week: Number(book.is_deal_of_week) || 0,
                is_new_release: Number(book.is_new_release) || 0,
                new_release_tab: book.new_release_tab || "",
                is_biography_book: Number(book.is_biography_book) || 0,
              });
            } else {
              setError("Book details could not be found.");
            }
          })
          .catch((err) => {
            setError("Error loading book: " + err.message);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    });
  }, [isEdit, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked ? 1 : 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    if (!formData.title || !formData.format) {
      setError("Title and format are required.");
      setIsSaving(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        // Sanitize HTML description before sending to server
        description: formData.description ? sanitizeHtml(formData.description) : "",
        original_price: formData.original_price === "" ? null : Number(formData.original_price),
        author_id: formData.author_id === "" ? null : formData.author_id,
        category_id: formData.category_id === "" ? null : formData.category_id,
      };

      let res;
      if (isEdit && id) {
        res = await adminApi.updateBook(String(id), payload);
      } else {
        res = await adminApi.createBook(payload);
      }

      if (res.status === "success") {
        router.push("/admin/books");
      } else {
        setError((res as any).error || "Failed to save book record.");
      }
    } catch (err: any) {
      setError("Error saving book: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-gray-100 rounded-none w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-96 bg-white rounded-none border border-gray-100"></div>
          <div className="h-96 bg-white rounded-none border border-gray-100"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/books")}
          className="p-2 border border-gray-200 rounded-none bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-all cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{isEdit ? "Edit Book Record" : "Add New Book"}</h2>
          <p className="text-xs font-medium text-gray-400 mt-0.5">
            {isEdit ? `Modifying properties for book ID: ${id}` : "Configure details to publish a new book."}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-none bg-rose-50 border border-rose-100 text-sm text-rose-600 font-medium">
          {error}
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Core fields */}
        <div className="lg:col-span-2 space-y-6 bw-card p-6">
          <h3 className="text-md font-bold text-gray-800 border-b border-gray-50 pb-3">Book Meta Details</h3>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Book Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. The Great Gatsby"
                className="bw-input px-4 py-2.5 w-full text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Author</label>
                <select
                  name="author_id"
                  value={formData.author_id}
                  onChange={handleChange}
                  className="bw-input px-4 py-2.5 w-full text-sm cursor-pointer"
                >
                  <option value="">Select Author...</option>
                  {authors.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Category</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="bw-input px-4 py-2.5 w-full text-sm cursor-pointer"
                >
                  <option value="">Select Category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="bw-input px-4 py-2.5 w-full text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Original Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  name="original_price"
                  value={formData.original_price}
                  onChange={handleChange}
                  placeholder="e.g. 15.99"
                  className="bw-input px-4 py-2.5 w-full text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Format *</label>
                <select
                  name="format"
                  value={formData.format}
                  onChange={handleChange}
                  className="bw-input px-4 py-2.5 w-full text-sm cursor-pointer"
                  required
                >
                  <option value="Paperback">Paperback</option>
                  <option value="Hardcover">Hardcover</option>
                  <option value="Kindle Edition">Kindle Edition</option>
                  <option value="Audiobook">Audiobook</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Publisher</label>
                <input
                  type="text"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                  placeholder="e.g. Penguin Books"
                  className="bw-input px-4 py-2.5 w-full text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Publication Date</label>
                <input
                  type="text"
                  name="publication_date"
                  value={formData.publication_date}
                  onChange={handleChange}
                  placeholder="YYYY-MM-DD"
                  className="bw-input px-4 py-2.5 w-full text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Language</label>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="bw-input px-4 py-2.5 w-full text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  className="bw-input px-4 py-2.5 w-full text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Stock Status *</label>
                <select
                  name="stock_status"
                  value={formData.stock_status}
                  onChange={handleChange}
                  className="bw-input px-4 py-2.5 w-full text-sm cursor-pointer"
                  required
                >
                  <option value="1">In Stock</option>
                  <option value="0">Out of Stock</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Description</label>
              <RichTextEditor
                value={formData.description}
                onChange={(html) =>
                  setFormData((prev) => ({ ...prev, description: html }))
                }
                placeholder="Describe the summary, review, or details of the book..."
                disabled={isSaving}
              />
            </div>
          </div>
        </div>

        {/* Media & Tags */}
        <div className="space-y-6">
          {/* Image upload */}
          <div className="bw-card p-6 space-y-4">
            <h3 className="text-md font-bold text-gray-800 border-b border-gray-50 pb-3">Book Cover</h3>

            <ImageUploader
              currentImageUrl={formData.image_url || undefined}
              onUpload={(file) => adminApi.uploadBookCover(file)}
              onUploadComplete={(url) =>
                setFormData((prev) => ({ ...prev, image_url: url }))
              }
              onRemove={() => {
                setFormData((prev) => ({ ...prev, image_url: "" }));
                setShowUrlField(false);
              }}
              disabled={isSaving}
            />

            {/* Optional: manual URL override (useful for external/CDN images) */}
            <div>
              <button
                type="button"
                onClick={() => setShowUrlField((v) => !v)}
                className="text-[10px] font-semibold text-[#f75454] hover:text-[#f52f2f] underline underline-offset-2 cursor-pointer"
              >
                {showUrlField ? "Hide URL field" : "Or enter image URL manually"}
              </button>

              {showUrlField && (
                <div className="mt-2 space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    Image URL
                  </label>
                  <input
                    type="text"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    placeholder="https://example.com/cover.jpg"
                    className="bw-input px-4 py-2.5 w-full text-sm"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Promotion / Placement tags */}
          <div className="bw-card p-6 space-y-4">
            <h3 className="text-md font-bold text-gray-800 border-b border-gray-50 pb-3">Store Placements</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.is_bestseller === 1}
                  onChange={(e) => handleCheckboxChange("is_bestseller", e.target.checked)}
                  className="w-4 h-4 rounded-none text-[#f75454] focus:ring-[#f75454]/25 border-gray-300 cursor-pointer"
                />
                <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">Bestseller</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.is_featured === 1}
                  onChange={(e) => handleCheckboxChange("is_featured", e.target.checked)}
                  className="w-4 h-4 rounded-none text-[#f75454] focus:ring-[#f75454]/25 border-gray-300 cursor-pointer"
                />
                <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">Featured</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.is_onsale === 1}
                  onChange={(e) => handleCheckboxChange("is_onsale", e.target.checked)}
                  className="w-4 h-4 rounded-none text-[#f75454] focus:ring-[#f75454]/25 border-gray-300 cursor-pointer"
                />
                <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">On Sale</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.is_mostviewed === 1}
                  onChange={(e) => handleCheckboxChange("is_mostviewed", e.target.checked)}
                  className="w-4 h-4 rounded-none text-[#f75454] focus:ring-[#f75454]/25 border-gray-300 cursor-pointer"
                />
                <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">Most Viewed</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.is_deal_of_week === 1}
                  onChange={(e) => handleCheckboxChange("is_deal_of_week", e.target.checked)}
                  className="w-4 h-4 rounded-none text-[#f75454] focus:ring-[#f75454]/25 border-gray-300 cursor-pointer"
                />
                <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">Deal of the Week</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group border-b border-gray-50 pb-3">
                <input
                  type="checkbox"
                  checked={formData.is_new_release === 1}
                  onChange={(e) => handleCheckboxChange("is_new_release", e.target.checked)}
                  className="w-4 h-4 rounded-none text-[#f75454] focus:ring-[#f75454]/25 border-gray-300 cursor-pointer"
                />
                <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">New Release</span>
              </label>

              <div className="space-y-1.5 pt-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">New Release Tab Type</label>
                <select
                  name="new_release_tab"
                  value={formData.new_release_tab}
                  onChange={handleChange}
                  className="bw-input px-3 py-2 w-full text-xs cursor-pointer"
                >
                  <option value="">None</option>
                  <option value="featured">Featured Tab</option>
                  <option value="onsale">On Sale Tab</option>
                  <option value="mostviewed">Most Viewed Tab</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Floating/Sticky Action Footer */}
        <div
          className="lg:col-span-3 sticky bottom-4 bg-white border border-gray-200/80 rounded-none p-4 shadow-none flex flex-col sm:flex-row items-center justify-between gap-4 z-40 mt-4"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-semibold text-gray-500">
              {isEdit ? "Modifying existing book properties" : "Creating new catalog item"}
            </span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => router.push("/admin/books")}
              className="bw-btn-outline px-5 py-2 text-xs font-semibold w-full sm:w-auto text-center cursor-pointer"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bw-btn-red px-6 py-2 text-xs font-semibold w-full sm:w-auto text-center disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Book</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
