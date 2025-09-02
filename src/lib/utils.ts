import { ApiResponse, PaginatedResponse } from '@/types/dto'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface HttpOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
	cache?: RequestCache
	body?: unknown
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export async function http<T extends ApiResponse<unknown> | PaginatedResponse<unknown>>(url: string, options: HttpOptions = {}): Promise<T> {
	const token =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsImVtYWlsIjoic29maWEua292YWxlbmtvQGV4YW1wbGUuY29tIiwiaWF0IjoxNzU2ODI4MDQ3LCJleHAiOjE3NTY4MzE2NDd9.0qSlmsgNQ9EeLa6x_f0Wk_EYus-9LlRv7X5tdSHJasU'

	try {
		const res = await fetch(`http://localhost:3000${url}`, {
			method: options.method ?? 'GET',
			cache: options.cache ?? 'no-store',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: options.body ? JSON.stringify(options.body) : undefined,
		})

		if (!res.ok) {
			throw new Error(`HTTP error ${res.status}: ${res.statusText}`)
		}

		return (await res.json()) as T
	} catch (e) {
		throw new Error(e instanceof Error ? e.message : 'Something went wrong. Try again later')
	}
}
