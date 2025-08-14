"use client";

import { useQuery } from "@tanstack/react-query";
import { useCurrentAccount } from "./useCurrentAccount";
import { proxyFetch } from "@/lib/utils";
import { loadThumbnails } from "@/lib/thumbnailLoader";
import { UserProfileDetails } from "@/lib/profile";

export function useFriendsHome() {
	const acct = useCurrentAccount();
	const { data: friends } = useQuery({
		queryKey: ["friends", acct ? acct.id : "acctId"],
		queryFn: async () => {
			if (!acct) return null;
			const friendsAPICall = await proxyFetch(
				`https://friends.roblox.com/v1/users/${acct.id}/friends`
			);
			const j = (await friendsAPICall.json()) as {
				data: { id: number }[];
			};
			const friendsAPICall2 = await proxyFetch(
				`https://users.roblox.com/v1/users`,
				{
					method: "POST",
					body: JSON.stringify({
						userIds: j.data.map((a) => a.id),
						excludeBannedUsers: false
					})
				}
			);
			const j2 = (await friendsAPICall2.json()) as {
				data: {
					hasVerifiedBadge: boolean;
					id: number;
					name: string;
					displayName: string;
				}[];
			};
			loadThumbnails(
				j2.data.map((a) => ({
					type: "AvatarHeadShot",
					size: "420x420",
					targetId: a.id,
					format: "webp"
				}))
			).catch(() => {});
			const friendsList = j.data.map((a) => {
				const x = j2.data.find((b) => b.id === a.id);
				return {
					id: a.id,
					hasVerifiedBadge: x?.hasVerifiedBadge || false,
					name: x?.name || "?",
					displayName: x?.displayName || "?"
				};
			});
			return friendsList;
		},
		enabled: !!acct,
		staleTime: 300000, // 5 minutes
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false
	});

	return friends;
}
