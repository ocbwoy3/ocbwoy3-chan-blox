"use client";

import React, { useEffect } from "react";
import LazyLoadedImage from "./lazyLoadedImage";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { OctagonXIcon } from "lucide-react";
import { RobloxPremiumSmall, RobloxVerifiedSmall } from "./RobloxTooltipStuff";
import { useCurrentAccount } from "@/hooks/roblox/useCurrentAccount";
import { Skeleton } from "./ui/skeleton";
import { useFriendsPresence } from "@/hooks/roblox/usePresence";

export function HomeLoggedInHeader() {
	const profile = useCurrentAccount();

	if (profile === false) {
		return (
			<div className="justify-center w-screen px-8 py-6">
				<Alert variant="destructive" className="space-x-2">
					<OctagonXIcon />
					<AlertTitle>Failed to fetch account info</AlertTitle>
					<AlertDescription>
						Please make sure <code>.ROBLOSECURITY</code> is set! Is
						Roblox having an outage?
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	const presence = useFriendsPresence(profile ? [profile.id] : []);

	const userActivity = presence.find((b) => b.userId === profile?.id)
	const userPresence = userActivity?.userPresenceType;
	const borderColor =
		userPresence === 1
			? "border-blue bg-blue/50"
			: userPresence === 2
			? "border-green bg-green/50"
			: userPresence === 3
			? "border-yellow bg-yellow/50"
			: userPresence === 0
			? "border-surface2 bg-surface2/50"
			: "border-red bg-red/50";

	return (
		<>
			{/* <button onClick={()=>console.log(userPresence)}>debug this</button> */}
			<div className="flex items-center gap-6 bg-base rounded-xl px-8 py-6 w-fit mt-8 ml-0">
				{!profile ? (
					<Skeleton className="w-28 h-28 rounded-full" />
				) : (
					<LazyLoadedImage
						imgId={`AvatarHeadShot_${profile.id}`}
						alt=""
						className={`w-28 h-28 rounded-full shadow-crust border-2 ${borderColor}`}
					/>
				)}
				<div className="flex flex-col justify-center">
					<span className="text-3xl font-bold text-text flex items-center gap-2">
						{profile ? (
							<>Hello, {profile.displayName}</>
						) : (
							<>
								<Skeleton className="w-96 h-8 rounded-lg" />
							</>
						)}
						{/* TODO: Fetch the User's Roblox Premium subscription state */}
						<RobloxPremiumSmall className="w-6 h-6 fill-transparent" />
						<RobloxVerifiedSmall className="w-6 h-6 fill-blue text-base" />
					</span>
					<span className="text-base font-mono text-subtext0 mt-1">
						{profile ? (
							<>
								@{profile.name}
								{(!!userActivity && userPresence === 2) ? <> - {userActivity.lastLocation}</> : <></> }
							</>
						) : (
							<Skeleton className="w-64 h-6 rounded-lg" />
						)}
					</span>
				</div>
			</div>
		</>
	);
}
