"use client";

import { useEffect, useState } from "react";
import { NotificationsService } from "@/services/notifications.service";
import { INotification } from "@/types/notification.type";
import toast from "react-hot-toast";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      const response = await NotificationsService.getNotifications({
        page: 1,
        read:
          filter === "read" ? true : filter === "unread" ? false : undefined,
      });
      setNotifications(response.data);
    } catch (error) {
      toast.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await NotificationsService.markAllAsRead();
      toast.success("All notifications marked as read");
      fetchNotifications();
    } catch (error) {
      toast.error("Failed to mark notifications as read");
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await NotificationsService.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      toast.error("Failed to mark notification as read");
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex items-center gap-2">
          <select
            className="select select-bordered"
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as "all" | "read" | "unread")
            }
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
          <button className="btn btn-outline" onClick={handleMarkAllAsRead}>
            Mark all as read
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`card bg-base-100 shadow border border-base-200 ${
              !notification.userNotifications?.[0]?.isRead
                ? "ring-2 ring-primary"
                : ""
            }`}
          >
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="card-title text-lg">{notification.title}</h3>
                  <p className="text-base-content/70">{notification.message}</p>
                  <p className="text-sm text-base-content/50">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notification.userNotifications?.[0]?.isRead && (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="text-center py-8">
            <p className="text-base-content/60">No notifications found</p>
          </div>
        )}
      </div>
    </div>
  );
}
