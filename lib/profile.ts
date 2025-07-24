"use client";

import { proxyFetch } from "./utils";

export type UserProfileDetails = {
	description: string;
	created: Date;
	isBanned: boolean;
	externalAppDisplayName: string;
	hasVerifiedBadge: boolean;
	id: number;
	name: string;
	displayName: string;
};

export async function getLoggedInUser(): Promise<{
	id: number;
	name: string;
	displayName: string;
} | null> {
	const data = await proxyFetch(
		`https://users.roblox.com/v1/users/authenticated`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		}
	);
	const J = await data.json();
	if (J.errors) {
		return null;
	}
	return J as any as {
		id: number;
		name: string;
		displayName: string;
	};
}

export async function getUserByUserId(
	userid: string
): Promise<UserProfileDetails> {
	const data = await proxyFetch(
		`https://users.roblox.com/v1/users/${userid}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		}
	);
	return (await data.json()) as any as UserProfileDetails;
}
