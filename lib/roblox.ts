"use client";

export function setCookie(cookie: string): void {
	window.localStorage.roblosecurity = cookie;
}

export function getCookie() {
	return window.localStorage.roblosecurity
}
