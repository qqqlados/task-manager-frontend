import { ApiResponse } from "@/types/dto";
import { IUser } from "@/types/user.type";
import { http } from "@/lib/utils";

export class AuthService {
	static async login(payload: { email: string; password: string }) {
		return http<
			ApiResponse<{ user: IUser; accessToken: string; refreshToken: string }>
		>(`/auth/login`, { method: "POST", body: payload });
	}

	static async register(payload: {
		email: string;
		password: string;
		name: string;
	}) {
		return http<
			ApiResponse<{ user: IUser; accessToken: string; refreshToken: string }>
		>(`/auth/register`, { method: "POST", body: payload });
	}

	// static async forgotPassword(payload: { email: string }) {
	// 	return http<ApiResponse<null>>(`/auth/forgot-password`, {
	// 		method: "POST",
	// 		body: payload,
	// 	});
	// }

	// static async resetPassword(
	// 	token: string,
	// 	payload: { password: string; confirmPassword: string }
	// ) {
	// 	return http<ApiResponse<null>>(`/auth/reset-password/${token}`, {
	// 		method: "POST",
	// 		body: payload,
	// 	});
	// }
}
