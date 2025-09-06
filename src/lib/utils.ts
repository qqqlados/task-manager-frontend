import { ApiResponse, PaginatedResponse } from "@/types/dto";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getCookies } from "./cookies";

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
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoibHVjYXMubWFydGluQGV4YW1wbGUuY29tIiwiaWF0IjoxNzU3MTQyMTM0LCJleHAiOjE3NTcxNDU3MzR9.B_HmY40tNm0UO2pjVbXjYoBCDfeVOXbRVYOR35_csNw";

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
