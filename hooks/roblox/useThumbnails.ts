"use client";

import { useQuery } from "@tanstack/react-query";
import {
	getThumbnails,
	ThumbnailRequest,
	AssetThumbnail
} from "@/lib/thumbnailLoader";

export function useThumbnails(requests: ThumbnailRequest[]) {
	return useQuery<AssetThumbnail[], Error>({
		queryKey: ["thumbnails", requests.map((r) => r.targetId)],
		queryFn: () => getThumbnails(requests),
		staleTime: 1000 * 60 * 5, // 5 minutes
		enabled: false
	});
}
