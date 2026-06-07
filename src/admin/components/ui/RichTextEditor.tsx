// src/admin/components/ui/RichTextEditor.tsx
// Quill-based rich text editor — browser-only, no server-side deps.
// Loaded with dynamic import in BookFormPage to avoid SSR issues.

import React, { useEffect, useRef } from "react";

// Quill CSS is imported once globally via _app or injected below.
// We import it here so it's bundled with the component.
import "quill/dist/quill.snow.css";
import type Quill from "quill";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const TOOLBAR_OPTIONS = [
  [{ heading: [1, 2, 3, 4, false] }],
  ["bold", "italic", "underline"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["blockquote", "link"],
  ["clean"],
];

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Describe the summary, review, or details of the book...",
  disabled = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  // Track whether the *editor* changed the value (vs. a parent prop update)
  const isInternalChange = useRef(false);

  // Initialise Quill once on mount
  useEffect(() => {
    if (!containerRef.current) return;

    // Dynamically import Quill so it never runs on the server
    import("quill").then(({ default: QuillCtor }) => {
      if (quillRef.current) return; // already initialised

      const quill = new QuillCtor(containerRef.current!, {
        theme: "snow",
        placeholder,
        readOnly: disabled,
        modules: {
          toolbar: TOOLBAR_OPTIONS,
        },
      });

      // Set initial HTML content
      if (value) {
        quill.clipboard.dangerouslyPasteHTML(value);
      }

      // Emit HTML on every change
      quill.on("text-change", () => {
        isInternalChange.current = true;
        const html = quill.getSemanticHTML();
        // Quill returns "<p><br></p>" for an empty editor — normalise to ""
        onChange(html === "<p><br></p>" ? "" : html);
      });

      quillRef.current = quill;
    });

    return () => {
      // Cleanup: destroy the Quill instance
      if (quillRef.current) {
        quillRef.current.off("text-change");
        quillRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // Sync external value changes into the editor (e.g. loading an existing book)
  useEffect(() => {
    if (!quillRef.current) return;
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    // Only update when the prop value differs from what the editor holds
    const currentHtml = quillRef.current.getSemanticHTML();
    const normalised = currentHtml === "<p><br></p>" ? "" : currentHtml;
    if (normalised !== value) {
      quillRef.current.clipboard.dangerouslyPasteHTML(value || "");
    }
  }, [value]);

  // Toggle read-only when disabled changes
  useEffect(() => {
    if (!quillRef.current) return;
    quillRef.current.enable(!disabled);
  }, [disabled]);

  return (
    <div
      className={`rte-wrapper border border-gray-200 rounded-none overflow-hidden transition-all focus-within:ring-2 focus-within:ring-[#f75454]/20 focus-within:border-[#f75454] ${
        disabled ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      {/* Quill mounts into this div */}
      <div ref={containerRef} style={{ minHeight: "180px" }} />

      <style>{`
        /* Blend the Quill snow toolbar into the admin design */
        .rte-wrapper .ql-toolbar.ql-snow {
          border: none;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
          border-radius: 0;
          padding: 8px 10px;
        }
        .rte-wrapper .ql-container.ql-snow {
          border: none;
          font-family: inherit;
          font-size: 0.875rem;
          color: #111827;
        }
        .rte-wrapper .ql-editor {
          min-height: 160px;
          padding: 12px 16px;
          line-height: 1.7;
        }
        .rte-wrapper .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        /* Heading dropdown label fix */
        .rte-wrapper .ql-snow .ql-picker.ql-header .ql-picker-label::before,
        .rte-wrapper .ql-snow .ql-picker.ql-header .ql-picker-item::before {
          content: "Paragraph";
        }
        .rte-wrapper .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
        .rte-wrapper .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
          content: "Heading 1";
        }
        .rte-wrapper .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
        .rte-wrapper .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
          content: "Heading 2";
        }
        .rte-wrapper .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
        .rte-wrapper .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
          content: "Heading 3";
        }
        .rte-wrapper .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
        .rte-wrapper .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
          content: "Heading 4";
        }
      `}</style>
    </div>
  );
};
