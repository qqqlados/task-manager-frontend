import { ProjectsService } from "@/services/projects.service";
import { TasksService } from "@/services/tasks.service";
import { formatSnakeCase } from "@/lib/utils";
import {
  CalendarDays,
  User,
  FileText,
  CheckCircle2,
  Circle,
  PauseCircle,
  XCircle,
  Flag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = { params: Promise<{ projectId: string }> };

export default async function ProjectDetailsPage({ params }: Props) {
  const { projectId } = await params;
  const router = useRouter();
  const [projectResponse, tasksResponse] = await Promise.all([
    ProjectsService.getProject(projectId),
    TasksService.getProjectTasks(projectId),
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const project = projectResponse.data;
  const tasks = tasksResponse.data;

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "DONE").length;
  const progress =
    totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const handleDeleteProject = async () => {
    await ProjectsService.deleteProject(projectId);
    router.push("/projects");
  };

  if (isLoading) {
    return (
      <div className="absolute inset-0 bg-white/40">
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <div className="flex gap-2">
          <a href={`/projects/${projectId}/edit`} className="btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-4"
            >
              <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712Z" />
              <path d="M19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
            </svg>
            <span>Edit</span>
          </a>
          <button
            className="btn btn-error"
            onClick={() => handleDeleteProject()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span>{isLoading ? "Deleting..." : "Delete"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card bg-base-100 shadow border border-base-200">
          <div className="card-body">
            <h2 className="card-title">Description</h2>
            <p className="text-base-content/70">
              {project.description ?? "No description provided."}
            </p>
          </div>
        </div>

        <div className="card bg-base-100 shadow border border-base-200">
          <div className="card-body">
            <h2 className="card-title">Task Progress</h2>
            <progress
              className="progress progress-primary w-full"
              value={progress}
              max="100"
            ></progress>
            <div className="text-sm text-base-content/60 mt-2">
              {doneTasks} of {totalTasks} tasks done ({progress}%)
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow border border-base-200">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <h2 className="card-title">Tasks</h2>
            <a
              className="btn btn-primary btn-sm"
              href={`/projects/${projectId}/tasks`}
            >
              <span>View board</span>
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-black/10 [&>tr>th]:border [&>tr>th]:border-base-200">
                <tr>
                  <th className="w-10">#</th>
                  <th>Title</th>
                  <th>Assignee</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, idx) => (
                  <tr
                    key={task.id}
                    className="[&>td]:border [&>td]:border-base-200"
                  >
                    <td className="text-base-content/60">{idx + 1}</td>
                    <td>
                      <a
                        href={`/projects/${projectId}/tasks/${task.id}`}
                        className="link link-hover inline-flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4 text-base-content/70" />
                        {task.title}
                      </a>
                    </td>
                    <td>
                      <div className="inline-flex items-center gap-2">
                        <User className="w-4 h-4 text-base-content/70" />
                        {task.assignee?.name ?? "Unassigned"}
                      </div>
                    </td>
                    <td>
                      <div className="inline-flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-base-content/70" />
                        {task.deadline
                          ? new Date(task.deadline).toLocaleDateString()
                          : "No deadline"}
                      </div>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-2 badge badge-outline">
                        {task.status === "DONE" && (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        {task.status === "IN_PROGRESS" && (
                          <PauseCircle className="w-4 h-4" />
                        )}
                        {task.status === "TODO" && (
                          <Circle className="w-4 h-4" />
                        )}
                        {task.status === "CANCELLED" && (
                          <XCircle className="w-4 h-4" />
                        )}
                        {formatSnakeCase(task.status)}
                      </span>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-2 badge badge-ghost px-2 py-1">
                        <Flag className="w-4 h-4" />
                        {formatSnakeCase(task.priority)}
                      </span>
                    </td>
                  </tr>
                ))}
                {tasks.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center text-base-content/60"
                    >
                      No tasks found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
