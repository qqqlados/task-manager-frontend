import { ApiResponse, PaginatedResponse } from "@/types/dto";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getCookies } from "./cookies";
import { ITaskHistory } from "@/types/task.type";

interface HttpOptions {
	method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	cache?: RequestCache;
	body?: unknown;
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function http<
	T extends ApiResponse<unknown> | PaginatedResponse<unknown>
>(url: string, options: HttpOptions = {}): Promise<T> {
	// const token = await getCookies("accessToken");
	const token =
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjYsImVtYWlsIjoibHVjYXMubWFydGluQGV4YW1wbGUuY29tIiwiaWF0IjoxNzU3MzQyNDk3LCJleHAiOjE3NTczNDYwOTd9.-Rj6QoPEEYu_mFXLcua2vh4Sc18Mm8mdjUwQRvtxhSg";

	try {
		const res = await fetch(`http://localhost:4300${url}`, {
			method: options.method ?? "GET",
			cache: options.cache ?? "no-store",
			headers: {
				"Content-Type": "application/json",
				...(token && { Authorization: `Bearer ${token}` }),
			},
			body: options.body ? JSON.stringify(options.body) : undefined,
		});

		if (!res.ok) {
			throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
		}

		return (await res.json()) as T;
	} catch (e) {
		throw new Error(
			e instanceof Error ? e.message : "Something went wrong. Try again later"
		);
	}
}

export const closeModal = (id: string) => {
	const modal = document.getElementById(id) as HTMLDialogElement | null;
	if (modal) modal.close();
};

export const showModal = (id: string) => {
	const modal = document.getElementById(id) as HTMLDialogElement | null;
	if (modal) modal.showModal();
};

export const capitalizeString = (str: string) => {
	return `${str.charAt(0).toUpperCase() + `${str.slice(1).toLowerCase()}`}`;
};

export const formatSnakeCase = (input: string): string => {
	return input
		.toLowerCase()
		.split("_")
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

export const formatActionTaskStrings = (
	history: ITaskHistory[] | []
): string[] => {
	return history.length > 0
		? history.map(el => {
				const userName = el.user?.name ?? el.user?.email ?? "Unknown user";
				const date = new Date(el.createdAt).toLocaleDateString();

				switch (el.action) {
					case "TITLE_CHANGED":
						return `${date}: ${userName} changed task title from "${el.oldValue}" to "${el.newValue}"`;

					case "DESCRIPTION_CHANGED":
						return `${date}: ${userName} updated description`;

					case "PRIORITY_CHANGED":
						return `${date}: ${userName} changed priority from "${el.oldValue}" to "${el.newValue}"`;

					case "DEADLINE_CHANGED":
						return `${date}: ${userName} changed deadline from "${el.oldValue}" to "${el.newValue}"`;

					case "STATUS_CHANGED":
						return `${date}: ${userName} changed status from "${el.oldValue}" to "${el.newValue}"`;

					case "ASSIGNEE_CHANGED":
						return `${date}: ${userName} reassigned task from "${el.oldValue}" to "${el.newValue}"`;

					default:
						return `${date}: ${userName} made changes`;
				}
		  })
		: [];
};
