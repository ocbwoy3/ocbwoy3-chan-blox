import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const apiUrl = "https://thumbnails.roblox.com/v1/batch";

	const url = `${apiUrl}?${searchParams.toString()}`;

	try {
		const response = await fetch(url, {
			headers: {
				"User-Agent": "OCbwoy3ChanAI/1.0",
				"Accept": "application/json, text/plain, */*",
				"Accept-Encoding": "gzip, deflate, br, zstd",
				"Content-Type": "application/json;charset=UTF-8",
				"Cookie": request.headers.get("Authorization") || "",
			},
		});

		return NextResponse.json(await response.json());
	} catch (error) {
		console.error("Error proxying request:", error);
		return NextResponse.json({ error: "Internal Server Error" });
	}
}

export async function POST(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const apiUrl = "https://thumbnails.roblox.com/v1/batch";
	const url = `${apiUrl}?${searchParams.toString()}`;

	try {
		const body = await request.json()
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"User-Agent": "OCbwoy3ChanAI/1.0",
				"Accept": "application/json, text/plain, */*",
				"Accept-Encoding": "gzip, deflate, br, zstd",
				"Content-Type": "application/json;charset=UTF-8",
				"Cookie": request.headers.get("Authorization") || "",
			},
			body: JSON.stringify(body),
		});

		return NextResponse.json(await response.json());
	} catch (error) {
		console.error("Error proxying request:", error);
		return NextResponse.json({ error: "Internal Server Error" });
	}
}

