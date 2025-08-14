"use client";

import { useQuery } from "@tanstack/react-query";
import { useCurrentAccount } from "./useCurrentAccount";
import { proxyFetch } from "@/lib/utils";

type PresenceData = {
	userPresenceType: number;
	lastLocation: string;
	placeId: number;
	rootPlaceId: number;
	gameId: string;
	universeId: number;
	userId: number;
};

/**
 * A React hook to get the real-time presence of a list of Roblox users.
 * This hook uses @tanstack/react-query to handle caching and periodic refetching.
 *
 * @param userIds - An array of user IDs to track.
 * @returns An array of PresenceData objects for the requested user IDs.
 */
export function useFriendsPresence(userIds: number[]) {
	const acct = useCurrentAccount();

	// Sort userIds to ensure the query key is stable, regardless of the order of IDs.
	const sortedUserIds = [...(userIds || [])].sort();

	const { data: presences = [] } = useQuery({
		queryKey: ["presence", ...sortedUserIds],
		queryFn: async () => {
			if (!acct || sortedUserIds.length === 0) {
				return [];
			}

			const res = await proxyFetch(
				"https://presence.roblox.com/v1/presence/users",
				{
					method: "POST",
					body: JSON.stringify({
						userIds: sortedUserIds
					}),
					headers: {
						"Content-Type": "application/json"
					}
				}
			);

			if (!res.ok) {
				console.error(
					`[usePresence] API Error ${res.status} ${res.statusText}`
				);
				throw new Error(`API request failed with status ${res.status}`);
			}

			const json = await res.json();
			return (json.userPresences || []) as PresenceData[];
		},
		enabled: !!acct && sortedUserIds.length > 0,
		refetchInterval: 5000,
		refetchOnWindowFocus: false
	});

	return presences;
}
