import { ApiResponse, PaginatedResponse } from "@/types/dto";
import { IUser, UserRole } from "@/types/user.type";
import { http } from "@/lib/utils";

export class UsersService {
	static async getUsers(query: { page?: number; limit?: number } = {}) {
		const params = new URLSearchParams();
		Object.entries(query).forEach(([k, v]) => {
			if (v !== undefined && v !== null) params.set(k, String(v));
		});
		const url = params.toString() ? `/users?${params.toString()}` : "/users";
		return http<PaginatedResponse<IUser[]>>(url, { cache: "no-store" });
	}

	static async getUser(id: Pick<IUser, "id">) {
		return http<ApiResponse<IUser>>(`/users/${id}`, { cache: "no-store" });
	}

	static async updateUser(id: Pick<IUser, "id">, payload: Partial<IUser>) {
		return http<ApiResponse<IUser>>(`/users/${id}`, {
			method: "PATCH",
			body: payload,
		});
	}

	static async changeRole(id: Pick<IUser, "id">, role: UserRole) {
		return http<ApiResponse<IUser>>(`/users/${id}/role`, {
			method: "PATCH",
			body: { role },
		});
	}

	static async blockUser(id: Pick<IUser, "id">) {
		return http<ApiResponse<void>>(`/users/${id}/deactivate`, {
			method: "DELETE",
		});
	}

	static async unblockUser(id: Pick<IUser, "id">) {
		return http<ApiResponse<void>>(`/users/${id}/activate`, {
			method: "PATCH",
		});
	}
}
