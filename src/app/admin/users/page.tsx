"use client";

import { useEffect, useState } from "react";
import { UsersService } from "@/services/users.service";
import { IUser, UserRole } from "@/types/user.type";
import { Select } from "@/components/select";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await UsersService.getUsers({ page: 1 });
      setUsers(response.data);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, newRole: UserRole) => {
    try {
      await UsersService.changeRole(userId.toString(), newRole);
      toast.success("User role updated");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  const handleBlockUser = async (userId: number) => {
    try {
      await UsersService.blockUser(userId.toString());
      toast.success("User blocked");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to block user");
    }
  };

  const handleUnblockUser = async (userId: number) => {
    try {
      await UsersService.unblockUser(userId.toString());
      toast.success("User unblocked");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to unblock user");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin — Users</h1>
      <div className="overflow-x-auto border border-base-200 rounded-box">
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-8 h-8 flex items-center justify-center">
                        <span className="text-xs font-medium leading-none">
                          {user.name?.charAt(0).toUpperCase() ||
                            user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{user.name || "No name"}</div>
                      <div className="text-sm opacity-50">ID: {user.id}</div>
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <Select
                    options={["USER", "ADMIN"]}
                    label="Select role"
                    value={user.role}
                    onChange={(newRole) =>
                      handleRoleChange(user.id, newRole as UserRole)
                    }
                    widthClassName="w-26"
                  />
                </td>
                <td>
                  <span
                    className={`badge px-2 py-1 ${
                      user.isActive ? "badge-success" : "badge-error"
                    }`}
                  >
                    {user.isActive ? "Active" : "Blocked"}
                  </span>
                </td>
                <td>
                  {user.isActive ? (
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => handleBlockUser(user.id)}
                    >
                      Block
                    </button>
                  ) : (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleUnblockUser(user.id)}
                    >
                      Unblock
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-base-content/60">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
