"use client";

import * as React from "react";
import useSWR from "swr";
import {
  Bell,
  CheckCircle,
  X,
  LayoutDashboard,
  FolderKanban,
  FolderPlus,
  Users,
  BarChart3,
  UserCircle,
  LogOut,
} from "lucide-react";
import {
  BellIcon,
  notificationTypeToIcon,
} from "./ui/buttons/notification-buttons";
import { INotification } from "@/types/notification.type";
import { NotificationsService } from "@/services/notifications.service";
import { showModal } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { deleteCookie, getCookies } from "@/lib/cookies";
import toast from "react-hot-toast";
import { IUser } from "@/types/user.type";

const notificationsFetcher = async (): Promise<INotification[]> => {
  const notifications = await NotificationsService.getNotifications();
  return notifications.data;
};

export function Navigation() {
  const [isNotificationOpen, setIsNotificationOpen] = React.useState(false);
  const [dates, setDates] = React.useState<string[]>([]);
  const [user, setUser] = React.useState<IUser | null>(null);
  const [isProjectsOpen, setIsProjectsOpen] = React.useState(false);
  const [isAdminOpen, setIsAdminOpen] = React.useState(false);
  const [isAccountOpen, setIsAccountOpen] = React.useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const getUser = async () => {
      const user = await getCookies("user");
      if (user) {
        setUser(JSON.parse(user));
      }
    };
    getUser();
  }, []);

  React.useEffect(() => {
    setIsClient(true);
    const checkAuthentication = async () => {
      const cookies = await getCookies("accessToken");
      setIsAuthenticated(cookies !== undefined);
    };
    checkAuthentication();
  }, [dates]);

  const isActive = (path: string) => {
    if (!isClient) return false;
    if (path === "/dashboard") return pathname === "/dashboard";
    if (path === "/projects") return pathname.startsWith("/projects");
    if (path === "/notifications") return pathname === "/notifications";
    if (path === "/admin") return pathname.startsWith("/admin");
    if (path === "/analytics") return pathname === "/analytics";
    if (path === "/profile") return pathname === "/profile";
    return false;
  };

  const { data, error, isLoading } = useSWR<INotification[]>(
    "/notifications",
    notificationsFetcher
  );

  React.useEffect(() => {
    if (data) {
      setDates(data.map((el) => new Date(el.createdAt).toLocaleString()));
    }
  }, [data]);

  const handleLogout = () => {
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    deleteCookie("user");
    router.push("/auth/login");
    toast.success("Logged out successfully");
  };

  const closeAllDropdowns = () => {
    setIsProjectsOpen(false);
    setIsAdminOpen(false);
    setIsAccountOpen(false);
    setIsNotificationOpen(false);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".navbar")) {
        closeAllDropdowns();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative z-50 h-14 flex items-center justify-center mb-5">
      <div className="navbar bg-base-100 rounded-box shadow-sm border border-base-200 w-full max-w-5xl">
        <div className="flex-1">
          <a className="btn btn-ghost text-lg font-semibold" href="/dashboard">
            TaskManager
          </a>
        </div>

        {isAuthenticated && (
          <>
            <div className="flex-none">
              <ul className="menu menu-horizontal px-1">
                <li>
                  <a
                    href="/dashboard"
                    className={
                      isActive("/dashboard")
                        ? "bg-black/8 text-base-content"
                        : ""
                    }
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </a>
                </li>
                <li>
                  <details
                    className={
                      isActive("/projects")
                        ? "bg-black/8 text-base-content"
                        : ""
                    }
                    open={isProjectsOpen}
                    onToggle={(e) => {
                      const isOpen = e.currentTarget.open;
                      if (isOpen) {
                        setIsProjectsOpen(true);
                        setIsAdminOpen(false);
                        setIsAccountOpen(false);
                      } else {
                        setIsProjectsOpen(false);
                      }
                    }}
                  >
                    <summary>
                      <FolderKanban className="w-4 h-4" />
                      Projects
                    </summary>
                    <ul className="p-2 bg-base-100 rounded-t-none min-w-26">
                      <li>
                        <a
                          href="/projects"
                          onClick={closeAllDropdowns}
                          className={`whitespace-nowrap ${
                            isActive("/projects")
                              ? "bg-black/8 text-base-content"
                              : ""
                          }`}
                        >
                          <FolderKanban className="w-4 h-4" />
                          See all
                        </a>
                      </li>
                      <li>
                        <a
                          onClick={() => {
                            showModal("create-project");
                            closeAllDropdowns();
                          }}
                          className="whitespace-nowrap"
                        >
                          <FolderPlus className="w-4 h-4" />
                          Create new
                        </a>
                      </li>
                    </ul>
                  </details>
                </li>
                {user?.role === "ADMIN" && (
                  <li>
                    <details
                      className={
                        isActive("/admin") ? "bg-black/8 text-base-content" : ""
                      }
                      open={isAdminOpen}
                      onToggle={(e) => {
                        const isOpen = e.currentTarget.open;
                        if (isOpen) {
                          setIsAdminOpen(true);
                          setIsProjectsOpen(false);
                          setIsAccountOpen(false);
                        } else {
                          setIsAdminOpen(false);
                        }
                      }}
                    >
                      <summary>
                        <Users className="w-4 h-4" />
                        Admin
                      </summary>
                      <ul className="p-2 bg-base-100 rounded-t-none min-w-56">
                        <li>
                          <a
                            href="/admin/users"
                            onClick={closeAllDropdowns}
                            className={`whitespace-nowrap ${
                              isClient && pathname === "/admin/users"
                                ? "bg-black/8 text-base-content"
                                : ""
                            }`}
                          >
                            <Users className="w-4 h-4" />
                            Users
                          </a>
                        </li>
                        <li>
                          <a
                            href="/admin/projects"
                            onClick={closeAllDropdowns}
                            className={`whitespace-nowrap ${
                              isClient && pathname === "/admin/projects"
                                ? "bg-black/8 text-base-content"
                                : ""
                            }`}
                          >
                            <FolderKanban className="w-4 h-4" />
                            Projects
                          </a>
                        </li>
                      </ul>
                    </details>
                  </li>
                )}
                <li>
                  <a
                    href="/analytics"
                    className={
                      isActive("/analytics")
                        ? "bg-black/8 text-base-content"
                        : ""
                    }
                  >
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </a>
                </li>
                <li>
                  <details
                    className={
                      isActive("/profile") ? "bg-black/8 text-base-content" : ""
                    }
                    open={isAccountOpen}
                    onToggle={(e) => {
                      const isOpen = e.currentTarget.open;
                      if (isOpen) {
                        setIsAccountOpen(true);
                        setIsProjectsOpen(false);
                        setIsAdminOpen(false);
                      } else {
                        setIsAccountOpen(false);
                      }
                    }}
                  >
                    <summary>
                      <UserCircle className="w-4 h-4" />
                      Account
                    </summary>
                    <ul className="p-2 bg-base-100 rounded-t-none min-w-56">
                      <li>
                        <a
                          href="/profile"
                          onClick={closeAllDropdowns}
                          className={`whitespace-nowrap ${
                            isActive("/profile")
                              ? "bg-black/8 text-base-content"
                              : ""
                          }`}
                        >
                          <UserCircle className="w-4 h-4" />
                          Profile
                        </a>
                      </li>
                      <li>
                        <button
                          className="text-error whitespace-nowrap"
                          onClick={() => {
                            handleLogout();
                            closeAllDropdowns();
                          }}
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </li>
                    </ul>
                  </details>
                </li>
              </ul>
            </div>

            <div className="navbar-end">
              <div className="relative">
                <div
                  className="btn btn-ghost btn-circle"
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                >
                  <BellIcon isOpen={isNotificationOpen} />
                </div>

                {isNotificationOpen && (
                  <div className="absolute right-[-150] top-[calc(100%+5px)] w-96 bg-base-100 border border-base-300 shadow-xl rounded-lg z-50">
                    <div className="flex items-center justify-between p-3 border-b border-base-200">
                      <h3 className="font-semibold">Notifications</h3>
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={() => setIsNotificationOpen(false)}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {isLoading && (
                        <div className="flex items-center justify-center p-6">
                          <span className="loading loading-spinner loading-lg"></span>
                        </div>
                      )}

                      {error && (
                        <p className="p-4 text-error text-sm">
                          Failed to load notifications
                        </p>
                      )}

                      {!isLoading && data && data.length === 0 && (
                        <p className="p-4 text-sm text-base-content/60 italic">
                          No notifications
                        </p>
                      )}

                      {data?.map((notif, index) => (
                        <div
                          key={notif.id}
                          className="flex items-start gap-3 p-3 hover:bg-black/8 transition"
                        >
                          <div className="mt-1">
                            {notificationTypeToIcon[notif.type] ?? (
                              <Bell className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{notif.title}</p>
                            <p className="text-xs text-base-content/60">
                              {notif.message}
                            </p>
                            {dates.length > 0 && dates[index] && (
                              <p className="text-[11px] text-base-content/50 mt-1">
                                {dates[index].toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
