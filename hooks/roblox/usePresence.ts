"use client";

// smartass method by google gemini

import { useEffect, useState, useMemo } from "react";
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

// --- Internal Shared State ---

/**
 * A Map to track subscribers.
 * Key: The component's update callback function.
 * Value: The array of user IDs that component is interested in.
 * This allows multiple components to subscribe with their own lists of IDs.
 */
let subscribers = new Map<(data: PresenceData[]) => void, number[]>();

let interval: ReturnType<typeof setInterval> | null = null;

let latestData: PresenceData[] = [];

/**
 * Fetches presence for all unique user IDs requested by all subscribed components.
 * @param acctId - The ID of the currently logged-in user.
 */
async function fetchPresence(acctId: number) {
	const allIdArrays = [...subscribers.values()];
	const uniqueUserIds = [...new Set(allIdArrays.flat())];

	if (!acctId || uniqueUserIds.length === 0) {
		return;
	}

	try {
		const res = await proxyFetch(
			"https://presence.roblox.com/v1/presence/users",
			{
				method: "POST",
				body: JSON.stringify({
					userIds: [...new Set([acctId, ...uniqueUserIds])]
				}),
				headers: {
					"Content-Type": "application/json"
				}
			}
		);

		if (!res.ok) {
			throw new Error(`API request failed with status ${res.status}`);
		}

		const json = await res.json();
		latestData = json.userPresences || [];

		subscribers.forEach((_requestedIds, callback) => callback(latestData));
	} catch (error) {
		console.error("Failed to fetch presence:", error);
		latestData = [];
		subscribers.forEach((_requestedIds, callback) => callback([]));
	}
}

/**
 * A React hook to get the real-time presence of a list of Roblox users.
 * This hook can be used by multiple components simultaneously without conflict.
 *
 * @param userIds - An array of user IDs to track.
 * @returns An array of PresenceData objects for the requested user IDs.
 */
export function useFriendsPresence(userIds: number[]) {
	const acct = useCurrentAccount();
	const [data, setData] = useState<PresenceData[]>([]);

	const userIdsKey = useMemo(
		() => JSON.stringify([...userIds].sort()),
		[userIds]
	);

	useEffect(() => {
		if (!acct || !userIds || userIds.length === 0) {
			setData([]);
			return;
		}

		const updateCallback = (globalData: PresenceData[]) => {
			const filteredData = globalData.filter((presence) =>
				userIds.includes(presence.userId)
			);
			setData(filteredData);
		};

		updateCallback(latestData);

		subscribers.set(updateCallback, userIds);

		if (!interval) {
			fetchPresence(acct.id);
			interval = setInterval(() => fetchPresence(acct.id), 5000);
		} else {
			fetchPresence(acct.id);
		}

		// The cleanup function runs when the component unmounts.
		return () => {
			subscribers.delete(updateCallback);

			if (subscribers.size === 0 && interval) {
				clearInterval(interval);
				interval = null;
				latestData = [];
			}
		};
	}, [acct, userIdsKey]);

	return data;
}
