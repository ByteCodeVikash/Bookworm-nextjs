// src/admin/components/ui/DataTable.tsx
import React, { useState, useEffect, useRef } from "react";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface PaginationData {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface DropdownAction {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: "default" | "danger";
  disabled?: boolean;
}

// Reusable action dropdown for row actions
export const TableActionDropdown: React.FC<{ actions: DropdownAction[] }> = ({ actions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        aria-label="Open actions menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-100 rounded-none shadow-none py-1 z-35 overflow-hidden animate-in fade-in duration-100">
          {actions.map((act, i) => (
            <button
              key={i}
              disabled={act.disabled}
              onClick={() => {
                if (act.disabled) return;
                act.onClick();
                setIsOpen(false);
              }}
              className={`flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                act.disabled
                  ? "opacity-45 cursor-not-allowed text-gray-400"
                  : act.variant === "danger"
                  ? "text-rose-600 hover:bg-rose-50"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {act.icon && <span className="shrink-0">{act.icon}</span>}
              {act.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface BulkAction {
  label: string;
  onClick: (ids: (string | number)[]) => void;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  pagination?: PaginationData;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  emptyMessage?: string;
  selectedIds?: (string | number)[];
  onSelectedIdsChange?: (ids: (string | number)[]) => void;
  bulkActions?: BulkAction[];
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  isLoading = false,
  searchPlaceholder = "Search records...",
  searchValue,
  onSearchChange,
  pagination,
  onPageChange,
  onLimitChange,
  emptyMessage = "No records found.",
  selectedIds,
  onSelectedIdsChange,
  bulkActions,
}: DataTableProps<T>) {
  const isSelectionEnabled = selectedIds !== undefined && onSelectedIdsChange !== undefined;

  const isAllSelected =
    data.length > 0 && data.every((item) => selectedIds?.includes(item.id));

  const handleSelectAll = () => {
    if (!selectedIds || !onSelectedIdsChange) return;
    if (isAllSelected) {
      const displayedIds = data.map((item) => item.id);
      onSelectedIdsChange(selectedIds.filter((id) => !displayedIds.includes(id)));
    } else {
      const displayedIds = data.map((item) => item.id);
      const newSelected = Array.from(new Set([...selectedIds, ...displayedIds]));
      onSelectedIdsChange(newSelected);
    }
  };

  const handleSelectRow = (id: string | number) => {
    if (!selectedIds || !onSelectedIdsChange) return;
    if (selectedIds.includes(id)) {
      onSelectedIdsChange(selectedIds.filter((item) => item !== id));
    } else {
      onSelectedIdsChange([...selectedIds, id]);
    }
  };

  return (
    <div className="bg-white overflow-hidden flex flex-col relative" style={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: 0, boxShadow: "none" }}>
      {/* Top Search bar */}
      {onSearchChange !== undefined && (
        <div className="px-5 py-4 flex items-center justify-between gap-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <div className="relative max-w-xs w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center" style={{ color: "#7c6e65" }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue ?? ""}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bw-input pl-9 pr-4 py-2 w-full text-sm font-medium"
            />
          </div>
        </div>
      )}

          {/* Table grid */}
      <div className="overflow-x-auto admin-table-container">
        <table className="min-w-full divide-y divide-gray-100 text-left text-sm text-gray-600 relative">
          <thead className="text-[10px] font-bold uppercase tracking-widest sticky top-[60px] z-10" style={{ background: "#f8f9fa", color: "#7f7f83", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
            <tr>
              {isSelectionEnabled && (
                <th scope="col" className="px-6 py-4 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="rounded-none border-gray-300 text-[#f75454] focus:ring-[#f75454]/25 w-4 h-4 cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col, idx) => (
                <th key={idx} scope="col" className={`px-6 py-4 ${col.className || ""}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {isLoading ? (
              // Loading Skeleton
              Array.from({ length: 5 }).map((_, rIdx) => (
                <tr key={rIdx} className="animate-pulse">
                  {isSelectionEnabled && (
                    <td className="px-6 py-4 w-10">
                      <div className="h-4 w-4 bg-gray-100 rounded"></div>
                    </td>
                  )}
                  {columns.map((_, cIdx) => (
                    <td key={cIdx} className="px-6 py-4">
                      <div
                        className="h-4 bg-gray-100 rounded"
                        style={{ width: cIdx === 0 ? "50%" : cIdx === 1 ? "75%" : "60%" }}
                      ></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty state
              <tr>
                <td colSpan={columns.length + (isSelectionEnabled ? 1 : 0)} className="px-6 py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v4h16z"
                      />
                    </svg>
                    <span className="font-semibold text-sm">{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              // Data rows
              data.map((item, rIdx) => {
                const isRowSelected = selectedIds?.includes(item.id) ?? false;
                return (
                  <tr
                    key={item.id || rIdx}
                    className={`transition-colors duration-150 ${
                      isRowSelected ? "" : "hover:bg-[#f8f9fa]"
                    }`}
                    style={isRowSelected ? { background: "#fff9f9" } : {}}
                  >
                    {isSelectionEnabled && (
                      <td className="px-6 py-4 w-10">
                        <input
                          type="checkbox"
                          checked={isRowSelected}
                          onChange={() => handleSelectRow(item.id)}
                          className="rounded-none border-gray-300 text-[#f75454] focus:ring-[#f75454]/25 w-4 h-4 cursor-pointer"
                        />
                      </td>
                    )}
                    {columns.map((col, cIdx) => {
                      const content =
                        typeof col.accessor === "function"
                          ? col.accessor(item)
                          : (item[col.accessor] as React.ReactNode);
                      return (
                        <td key={cIdx} className={`px-6 py-4 whitespace-nowrap ${col.className || ""}`}>
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && onPageChange && (
        <div className="p-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/10">
          <div className="text-xs text-gray-400 flex flex-wrap items-center gap-3">
            <span>
              Showing Page <span className="font-semibold text-gray-700">{pagination.currentPage}</span> of{" "}
              <span className="font-semibold text-gray-700">{pagination.totalPages || 1}</span> (
              <span className="font-semibold text-gray-700">{pagination.totalItems}</span> total records)
            </span>
            {onLimitChange && (
              <div className="flex items-center gap-2">
                <span className="text-gray-300">|</span>
                <span>Show</span>
                <select
                  value={pagination.limit}
                  onChange={(e) => onLimitChange(Number(e.target.value))}
                  className="bg-white border border-gray-200 rounded-none px-2 py-0.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#f75454]/30 focus:border-[#f75454] text-xs font-semibold cursor-pointer"
                >
                  {[5, 10, 12, 20, 50, 100].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <span>per page</span>
              </div>
            )}
          </div>
          {pagination.totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1 || isLoading}
                className="bw-btn-outline px-3 py-1.5 text-xs disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.totalPages }).map((_, pIdx) => {
                  const pageNum = pIdx + 1;
                  if (
                    pageNum === 1 ||
                    pageNum === pagination.totalPages ||
                    Math.abs(pageNum - pagination.currentPage) <= 1
                  ) {
                    return (
                      <button
                        key={pIdx}
                        onClick={() => onPageChange(pageNum)}
                        className={`px-3 py-1.5 rounded-none text-xs font-bold transition-all cursor-pointer ${
                          pagination.currentPage === pageNum
                            ? "text-white"
                            : "text-gray-500 hover:bg-[#f8f9fa] hover:text-[#161619]"
                        }`}
                        style={pagination.currentPage === pageNum ? { background: "#f75454" } : {}}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (
                    pageNum === 2 ||
                    pageNum === pagination.totalPages - 1
                  ) {
                    return (
                      <span key={pIdx} className="px-1 text-gray-300 font-semibold select-none">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
              <button
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages || isLoading}
                className="bw-btn-outline px-3 py-1.5 text-xs disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Floating Bulk Action Bar */}
      {selectedIds && selectedIds.length > 0 && bulkActions && bulkActions.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 text-white rounded-none px-5 py-3 flex items-center gap-5 shadow-none bw-fade-in" style={{ background: "#161619", border: "1px solid rgba(255,255,255,0.08)" }}>
          <span className="text-xs font-bold tracking-wide">
            {selectedIds.length} item{selectedIds.length > 1 ? "s" : ""} selected
          </span>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            {bulkActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => action.onClick(selectedIds)}
                className={`px-3 py-1.5 rounded-none text-xs font-extrabold transition-all cursor-pointer ${
                  action.className || "bw-btn-dark text-white px-3 py-1.5 text-xs"
                }`}
              >
                {action.label}
              </button>
            ))}
            <button
              onClick={() => onSelectedIdsChange?.([])}
              className="px-3 py-1.5 rounded-none text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

