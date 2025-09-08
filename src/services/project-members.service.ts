import { ApiResponse, PaginatedResponse } from "@/types/dto";
import { IProject, IProjectMember } from "@/types/project.type";
import { http } from "@/lib/utils";
import { IUser } from "@/types/user.type";

export class ProjectMembersService {
	static async getMembers(projectId: string) {
		return http<PaginatedResponse<IProjectMember[]>>(
			`/projects/${projectId}/members`,
			{
				cache: "no-store",
			}
		);
	}

	static async addMember(
		projectId: string,
		payload: { userId: string; role?: string }
	) {
		return http<ApiResponse<IProjectMember>>(`/projects/${projectId}/members`, {
			method: "POST",
			body: payload,
		});
	}

	static async removeMember(projectId: string, userId: string) {
		return http<ApiResponse<null>>(`/projects/${projectId}/members/${userId}`, {
			method: "DELETE",
		});
	}
}
