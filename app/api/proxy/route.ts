// chatgpt
function rewriteCookieDomain(rawCookie: string): string {
	return rawCookie
		.replace(/;?\s*Domain=[^;]+/i, '')
		.concat(`; Domain=localhost:3000`);
}

// chatgpt
async function proxyRequest(request: Request, method: string) {
	const { searchParams } = new URL(request.url);
	const target = searchParams.get("url");

	if (!target) {
		return new Response(
			JSON.stringify({ error: "missing url param, dumbass" }),
			{
				status: 400,
				headers: { "Content-Type": "application/json" }
			}
		);
	}

	const targetUrl = new URL(target);

	const headers = new Headers(request.headers);
	headers.delete("host");
	headers.delete("accept-encoding");

	const init: RequestInit = {
		method,
		headers,
		body: method === "GET" || method === "HEAD" ? undefined : request.body
	};

	if (init.body !== undefined) {
		(init as any).duplex = "half";
	}

	const response = await fetch(targetUrl, init);

	// Copy all response headers
	const responseHeaders = new Headers(response.headers);
	responseHeaders.delete("content-encoding");

	const rawSetCookies = response.headers.getSetCookie?.() ?? [];

	if (rawSetCookies.length > 0) {
		responseHeaders.delete("set-cookie");

		for (const rawCookie of rawSetCookies) {
			const rewritten = rewriteCookieDomain(rawCookie);
			responseHeaders.append("set-cookie", rewritten);
		}
	}

	return new Response(response.body, {
		status: response.status,
		headers: responseHeaders
	});
}

export async function GET(request: Request) {
	return proxyRequest(request, "GET");
}

export async function HEAD(request: Request) {
	return proxyRequest(request, "HEAD");
}

export async function POST(request: Request) {
	return proxyRequest(request, "POST");
}

export async function PUT(request: Request) {
	return proxyRequest(request, "PUT");
}

export async function DELETE(request: Request) {
	return proxyRequest(request, "DELETE");
}

export async function PATCH(request: Request) {
	return proxyRequest(request, "PATCH");
}
