"use client";

import { useEffect, useState } from "react";
import { ProjectsService } from "@/services/projects.service";
import { TasksService } from "@/services/tasks.service";
import { NotificationsService } from "@/services/notifications.service";
import { IProject } from "@/types/project.type";
import { ITask } from "@/types/task.type";
import { INotification } from "@/types/notification.type";
import {
  CalendarDays,
  ClipboardList,
  CheckCircle,
  Clock,
  Hourglass,
  Ban,
} from "lucide-react";

export default function DashboardPage() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, notificationsRes] = await Promise.all([
          ProjectsService.getProjects({ page: 1 }),
          NotificationsService.getNotifications({ page: 1, limit: 20 }),
        ]);

        setProjects(projectsRes.data);
        setNotifications(notificationsRes.data);

        // Get tasks from all projects to build upcoming deadlines list
        const allTasks: ITask[] = [];
        for (const project of projectsRes.data) {
          try {
            const tasksRes = await TasksService.getProjectTasks(project.id);
            allTasks.push(...tasksRes.data);
          } catch (error) {
            console.error(
              `Failed to fetch tasks for project ${project.id}:`,
              error
            );
          }
        }
        setTasks(allTasks);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    try {
      const cookieStr = typeof document !== "undefined" ? document.cookie : "";
      const match = cookieStr.match(/(?:^|; )user=([^;]+)/);
      if (match && match[1]) {
        const decoded = decodeURIComponent(match[1]);
        const parsed = JSON.parse(decoded);
        if (parsed && typeof parsed.id === "number") {
          setCurrentUserId(parsed.id);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const cookieStr = typeof document !== "undefined" ? document.cookie : "";
      const match = cookieStr.match(/(?:^|; )user=([^;]+)/);
      if (match && match[1]) {
        const decoded = decodeURIComponent(match[1]);
        const parsed = JSON.parse(decoded);
        if (parsed && typeof parsed.id === "number") {
          setCurrentUserId(parsed.id);
        }
      }
    } catch {}
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const userProjectsCount = currentUserId
    ? projects.filter(
        (p) =>
          p.createdBy === currentUserId ||
          p.members?.some((m) => m.id === currentUserId)
      ).length
    : projects.length;

  const personalTasks = currentUserId
    ? tasks.filter((t) => t.assignedTo === currentUserId)
    : [];
  const completedTasks = personalTasks.filter(
    (task) => task.status === "DONE"
  ).length;
  const totalTasks = personalTasks.length;
  const progressPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const personalTasksSorted = [...personalTasks]
    .sort((a, b) => {
      const aTime = a.deadline
        ? new Date(a.deadline as unknown as string).getTime()
        : new Date(a.updatedAt as unknown as string).getTime();
      const bTime = b.deadline
        ? new Date(b.deadline as unknown as string).getTime()
        : new Date(b.updatedAt as unknown as string).getTime();
      return bTime - aTime; // latest first
    })
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="stats shadow w-full">
        <div className="stat">
          <div className="stat-title">Projects</div>
          <div className="stat-value">{userProjectsCount}</div>
          <div className="stat-desc">Active projects</div>
        </div>
        <div className="stat">
          <div className="stat-title">Tasks</div>
          <div className="stat-value">{totalTasks}</div>
          <div className="stat-desc">{progressPercentage}% done</div>
        </div>
        <div className="stat">
          <div className="stat-title">Notifications</div>
          <div className="stat-value">{notifications.length}</div>
          <div className="stat-desc">Unread notifications</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow border border-base-200">
          <div className="card-body">
            <h2 className="card-title">Task Progress</h2>
            <progress
              className="progress progress-primary w-full"
              value={progressPercentage}
              max="100"
            ></progress>
            <p className="text-sm text-base-content/70">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>
        </div>

        <div className="card bg-base-100 shadow border border-base-200">
          <div className="card-body">
            <h2 className="card-title">Upcoming Deadlines</h2>
            <div className="max-h-[300px] overflow-y-auto pr-1">
              <ul className="bg-base-100 rounded-box divide-y divide-base-200">
                {tasks
                  .filter(
                    (task) =>
                      task.deadline && new Date(task.deadline) > new Date()
                  )
                  .sort(
                    (a, b) =>
                      new Date(a.deadline!).getTime() -
                      new Date(b.deadline!).getTime()
                  )
                  .slice(0, 3)
                  .map((task) => {
                    const deadline = new Date(task.deadline!);
                    const msLeft = deadline.getTime() - Date.now();
                    const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
                    const timeLabel =
                      daysLeft <= 0
                        ? "today"
                        : daysLeft === 1
                        ? "tomorrow"
                        : `${daysLeft} days`;
                    const urgencyBadge =
                      daysLeft <= 1
                        ? "badge-error"
                        : daysLeft <= 3
                        ? "badge-warning"
                        : "badge-ghost";

                    return (
                      <li key={task.id} className="py-2">
                        <a
                          href={`/projects/${task.projectId}/tasks/${task.id}`}
                          className="flex items-center gap-3 px-1"
                        >
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-base-200`}
                          >
                            <CalendarDays className="w-4 h-4 text-base-content/70" />
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">
                              {task.title}
                            </div>
                            <div className="text-xs text-base-content/60">
                              {deadline.toLocaleDateString()}
                            </div>
                          </div>
                          <span
                            className={`badge ${urgencyBadge} whitespace-nowrap`}
                          >
                            {timeLabel}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                {tasks.filter(
                  (task) =>
                    task.deadline && new Date(task.deadline) > new Date()
                ).length === 0 && (
                  <li className="py-2">
                    <div className="px-1 text-base-content/60 text-sm">
                      No upcoming deadlines
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow border border-base-200">
          <div className="card-body">
            <h2 className="card-title">Recent Tasks</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {personalTasksSorted.map((task) => (
                    <tr key={task.id}>
                      <td>
                        <div className="inline-flex items-center gap-2">
                          <ClipboardList className="w-4 h-4 text-base-content/70" />
                          <span>{task.title}</span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge px-2 py-1 ${
                            task.status === "DONE"
                              ? "badge-success"
                              : "badge-outline"
                          }`}
                        >
                          <span className="inline-flex items-center gap-1">
                            {task.status === "DONE" && (
                              <CheckCircle className="w-3.5 h-3.5" />
                            )}
                            {task.status === "IN_PROGRESS" && (
                              <Clock className="w-3.5 h-3.5" />
                            )}
                            {task.status === "REVIEW" && (
                              <Hourglass className="w-3.5 h-3.5" />
                            )}
                            {task.status === "TODO" && (
                              <ClipboardList className="w-3.5 h-3.5" />
                            )}
                            {task.status === "CANCELLED" && (
                              <Ban className="w-3.5 h-3.5" />
                            )}
                            <span>{task.status}</span>
                          </span>
                        </span>
                      </td>
                    </tr>
                  ))}
                  {personalTasksSorted.length === 0 && (
                    <tr>
                      <td
                        colSpan={2}
                        className="text-center text-base-content/60"
                      >
                        No tasks found for you
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow border border-base-200">
          <div className="card-body">
            <h2 className="card-title">Recent Notifications</h2>
            <div className="overflow-y-auto h-[150px] w-max overflow-x-hidden">
              <div className="flex flex-col gap-3 w-max pr-2">
                {notifications.slice(0, 20).map((notification) => (
                  <div
                    key={notification.id}
                    className="card bg-base-100 border border-base-200 shadow-sm min-w-[240px]"
                  >
                    <div className="card-body py-3 px-4">
                      <div className="font-semibold truncate">
                        {notification.title}
                      </div>
                      <div className="text-sm text-base-content/70 whitespace-normal">
                        {notification.message}
                      </div>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="card bg-base-100 border border-base-200 shadow-sm min-w-[240px]">
                    <div className="card-body py-3 px-4 text-base-content/60">
                      No recent notifications
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
