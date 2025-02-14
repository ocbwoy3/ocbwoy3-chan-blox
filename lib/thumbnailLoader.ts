"use client";

import { addGameThumbnail } from "@/hooks/use-lazy-load";
import { getCookie } from "./roblox";

export type AssetThumbnail = {
	requestId: string,
	errorCode: number,
	errorMessage: string,
	targetId: number,
	state: "Completed" | string,
	imageUrl: string,
	version: string
}

export type ThumbnailRequest = {
	type: "GameThumbnail",
	targetId: number,
	format: "webp",
	size: string
}

export async function getThumbnails(b: ThumbnailRequest[]): Promise<AssetThumbnail[]> {
	const data = await fetch(`${document.baseURI}api/thumbnails/batch`,{
		method: "POST",
		headers: {
			Authorization: `${getCookie()}`
		},
		body: JSON.stringify(
			b.map(a=>{
				return {
					requestId: `${a.targetId}::${a.type}:${a.size}:${a.format}:regular`,
					type: a.type,
					targetId: a.targetId,
					token: "",
					format: a.format,
					size: a.size
				}
			})
		)
	})
	return (await data.json() as any).data as AssetThumbnail[]
}

export async function loadThumbnails(b: ThumbnailRequest[]): Promise<void> {
	const th = await getThumbnails(b);
	th.forEach(a=>{
		addGameThumbnail(a.targetId.toString(), a.imageUrl)
	})
}

// https://apis.roblox.com/discovery-api/omni-recommendation