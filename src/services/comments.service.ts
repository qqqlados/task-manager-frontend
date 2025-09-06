import { ApiResponse, PaginatedResponse } from "@/types/dto";
import { IComment } from "@/types/comment.type";
import { http } from "@/lib/utils";
import { ITask } from "@/types/task.type";

export class CommentsService {
	static async addComment(
		taskId: Pick<ITask, "id">,
		payload: { content: string }
	) {
		return http<ApiResponse<IComment>>(`/tasks/${taskId}/comments`, {
			method: "POST",
			body: payload,
		});
	}

	static async deleteComment(
		taskId: Pick<ITask, "id">,
		commentId: Pick<IComment, "id">
	) {
		return http<ApiResponse<null>>(`/tasks/${taskId}/comments/${commentId}`, {
			method: "DELETE",
		});
	}
}
