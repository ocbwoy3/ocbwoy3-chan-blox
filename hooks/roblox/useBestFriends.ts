"use client";

import { useQuery } from "@tanstack/react-query";
import { proxyFetch } from "@/lib/utils";
import { loadThumbnails } from "@/lib/thumbnailLoader";
import { useCurrentAccount } from "./useCurrentAccount";

export function useBestFriends():
	| {
			hasVerifiedBadge: boolean;
			id: number;
			name: string;
			displayName: string;
	  }[]
	| null
	| false {
	const acct = useCurrentAccount();

	const query = useQuery<
		| {
				hasVerifiedBadge: boolean;
				id: number;
				name: string;
				displayName: string;
		  }[]
		| false
	>({
		queryKey: ["bestFriends", acct ? acct.id : "acctId"],
		enabled: !!acct,
		queryFn: async () => {
			if (!acct) return false;

			const BestFriendIDs = JSON.parse(
				window.localStorage.getItem("BestFriendsStore") || "[]"
			) as number[];

			if (BestFriendIDs.length === 0) return [];

			const friendsAPICall2 = await proxyFetch(
				`https://users.roblox.com/v1/users`,
				{
					method: "POST",
					body: JSON.stringify({
						userIds: BestFriendIDs,
						excludeBannedUsers: false
					})
				}
			);

			const J2 = (await friendsAPICall2.json()) as {
				data: {
					hasVerifiedBadge: boolean;
					id: number;
					name: string;
					displayName: string;
				}[];
			};

			loadThumbnails(
				J2.data.map((a) => ({
					type: "AvatarHeadShot",
					size: "420x420",
					targetId: a.id,
					format: "webp"
				}))
			).catch(() => {});

			return BestFriendIDs.map((a) => {
				const x = J2.data.find((b) => b.id === a);
				return {
					id: a,
					hasVerifiedBadge: x?.hasVerifiedBadge || false,
					name: x?.name || "?",
					displayName: x?.displayName || "?"
				};
			});
		},
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false
	});

	return query.data ?? null;
}
