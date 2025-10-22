import { ProjectsService } from "@/services/projects.service";
import { FC } from "react";
import Link from "next/link";

interface ProjectsSidebarProps {
  searchParams: { name?: string; status?: string; page?: number };
}

export const ProjectsSidebar: FC<ProjectsSidebarProps> = async ({
  searchParams,
}) => {
  const { name, status } = await searchParams;

  // Получаем статистику проектов
  const allProjects = await ProjectsService.getProjects({});
  const projects = allProjects.data || [];

  // Подсчитываем статистику
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === "ACTIVE").length;
  const completedProjects = projects.filter(
    (p) => p.status === "COMPLETED"
  ).length;

  const recentProjects = projects.slice(0, 3);

  return (
    <div className="w-80 bg-base-100 rounded-box border border-base-300 p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
      <h3 className="text-lg font-semibold mb-6">Project Statistics</h3>

      {/* Статистика */}
      <div className="space-y-4 mb-8">
        <div className="stats stats-vertical shadow-sm">
          <div className="stat">
            <div className="stat-title">Total Projects</div>
            <div className="stat-value text-primary">{totalProjects}</div>
          </div>

          <div className="stat">
            <div className="stat-title">Active</div>
            <div className="stat-value text-success">{activeProjects}</div>
          </div>

          <div className="stat">
            <div className="stat-title">Completed</div>
            <div className="stat-value text-info">{completedProjects}</div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-md font-medium mb-4">Recent Projects</h4>
        <div className="space-y-3">
          {recentProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors"
            >
              <div className="avatar">
                <div className="mask mask-squircle w-8 h-8">
                  <img src={project?.image} alt={project.name} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">
                  {project.name}
                </div>
                <div className="text-xs text-base-content/60">
                  {project.status}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium mb-4">Quick Actions</h4>
        <div className="space-y-2">
          <Link href="/projects/new" className="btn btn-primary btn-sm w-full">
            <span className="text-lg">+</span>
            Create Project
          </Link>
          <Link href="/analytics" className="btn btn-ghost btn-sm w-full">
            <span className="text-lg">📊</span>
            Analytics
          </Link>
          <Link href="/dashboard" className="btn btn-ghost btn-sm w-full">
            <span className="text-lg">📈</span>
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};
