"use client";

import React, { useEffect } from "react";
import LazyLoadedImage from "../util/LazyLoadedImage";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { OctagonXIcon } from "lucide-react";
import {
	RobloxPremiumSmall,
	RobloxVerifiedSmall
} from "@/components/roblox/RobloxTooltips";
import { useCurrentAccount } from "@/hooks/roblox/useCurrentAccount";
import { Skeleton } from "../ui/skeleton";
import { useFriendsPresence } from "@/hooks/roblox/usePresence";
import { useAccountSettings } from "@/hooks/roblox/useAccountSettings";
import { loadThumbnails } from "@/lib/thumbnailLoader";
import { toast } from "sonner";

// chatgpt + human
function randomGreeting(name: string): string {
	const greetings = [
		`Howdy, ${name}`
	];

	const index = Math.floor(Math.random() * greetings.length);
	return greetings[index];
}

export function HomeLoggedInHeader() {
	const profile = useCurrentAccount();
	const accountSettings = useAccountSettings();

	if (profile === false) {
		return (
			<div className="justify-center w-screen px-8 py-6">
				<Alert variant="destructive" className="bg-base/50 space-x-2">
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

	const userActivity = presence.find((b) => b.userId === profile?.id);
	const userPresence = userActivity?.userPresenceType;
	const borderColor =
		userPresence === 1
			? "border-blue/25 bg-blue/25"
			: userPresence === 2
			? "border-green/25 bg-green/25"
			: userPresence === 3
			? "border-yellow/25 bg-yellow/25"
			: userPresence === 0
			? "border-surface2/25 bg-surface2/25"
			: "border-red/25 bg-red/25";

	const isLoaded = !!profile && !!accountSettings;

	return (
		<>
			{/* <button onClick={()=>console.log(userPresence)}>debug this</button> */}
			<div
				className="flex items-center gap-6 rounded-xl px-8 py-6 w-fit mt-8 ml-0"
				onContextMenu={(e) => {
					if (e.button === 2) {
						toast("[debug] reloading user pfp");
						console.log("[debug] reloading user pfp");
						loadThumbnails([
							{
								type: "AvatarHeadShot",
								targetId: profile ? profile.id : 1,
								format: "webp",
								size: "720x720"
							}
						]).catch(() => {});
					}
				}}
			>
				{!isLoaded ? (
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
						{isLoaded ? randomGreeting(window.localStorage.UserPreferredName || profile.displayName || "Robloxian!") : (
							<>
								<Skeleton className="w-96 h-8 rounded-lg" />
							</>
						)}
						{!!accountSettings &&
						accountSettings.IsPremium === true ? (
							<RobloxPremiumSmall className="w-6 h-6 fill-transparent" />
						) : (
							<></>
						)}
						{isLoaded ? (
							<RobloxVerifiedSmall className="w-6 h-6 fill-blue text-base" />
						) : (
							<></>
						)}
					</span>
					<span className="text-base font-mono text-subtext0 mt-1">
						{isLoaded ? (
							<>
								@{profile.name}
								{!!userActivity && userPresence === 2 ? (
									<> - {userActivity.lastLocation}</>
								) : (
									<></>
								)}
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
