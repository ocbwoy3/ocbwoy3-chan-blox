"use client";

import { useQuery } from "@tanstack/react-query";
import {
	getLoggedInUser,
	getUserByUserId,
	UserProfileDetails
} from "@/lib/profile";
import { loadThumbnails } from "@/lib/thumbnailLoader";

export function useCurrentAccount(): UserProfileDetails | null | false {
	const query = useQuery<UserProfileDetails | false>({
		queryKey: ["currentAccount"],
		queryFn: async () => {
			const authed = await getLoggedInUser();
			if (!authed) return false;

			const user = await getUserByUserId(authed.id.toString());

			loadThumbnails([
				{
					type: "AvatarHeadShot",
					targetId: authed.id,
					format: "webp",
					size: "720x720"
				}
			]).catch(() => {});

			return user;
		},
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false
	});

	return query.data ?? null;
}
