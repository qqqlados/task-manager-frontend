import { ApiResponse } from "@/types/dto";
import { IComment } from "@/types/comment.type";
import { http } from "@/lib/utils";

export class CommentsService {
	static async addComment(
		projectId: string,
		taskId: string,
		payload: { content: string }
	) {
		http<ApiResponse<IComment>>(
			`/projects/${projectId}/tasks/${taskId}/comments`,
			{
				method: "POST",
				body: payload,
			}
		);

		return;
	}

	static async deleteComment(
		projectId: string,
		taskId: string,
		commentId: string
	) {
		return http<ApiResponse<null>>(
			`/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
			{
				method: "DELETE",
			}
		);
	}
}
