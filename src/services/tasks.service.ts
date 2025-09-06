import { PaginatedResponse, ApiResponse } from "@/types/dto";
import { ITask, TaskStatus, TaskPriority } from "@/types/task.type";
import { http } from "@/lib/utils";
import { IProject } from "@/types/project.type";
import { IUser } from "@/types/user.type";

export class TasksService {
	static async getProjectTasks(
		projectId: Pick<IProject, "id">,
		query: {
			status?: TaskStatus;
			priority?: TaskPriority;
			assigneeId?: number;
		} = {}
	) {
		const params = new URLSearchParams();
		Object.entries(query).forEach(([key, value]) => {
			if (value !== undefined && value !== null) params.set(key, String(value));
		});
		const url = params.toString()
			? `/projects/${projectId}/tasks?${params.toString()}`
			: `/projects/${projectId}/tasks`;
		return http<PaginatedResponse<ITask[]>>(url, { cache: "no-store" });
	}

	static async getTask(projectId: number | string, taskId: number | string) {
		return http<ApiResponse<ITask>>(`/projects/${projectId}/tasks/${taskId}`, {
			cache: "no-store",
		});
	}

	static async createTask(
		projectId: Pick<IProject, "id">,
		payload: {
			title: string;
			description?: string | null;
			priority?: TaskPriority;
			assignedTo?: number;
		}
	) {
		return http<ApiResponse<ITask>>(`/projects/${projectId}/tasks`, {
			method: "POST",
			body: payload,
		});
	}

	static async updateTask(
		projectId: Pick<IProject, "id">,
		taskId: Pick<ITask, "id">,
		payload: Partial<{
			title: string;
			description: string | null;
			status: TaskStatus;
			priority: TaskPriority;
			deadline: string;
			assignedTo: number;
		}>
	) {
		return http<ApiResponse<ITask>>(`/projects/${projectId}/tasks/${taskId}`, {
			method: "PUT",
			body: payload,
		});
	}

	static async deleteTask(
		projectId: Pick<IProject, "id">,
		taskId: Pick<ITask, "id">,
		userId: Pick<IUser, "id">
	) {
		return http<ApiResponse<null>>(`/projects/${projectId}/tasks/${taskId}`, {
			method: "DELETE",
		});
	}

	static async assignTask(
		projectId: Pick<IProject, "id">,
		taskId: Pick<ITask, "id">,
		assigneeId: number
	) {
		return http<ApiResponse<ITask>>(
			`/projects/${projectId}/tasks/${taskId}/assignee`,
			{ method: "PUT", body: { assigneeId } }
		);
	}
}
