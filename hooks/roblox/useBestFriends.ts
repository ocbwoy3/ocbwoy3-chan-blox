"use client";

// https://friends.roblox.com/v1/users/1083030325/friends/find?userSort=1

import { useEffect, useState } from "react";
import { useCurrentAccount } from "./useCurrentAccount";
import { proxyFetch } from "@/lib/utils";
import { loadThumbnails } from "@/lib/thumbnailLoader";

let isFetching = false;
let cachedData: any = null;

export function useBestFriends() {
	const acct = useCurrentAccount();
	const [friends, setFriends] = useState<
		| {
				hasVerifiedBadge: boolean;
				id: number;
				name: string;
				displayName: string;
		  }[]
		| null
		| false
	>(cachedData);

	useEffect(() => {
		let cancelled = false;
		if (!acct) return;
		if (isFetching) {
			const IN = setInterval(() => {
				if (cachedData !== null) {
					if (!cancelled) setFriends(cachedData);
					clearInterval(IN);
				}
			}, 50);
			return () => {
				clearInterval(IN);
				cancelled = true;
			};
		}
		isFetching = true;
		(async () => {
			const BestFriendIDs = JSON.parse(window.localStorage.getItem("BestFriendsStore") || "[]") as number[]
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
			const friendsList = BestFriendIDs.map((a) => {
				const x = J2.data.find((b) => b.id === a);
				return {
					id: a,
					hasVerifiedBadge: x?.hasVerifiedBadge || false,
					name: x?.name || "?",
					displayName: x?.displayName || "?"
				};
			});
			if (!cancelled) setFriends(friendsList);
			cachedData = friendsList;
			isFetching = false;
		})();
		return () => {
			cancelled = true;
		};
	}, [acct]);

	return friends;
}
