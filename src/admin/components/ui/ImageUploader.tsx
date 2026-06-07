// src/admin/components/ui/ImageUploader.tsx
// Drag & drop / click-to-upload component for book cover images.
// Handles validation (type, size) on the client side before uploading.

import React, { useCallback, useRef, useState } from "react";

// ── Constants ────────────────────────────────────────────────────────────────
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_EXTENSIONS = ".jpg,.jpeg,.png,.webp";
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_SIZE_LABEL = "5 MB";

// ── Types ────────────────────────────────────────────────────────────────────
export interface ImageUploaderProps {
  /** Current image URL (external or uploaded). Used for initial preview. */
  currentImageUrl?: string;
  /** Called when the admin completes an upload. Receives the server-returned URL. */
  onUploadComplete: (url: string) => void;
  /** Called when the admin clicks "Remove Image". */
  onRemove: () => void;
  /** Upload function — receives a File, resolves to { url: string }. */
  onUpload: (file: File) => Promise<{ url: string }>;
  /** Whether the parent form is currently saving (disables the uploader). */
  disabled?: boolean;
}

// ── Component ────────────────────────────────────────────────────────────────
export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageUrl,
  onUploadComplete,
  onRemove,
  onUpload,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging]   = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  // Local object-URL for instant preview before upload completes
  const [previewUrl, setPreviewUrl]   = useState<string | null>(null);

  // The URL to show in the preview area (uploaded URL takes priority)
  const displayUrl = currentImageUrl || previewUrl;

  // ── Validation ─────────────────────────────────────────────────────────────
  function validateFile(file: File): string | null {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return `Unsupported type "${file.type}". Please upload a JPG, PNG, or WEBP image.`;
    }
    if (file.size > MAX_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      return `File is ${sizeMB} MB. Maximum allowed size is ${MAX_SIZE_LABEL}.`;
    }
    return null;
  }

  // ── Core upload logic ──────────────────────────────────────────────────────
  const processFile = useCallback(
    async (file: File) => {
      setValidationError(null);

      const error = validateFile(file);
      if (error) {
        setValidationError(error);
        return;
      }

      // Show a local preview immediately
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
      setIsUploading(true);

      try {
        const result = await onUpload(file);
        onUploadComplete(result.url);
        // Clean up the object URL once the server URL is received
        URL.revokeObjectURL(localUrl);
        setPreviewUrl(null);
      } catch (err: any) {
        setValidationError(err?.message || "Upload failed. Please try again.");
        URL.revokeObjectURL(localUrl);
        setPreviewUrl(null);
      } finally {
        setIsUploading(false);
        // Reset input so the same file can be re-selected
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [onUpload, onUploadComplete]
  );

  // ── File input handler ─────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  // ── Drag & drop handlers ───────────────────────────────────────────────────
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled && !isUploading) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  // ── Remove handler ─────────────────────────────────────────────────────────
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValidationError(null);
    setPreviewUrl(null);
    onRemove();
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-3">
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS}
        className="sr-only"
        aria-label="Upload book cover image"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />

      {displayUrl ? (
        // ── Preview state ────────────────────────────────────────────────────
        <div className="relative flex flex-col items-center justify-center p-4 border border-gray-100 rounded-none bg-gray-50/50">
          <span className="text-[10px] text-gray-400 mb-2 font-semibold uppercase tracking-wider">
            Cover Preview
          </span>

          {/* Uploading overlay */}
          {isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 rounded-none z-10">
              <div className="w-8 h-8 border-3 border-[#f75454] border-t-transparent rounded-full animate-spin" />
              <span className="mt-2 text-xs font-semibold text-gray-500">Uploading…</span>
            </div>
          )}

          <img
            src={displayUrl}
            alt="Book cover preview"
            className="h-40 w-28 object-cover rounded-none bg-white shadow-none border border-gray-200"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://placehold.co/150x220/f3f4f6/9ca3af?text=No+Cover";
            }}
          />

          {/* Action row below preview */}
          {!isUploading && (
            <div className="flex items-center gap-2 mt-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={disabled}
                className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-none transition-colors cursor-pointer disabled:opacity-50"
              >
                Replace Image
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={disabled}
                className="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-none transition-colors cursor-pointer disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      ) : (
        // ── Drop zone ────────────────────────────────────────────────────────
        <div
          role="button"
          aria-label="Upload book cover — click or drag and drop"
          tabIndex={disabled || isUploading ? -1 : 0}
          onClick={() => !disabled && !isUploading && inputRef.current?.click()}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !disabled && !isUploading) {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={[
            "flex flex-col items-center justify-center gap-2 p-6",
            "border-2 border-dashed rounded-none transition-all text-center",
            "cursor-pointer select-none",
            isDragging
              ? "border-[#f75454] bg-[#f75454]/5"
              : "border-gray-200 bg-gray-50/50 hover:border-[#f75454] hover:bg-[#f75454]/5",
            (disabled || isUploading) ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
          ].join(" ")}
        >
          {isUploading ? (
            <>
              <div className="w-8 h-8 border-2 border-[#f75454] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-semibold text-gray-500">Uploading…</span>
            </>
          ) : (
            <>
              {/* Upload icon */}
              <div className={[
                "w-12 h-12 rounded-none flex items-center justify-center",
                isDragging ? "bg-[#f75454]/10" : "bg-gray-100",
              ].join(" ")}>
                <svg
                  className={["w-6 h-6", isDragging ? "text-[#f75454]" : "text-gray-400"].join(" ")}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700">
                  {isDragging ? "Drop image here" : "Click to upload or drag & drop"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  JPG, JPEG, PNG, WEBP — max {MAX_SIZE_LABEL}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Validation / upload error */}
      {validationError && (
        <p
          role="alert"
          className="flex items-start gap-1.5 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-100 px-3 py-2 rounded-none"
        >
          <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {validationError}
        </p>
      )}
    </div>
  );
};
