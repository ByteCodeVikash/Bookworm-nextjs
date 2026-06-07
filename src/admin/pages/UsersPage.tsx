// src/admin/pages/UsersPage.tsx
import React, { useEffect, useState } from "react";
import { adminApi } from "../services/adminApi";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { DataTable, Column, TableActionDropdown } from "../components/ui/DataTable";
import { Modal } from "../components/ui/Modal";

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  const { user: currentAdmin } = useAdminAuth();

  // User detail Drawer modal
  const [detailUser, setDetailUser] = useState<any | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Role toggle processing states
  const [isUpdatingRole, setIsUpdatingRole] = useState<number | null>(null);

  // Deletion confirm states
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadUsers = () => {
    setIsLoading(true);
    adminApi.getUsers({ search, role: roleFilter, page, limit })
      .then((res) => {
        if (res.status === "success") {
          setUsers(res.data.users);
          setPagination(res.data.pagination);
          setSelectedIds([]);
        } else {
          setError("Failed to fetch users list.");
        }
      })
      .catch((err) => {
        setError("Error loading users: " + err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, roleFilter, page, limit]);

  const handleToggleRole = async (targetUser: any) => {
    const nextRole = targetUser.role === "admin" ? "customer" : "admin";
    
    // Safety check: Prevent demoting own admin account
    if (currentAdmin && Number(targetUser.id) === Number(currentAdmin.id)) {
      alert("Safety check: You cannot demote your own administrator account.");
      return;
    }

    setIsUpdatingRole(targetUser.id);
    try {
      const res = await adminApi.updateUserRole(targetUser.id, nextRole);
      if (res.status === "success") {
        setUsers((prev) =>
          prev.map((u) => (u.id === targetUser.id ? { ...u, role: nextRole } : u))
        );
      } else {
        alert((res as any).error || "Failed to update role.");
      }
    } catch (err) {
      alert("Error updating user: " + err);
    } finally {
      setIsUpdatingRole(null);
    }
  };

  const handleOpenDetails = async (targetUser: any) => {
    setIsLoadingDetails(true);
    setDetailUser(targetUser);
    try {
      const res = await adminApi.getUserById(targetUser.id);
      if (res.status === "success") {
        setDetailUser(res.data);
      }
    } catch (err) {
      console.error("Failed to load user address book details", err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    
    // Safety check: Prevent deleting own account
    if (currentAdmin && Number(deleteTarget.id) === Number(currentAdmin.id)) {
      alert("Safety check: You cannot delete your own administrator account.");
      setDeleteTarget(null);
      return;
    }

    setIsDeleting(true);
    try {
      const res = await adminApi.deleteUser(deleteTarget.id);
      if (res.status === "success") {
        setDeleteTarget(null);
        setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
        loadUsers();
      } else {
        alert((res as any).error || "Failed to delete user account.");
      }
    } catch (err) {
      alert("Error deleting user: " + err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async (ids: (string | number)[]) => {
    if (currentAdmin && ids.some((id) => Number(id) === Number(currentAdmin.id))) {
      alert("Safety check: Your selection includes your own administrator account. Please uncheck it first.");
      return;
    }
    if (!confirm(`Are you sure you want to delete ${ids.length} selected user accounts?`)) return;
    setIsLoading(true);
    try {
      await Promise.all(ids.map((id) => adminApi.deleteUser(Number(id))));
      setSelectedIds([]);
      loadUsers();
    } catch (err) {
      alert("Error deleting user accounts: " + err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkRoleUpdate = async (ids: (string | number)[], role: string) => {
    if (currentAdmin && role === "customer" && ids.some((id) => Number(id) === Number(currentAdmin.id))) {
      alert("Safety check: You cannot demote your own administrator account.");
      return;
    }
    if (!confirm(`Are you sure you want to change the role of ${ids.length} selected users to "${role}"?`)) return;
    setIsLoading(true);
    try {
      await Promise.all(ids.map((id) => adminApi.updateUserRole(Number(id), role)));
      setSelectedIds([]);
      loadUsers();
    } catch (err) {
      alert("Error updating user roles: " + err);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: Column<any>[] = [
    {
      header: "User ID",
      accessor: (item) => <span className="font-semibold text-gray-500">#{item.id}</span>,
    },
    {
      header: "User Details",
      accessor: (item) => (
        <div className="flex flex-col text-left">
          <span className="font-bold text-gray-800">
            {item.first_name} {item.last_name}
          </span>
          <span className="text-[10px] text-gray-400 font-semibold">{item.email}</span>
        </div>
      ),
    },
    {
      header: "Display Name",
      accessor: (item) => <span className="font-medium text-gray-600">{item.display_name || "-"}</span>,
    },
    {
      header: "System Access Role",
      accessor: (item) => {
        const isAdmin = item.role === "admin";
        return (
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
              isAdmin
                ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                : "bg-gray-50 text-gray-600 border-gray-200"
            }`}
          >
            {isAdmin ? "Administrator" : "Customer"}
          </span>
        );
      },
    },
    {
      header: "Actions",
      accessor: (item) => {
        const isSelf = !!(currentAdmin && Number(item.id) === Number(currentAdmin.id));
        return (
          <TableActionDropdown
            actions={[
              {
                label: "View Details",
                onClick: () => handleOpenDetails(item),
                icon: (
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ),
              },
              {
                label: item.role === "admin" ? "Demote to Customer" : "Promote to Admin",
                onClick: () => handleToggleRole(item),
                disabled: isSelf,
                icon: (
                  <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ),
              },
              {
                label: "Delete Account",
                onClick: () => setDeleteTarget(item),
                variant: "danger",
                disabled: isSelf,
                icon: (
                  <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                ),
              },
            ]}
          />
        );
      },
      className: "text-right",
    },
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Manage Users</h2>
          <p className="text-xs font-medium text-gray-400 mt-0.5">Edit store roles and audit user accounts database.</p>
        </div>

        {/* Role toggle filters */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Role:</label>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="bw-input px-3 py-2 text-xs font-semibold text-gray-700 cursor-pointer"
          >
            <option value="">All Accounts</option>
            <option value="customer">Customers Only</option>
            <option value="admin">Administrators Only</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded bg-rose-50 border border-rose-100 text-sm text-rose-600 font-medium">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        searchPlaceholder="Search by first name, last name, display name, or email..."
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
            label: "Promote to Admin",
            onClick: (ids) => handleBulkRoleUpdate(ids, "admin"),
            className: "bg-[#161619] hover:bg-black text-white shadow-sm shadow-gray-500/20",
          },
          {
            label: "Demote to Customer",
            onClick: (ids) => handleBulkRoleUpdate(ids, "customer"),
            className: "bg-gray-600 hover:bg-gray-700 text-white border border-gray-200",
          },
          {
            label: "Delete Selected",
            onClick: handleBulkDelete,
            className: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-500/20",
          },
        ]}
        emptyMessage="No customer accounts match criteria."
      />

      {/* User Details Drawer Modal */}
      <Modal
        isOpen={detailUser !== null}
        onClose={() => setDetailUser(null)}
        title={detailUser ? `User details: ${detailUser.first_name} ${detailUser.last_name}` : "User Details"}
        footer={
          <button
            onClick={() => setDetailUser(null)}
            className="bw-btn-outline px-4 py-2 text-sm cursor-pointer"
          >
            Close Details
          </button>
        }
      >
        {detailUser && (
          <div className="space-y-5 text-sm">
            <div className="grid grid-cols-2 gap-4 border-b border-gray-50 pb-3 text-xs text-gray-400 font-semibold">
              <div className="space-y-1">
                <span>Account Email:</span>
                <span className="text-gray-800 block text-sm select-all">{detailUser.email}</span>
              </div>
              <div className="space-y-1">
                <span>Created At:</span>
                <span className="text-gray-800 block text-sm">
                  {new Date(detailUser.created_at).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs text-gray-400 uppercase font-bold tracking-wider block">Address Book Profiles</span>
              {isLoadingDetails ? (
                <div className="flex items-center gap-2 py-4">
                  <div className="w-4 h-4 border-2 border-[#f75454] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-gray-400 font-medium">Loading addresses...</span>
                </div>
              ) : !detailUser.addresses || detailUser.addresses.length === 0 ? (
                <p className="text-xs text-gray-400 italic py-2">No addresses configured in this user's account book.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {detailUser.addresses.map((addr: any, idx: number) => (
                    <div
                      key={addr.id || idx}
                      className="border border-gray-100 rounded p-3.5 bg-gray-50/20 text-xs space-y-1 text-gray-500 text-left"
                    >
                      <span className="font-bold text-gray-700 block mb-1 uppercase tracking-wider text-[9px]">
                        Address Profile #{idx + 1}
                      </span>
                      <span className="text-gray-800 font-bold block">{addr.first_name} {addr.last_name}</span>
                      <span className="block">{addr.street_address}</span>
                      {addr.apartment && <span className="block">{addr.apartment}</span>}
                      <span className="block">{addr.city}, {addr.county || ""} {addr.postcode}</span>
                      <span className="block font-semibold text-gray-600">{addr.country}</span>
                      <span className="block mt-1 font-semibold text-[10px] text-gray-400">Phone: {addr.phone}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete User Account"
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
              {isDeleting ? "Deleting..." : "Delete Account"}
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete <span className="font-bold text-gray-800">{deleteTarget?.first_name} {deleteTarget?.last_name}</span>?
            This will permanently delete their account catalog, address books, and order associations (orders will be set to guest/anonymous).
          </p>
        </div>
      </Modal>
    </div>
  );
};
