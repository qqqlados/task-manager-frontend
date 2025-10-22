"use client";

import { useEffect, useMemo, useState } from "react";
import { UsersService } from "@/services/users.service";
import { ProjectMembersService } from "@/services/project-members.service";
import { IProjectMember } from "@/types/project.type";
import { IUser } from "@/types/user.type";
import toast from "react-hot-toast";

type Props = {
  projectId: string;
};

export function ProjectMembersEditor({ projectId }: Props) {
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<IProjectMember[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter((u) =>
      [u.name ?? "", u.email ?? ""].some((v) => v.toLowerCase().includes(term))
    );
  }, [users, search]);

  const memberIds = useMemo(() => new Set(members.map((m) => m.id)), [members]);

  useEffect(() => {
    void loadData();
  }, [projectId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, membersRes] = await Promise.all([
        UsersService.getUsers({ page: 1, limit: 50 }),
        ProjectMembersService.getMembers(projectId),
      ]);
      setUsers(usersRes.data);
      setMembers(membersRes.data ?? []);
    } catch {
      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (userId: string) => {
    setAdding(userId);
    try {
      await ProjectMembersService.addMember(projectId, { userId });
      toast.success("Member added");
      await loadData();
    } catch (e) {
      toast.error("Failed to add member");
    } finally {
      setAdding(null);
    }
  };

  const handleRemove = async (userId: string) => {
    setRemoving(userId);
    try {
      await ProjectMembersService.removeMember(projectId, userId);
      toast.success("Member removed");
      await loadData();
    } catch {
      toast.error("Failed to remove member");
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Members</span>
        </label>
        <div className="join w-full">
          <input
            className="input input-bordered join-item w-full"
            placeholder="Search users by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="button"
            className={`btn join-item ${loading ? "loading" : ""}`}
            onClick={() => void loadData()}
            disabled={loading}
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="card bg-base-100 border border-base-200">
          <div className="card-body">
            <h3 className="card-title text-sm">All users</h3>
            <div className="max-h-60 overflow-y-auto pr-1">
              <ul className="menu">
                {filteredUsers.map((u) => (
                  <li key={u.id}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate">
                        <div className="text-sm font-medium truncate">
                          {u.name ?? `User #${u.id}`}
                        </div>
                        <div className="text-xs text-base-content/60 truncate">
                          {u.email}
                        </div>
                      </div>
                      {memberIds.has(u.id) ? (
                        <button className="btn btn-ghost btn-xs" disabled>
                          Added
                        </button>
                      ) : (
                        <button
                          className={`btn btn-primary btn-xs ${
                            adding === String(u.id) ? "loading" : ""
                          }`}
                          onClick={() => void handleAdd(String(u.id))}
                          disabled={adding !== null}
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </li>
                ))}
                {filteredUsers.length === 0 && (
                  <li>
                    <span className="text-base-content/60">No users</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-200">
          <div className="card-body">
            <h3 className="card-title text-sm">Project members</h3>
            <div className="max-h-60 overflow-y-auto pr-1">
              <ul className="menu">
                {members.map((m) => (
                  <li key={m.id}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate">
                        <div className="text-sm font-medium truncate">
                          {m.name ?? `User #${m.id}`}
                        </div>
                        <div className="text-xs text-base-content/60 truncate">
                          {m.email}
                        </div>
                      </div>
                      <button
                        className={`btn btn-ghost btn-xs ${
                          removing === String(m.id) ? "loading" : ""
                        }`}
                        onClick={() => void handleRemove(String(m.id))}
                        disabled={removing !== null}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
                {members.length === 0 && (
                  <li>
                    <span className="text-base-content/60">No members</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
