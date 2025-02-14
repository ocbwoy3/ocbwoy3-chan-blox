import { getCookie } from "./roblox"

export type UserProfileDetails = {
	description: string,
	created: Date,
	isBanned: boolean,
	externalAppDisplayName: string,
	hasVerifiedBadge: boolean,
	id: number,
	name: string,
	displayName: string
}

export async function getLoggedInUser(): Promise<{
	id: number,
	name: string,
	displayName: string
}> {
	const data = await fetch(`${document.baseURI}api/user/authenticated`, {
		method: "GET",
		headers: {
			Authorization: `${getCookie()}`
		},
	})
	return (await data.json() as any) as {
		id: number,
		name: string,
		displayName: string
	}
}

export async function getUserByUserId(userid: string): Promise<UserProfileDetails> {
	const data = await fetch(`${document.baseURI}api/user?id=${userid}`, {
		method: "GET",
		headers: {
			Authorization: `${getCookie()}`
		},
	})
	return (await data.json() as any) as UserProfileDetails
}