"use client";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function proxyFetch(
	input: RequestInfo | URL,
	init?: RequestInit
): Promise<Response> {
	const url =
		typeof input === "string"
			? input
			: input instanceof Request
				? input.url
				: "";
	const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;

	// fix headers
	const headers = new Headers(init?.headers || {});
	headers.delete("accept-encoding"); // prevent stupid encoding bug

	const fetchInit: RequestInit = {
		...init,
		method: init?.method || "GET",
		headers,
		body: init?.body
	};

	return window.fetch(proxyUrl, fetchInit);
}
