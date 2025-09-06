"use server";

import { cookies } from "next/headers";

export async function getCookies(name: string): Promise<string | undefined> {
	return (await cookies()).get(name)?.value;
}

export async function setCookie(
	name: string,
	value: string,
	options: {
		maxAge?: number;
		httpOnly?: boolean;
		secure?: boolean;
		sameSite?: "strict" | "lax" | "none";
	} = {}
) {
	(await cookies()).set(name, value, {
		maxAge: options.maxAge ?? 60 * 60 * 24 * 7, // 7 днів
		httpOnly: options.httpOnly ?? true,
		secure: options.secure ?? process.env.NODE_ENV === "production",
		sameSite: options.sameSite ?? "lax",
	});
}

export async function deleteCookie(name: string) {
	(await cookies()).delete(name);
}
