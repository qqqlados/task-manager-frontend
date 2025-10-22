"use client";

import { useEffect, useState } from "react";
import { TasksService } from "@/services/tasks.service";
import { ITask, TaskPriority, TaskStatus } from "@/types/task.type";
import { KanbanBoard } from "@/components/kanban-board";
import toast from "react-hot-toast";
import { ProjectsService } from "@/services/projects.service";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProjectMembersService } from "@/services/project-members.service";
import { Filter, Users, AlertCircle } from "lucide-react";
import { Select } from "@/components/select";
import { capitalize } from "lodash";

type FilterState = {
  status: string;
  priority: string;
  assigneeId: string;
};

type Props = { params: Promise<{ projectId: string }> };

export default function ProjectTasksPage({ params }: Props) {
  const [projectId, setProjectId] = useState<string>("");
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    status: "",
    priority: "",
    assigneeId: "",
  });
  const [assignees, setAssignees] = useState<{ id: number; name: string }[]>(
    []
  );

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    params.then(async ({ projectId }) => {
      setProjectId(projectId);
      await Promise.all([fetchAssignees(projectId), fetchTasks(projectId)]);
    });
  }, [params]);

  useEffect(() => {
    if (!projectId) return;
    fetchTasks(projectId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, projectId]);

  const fetchTasks = async (projectId: string) => {
    try {
      setLoading(true);
      const query = {
        status: filters.status ? (filters.status as TaskStatus) : undefined,
        priority: filters.priority
          ? (filters.priority as TaskPriority)
          : undefined,
        assigneeId: filters.assigneeId ? Number(filters.assigneeId) : undefined,
      };
      const response = await TasksService.getProjectTasks(
        Number(projectId),
        query
      );
      setTasks(response.data);
    } catch (error) {
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignees = async (projectId: string) => {
    try {
      const projectResponse = await ProjectMembersService.getMembers(projectId);

      const members = projectResponse.data ?? [];
      const mapped = members
        .map((m) => ({
          id: m?.id ?? (m.id as unknown as number),
          name: m?.name ?? `User #${m.id}`,
        }))
        .filter((a) => !!a.id && !!a.name);
      setAssignees(mapped);
    } catch (error) {
      // Ignore assignees load errors for now
    }
  };

  const handleFilterChange = (
    key: "status" | "priority" | "assigneeId",
    value: string
  ) => {
    setFilters((prev: FilterState) => ({ ...prev, [key]: value }));
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Функция для получения отфильтрованных задач на основе текущих фильтров
  const getFilteredTasks = () => {
    let filteredTasks = tasks;

    // Применяем фильтры последовательно
    if (filters.status) {
      filteredTasks = filteredTasks.filter(
        (task) => task.status === filters.status
      );
    }
    if (filters.priority) {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority === filters.priority
      );
    }
    if (filters.assigneeId) {
      const assigneeId = Number(filters.assigneeId);
      filteredTasks = filteredTasks.filter(
        (task) => (task.assignedTo ?? task.assignee?.id) === assigneeId
      );
    }

    return filteredTasks;
  };

  const filteredTasks = getFilteredTasks();

  // Получаем доступные опции для каждого фильтра на основе текущих фильтров
  const getAvailableStatuses = () => {
    let tasksForStatus = tasks;

    // Если выбран приоритет, фильтруем по нему
    if (filters.priority) {
      tasksForStatus = tasksForStatus.filter(
        (task) => task.priority === filters.priority
      );
    }

    // Если выбран assignee, фильтруем по нему
    if (filters.assigneeId) {
      const assigneeId = Number(filters.assigneeId);
      tasksForStatus = tasksForStatus.filter(
        (task) => (task.assignedTo ?? task.assignee?.id) === assigneeId
      );
    }

    return Array.from(new Set(tasksForStatus.map((task) => task.status)));
  };

  const getAvailablePriorities = () => {
    let tasksForPriority = tasks;

    // Если выбран статус, фильтруем по нему
    if (filters.status) {
      tasksForPriority = tasksForPriority.filter(
        (task) => task.status === filters.status
      );
    }

    // Если выбран assignee, фильтруем по нему
    if (filters.assigneeId) {
      const assigneeId = Number(filters.assigneeId);
      tasksForPriority = tasksForPriority.filter(
        (task) => (task.assignedTo ?? task.assignee?.id) === assigneeId
      );
    }

    return Array.from(new Set(tasksForPriority.map((task) => task.priority)));
  };

  const getAvailableAssignees = () => {
    let tasksForAssignee = tasks;

    // Если выбран статус, фильтруем по нему
    if (filters.status) {
      tasksForAssignee = tasksForAssignee.filter(
        (task) => task.status === filters.status
      );
    }

    // Если выбран приоритет, фильтруем по нему
    if (filters.priority) {
      tasksForAssignee = tasksForAssignee.filter(
        (task) => task.priority === filters.priority
      );
    }

    const availableAssigneeIds = new Set(
      tasksForAssignee
        .map((t) => (t.assignedTo ?? t.assignee?.id) as number | undefined)
        .filter((id): id is number => typeof id === "number")
    );

    return assignees.filter((a) => availableAssigneeIds.has(a.id));
  };

  const availableStatuses = getAvailableStatuses();
  const availablePriorities = getAvailablePriorities();
  const availableAssignees = getAvailableAssignees();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks — Project #{projectId}</h1>
        <div className="flex items-center gap-2">
          <a
            href={`/projects/${projectId}/tasks/new`}
            className="btn btn-primary"
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <span>Create task</span>
          </a>
        </div>
      </div>

      <div className="flex gap-7 w-full justify-center">
        {/* Status Filter */}
        <div className="flex items-center gap-1">
          <Filter className="w-4 h-4 text-base-content/60" />
          <Select
            options={[
              "All statuses",
              ...availableStatuses.map((status) =>
                status.replace(/_/g, " ").toUpperCase()
              ),
            ]}
            label="All statuses"
            value={
              filters.status
                ? filters.status.replace(/_/g, " ").toUpperCase()
                : "All statuses"
            }
            onChange={(value) => {
              if (value === "All statuses") {
                handleFilterChange("status", "");
                return;
              }
              const originalStatus = availableStatuses.find(
                (status) => status.replace(/_/g, " ").toUpperCase() === value
              );
              handleFilterChange("status", originalStatus || "");
            }}
            widthClassName="w-[180px]"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1">
          <AlertCircle className="w-4 h-4 text-base-content/60" />
          <Select
            options={[
              "All priorities",
              ...availablePriorities.map((priority) =>
                priority.replace(/_/g, " ").toUpperCase()
              ),
            ]}
            label="All priorities"
            value={
              filters.priority
                ? filters.priority.replace(/_/g, " ").toUpperCase()
                : "All priorities"
            }
            onChange={(value) => {
              if (value === "All priorities") {
                handleFilterChange("priority", "");
                return;
              }
              const originalPriority = availablePriorities.find(
                (priority) =>
                  priority.replace(/_/g, " ").toUpperCase() === value
              );
              handleFilterChange("priority", originalPriority || "");
            }}
            widthClassName="w-[180px]"
          />
        </div>

        {/* Assignee Filter */}
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4 text-base-content/60" />
          <Select
            options={[
              "All assignees",
              ...availableAssignees.map((a) => a.name),
            ]}
            label="All assignees"
            value={
              availableAssignees.find(
                (a) => a.id.toString() === filters.assigneeId
              )?.name || "All assignees"
            }
            onChange={(value) => {
              if (value === "All assignees") {
                handleFilterChange("assigneeId", "");
                return;
              }
              const assignee = availableAssignees.find((a) => a.name === value);
              handleFilterChange(
                "assigneeId",
                assignee ? assignee.id.toString() : ""
              );
            }}
            widthClassName="w-[180px]"
          />
        </div>
      </div>

      <KanbanBoard projectId={projectId} initialTasks={filteredTasks} />
    </div>
  );
}
