import { ApiResponse, PaginatedResponse } from "@/types/dto";
import { IProject, IProjectMember } from "@/types/project.type";
import { http } from "@/lib/utils";
import { IUser } from "@/types/user.type";

export class ProjectMembersService {
	static async getMembers(projectId: Pick<IProject, "id">) {
		return http<PaginatedResponse<IProjectMember[]>>(
			`/projects/${projectId}/members`,
			{
				cache: "no-store",
			}
		);
	}

	static async addMember(
		projectId: Pick<IProject, "id">,
		payload: { userId: Pick<IUser, "id">; role?: string }
	) {
		return http<ApiResponse<IProjectMember>>(`/projects/${projectId}/members`, {
			method: "POST",
			body: payload,
		});
	}

	static async removeMember(
		projectId: Pick<IProject, "id">,
		userId: Pick<IUser, "id">
	) {
		return http<ApiResponse<null>>(`/projects/${projectId}/members/${userId}`, {
			method: "DELETE",
		});
	}
}
