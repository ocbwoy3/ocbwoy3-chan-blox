"use client";

import { useQuery } from "@tanstack/react-query";
import { addThumbnail } from "@/hooks/use-lazy-load";
import { proxyFetch } from "./utils";

export type AssetThumbnail = {
	requestId: string;
	errorCode: number;
	errorMessage: string;
	targetId: number;
	state: "Completed" | string;
	imageUrl: string;
	version: string;
};

export type ThumbnailRequest = {
	type: "GameThumbnail" | "AvatarHeadShot" | "Outfit" | `${string}`;
	targetId: number;
	format: "webp";
	size: string;
};

/*
! WARNING: DO NOT USE
*/
export async function getThumbnails(
	b: ThumbnailRequest[]
): Promise<AssetThumbnail[]> {
	const batchSize = 100;
	const results: AssetThumbnail[] = [];

	for (let i = 0; i < b.length; i += batchSize) {
		const batch = b.slice(i, i + batchSize);
		const data = await proxyFetch(
			`https://thumbnails.roblox.com/v1/batch`,
			{
				method: "POST",
				body: JSON.stringify(
					batch.map((a) => ({
						requestId: `${a.targetId}::${a.type}:${a.size}:${a.format}:regular`,
						type: a.type,
						targetId: a.targetId,
						token: "",
						format: a.format,
						size: a.size
					}))
				),
				headers: {
					"Content-Type": "application/json"
				}
			}
		);

		const json = await data.json();
		json.data.forEach((a: AssetThumbnail) => {
			const ty = b.find((c) => c.targetId === a.targetId)!;
			addThumbnail(`${ty.type}_${a.targetId}`, a.imageUrl);
		});

		results.push(...(json.data as AssetThumbnail[]));
	}

	return results;
}

// React Query hook for caching
export function useThumbnails(requests: ThumbnailRequest[]) {
	return useQuery({
		queryKey: ["thumbnails", requests.map((r) => r.targetId)],
		queryFn: () => getThumbnails(requests),
		staleTime: 1000 * 60 * 5 // 5 minutes
	});
}

// Optional helper to load without a hook
export async function loadThumbnails(b: ThumbnailRequest[]): Promise<void> {
	const th = await getThumbnails(b);
}
