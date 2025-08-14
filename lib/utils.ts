"use client";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function proxyFetchRaw(
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

	// Fix headers
	const headers = new Headers(init?.headers || {});
	headers.delete("accept-encoding"); // prevent encoding issues

	const fetchInit: RequestInit = {
		...init,
		method: init?.method || "GET",
		headers,
		body: init?.body
	};

	return window.fetch(proxyUrl, fetchInit);
}

// CSRF-aware proxy fetch
export async function proxyFetch(
	input: RequestInfo | URL,
	init?: RequestInit
): Promise<Response> {
	const xsrfRequestMethods = ["POST", "PATCH", "DELETE"];
	const csrfTokenHeader = "x-csrf-token";
	const csrfInvalidResponseCode = 403;

	const method = init?.method?.toUpperCase() || "GET";

	let response = await proxyFetchRaw(input, init);

	if (
		xsrfRequestMethods.includes(method) &&
		response.status === csrfInvalidResponseCode &&
		response.headers.has(csrfTokenHeader)
	) {
		const newHeaders = new Headers(init?.headers || {});
		newHeaders.set(csrfTokenHeader, response.headers.get(csrfTokenHeader)!);

		response = await proxyFetchRaw(input, {
			...init,
			headers: newHeaders
		});
	}

	return response;
}
