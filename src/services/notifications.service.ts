import { ApiResponse, PaginatedResponse } from "@/types/dto";
import { INotification, NotificationType } from "@/types/notification.type";
import { http } from "@/lib/utils";

export class NotificationsService {
	static async getNotifications(
		query: {
			description?: string;
			read?: boolean;
			type?: NotificationType;
			page?: number;
			limit?: number;
		} = {}
	) {
		const params = new URLSearchParams();
		Object.entries(query).forEach(([k, v]) => {
			if (v !== undefined && v !== null) params.set(k, String(v));
		});
		const url = params.toString()
			? `/notifications?${params.toString()}`
			: "/notifications";
		return http<PaginatedResponse<INotification[]>>(url, { cache: "no-store" });
	}

	static async markAllAsRead() {
		return http<ApiResponse<null>>(`/notifications/read-all`, {
			method: "PATCH",
		});
	}

	static async markAsRead(notificationId: Pick<INotification, "id">) {
		return http<ApiResponse<INotification>>(
			`/notifications/${notificationId}/read`,
			{
				method: "PATCH",
			}
		);
	}
}
