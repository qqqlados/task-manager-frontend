import { IProject, ProjectType } from "@/types/project.type";
import { http } from "../lib/utils";
import { PaginatedResponse, ApiResponse } from "@/types/dto";

export class ProjectsService {
  static async getProjects(query: {
    name?: string;
    status?: string;
    page?: number;
  }) {
    const params = new URLSearchParams();

    if (Object.entries(query).length > 0) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, value.toString());
        }
      });
    }

    const url = params.toString()
      ? `/projects?${params.toString()}`
      : "/projects";

    const projects = await http<PaginatedResponse<IProject[]>>(`${url}`, {
      cache: "no-store",
    });

    return projects;
  }

  static async getProject(id: number | string) {
    return http<ApiResponse<IProject>>(`/projects/${id}`, {
      cache: "no-store",
    });
  }

  static async createProject(payload: {
    name: string;
    type: ProjectType;
    description?: string | null;
    deadline?: string | Date | null;
    memberIds: number[];
  }) {
    return http<ApiResponse<IProject>>(`/projects`, {
      method: "POST",
      body: payload,
    });
  }

  static async updateProject(
    id: number | string,
    payload: Partial<{
      name: string;
      description: string | null;
      deadline: string | Date | null;
      status: string;
    }>
  ) {
    return http<ApiResponse<IProject>>(`/projects/${id}`, {
      method: "PUT",
      body: payload,
    });
  }

  static async deleteProject(id: number | string) {
    return http<ApiResponse<null>>(`/projects/${id}`, {
      method: "DELETE",
    });
  }
}
