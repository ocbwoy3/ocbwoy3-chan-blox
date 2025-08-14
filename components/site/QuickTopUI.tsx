"use client";

import { useRobuxBalance } from "@/hooks/roblox/useRobuxBalance";
import { RobuxIcon } from "../roblox/RobloxIcons";
import React, { useState } from "react";
import { ShirtIcon } from "lucide-react";
import { StupidHoverThing } from "../util/MiscStuff";
import { OutfitSelector } from "./OutfitQuickChooser";
import { proxyFetch } from "@/lib/utils";
import { loadThumbnails } from "@/lib/thumbnailLoader";
import Link from "next/link";
import { useFriendsHome } from "@/hooks/roblox/useFriends";
import { useBestFriends } from "@/hooks/roblox/useBestFriends";
import { useCurrentAccount } from "@/hooks/roblox/useCurrentAccount";
import { useFriendsPresence } from "@/hooks/roblox/usePresence";

async function updateOutfit(outfit: { id: number }, acc: { id: number }) {
	try {
		// ocbwoy3 stupid idiot for using v3 api
		const details = (await (
			await proxyFetch(
				`https://avatar.roblox.com/v1/outfits/${outfit.id}/details`
			)
		).json()) as {
			id: number;
			name: string;
			bodyColors: Record<string, string>;
			scale: Record<string, number>;
		};

		const detailsV3 = (await (
			await proxyFetch(
				`https://avatar.roblox.com/v3/outfits/${outfit.id}/details`
			)
		).json()) as {
			id: number;
			name: string;
			assets: any[];
			bodyColors: Record<string, string>;
			scale: Record<string, number>;
			playerAvatarType: "R6" | "R15";
		};

		await proxyFetch(
			`https://avatar.roblox.com/v1/avatar/set-body-colors`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(details.bodyColors)
			}
		);

		await proxyFetch(`https://avatar.roblox.com/v1/avatar/set-scales`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(details.scale)
		});

		// u cant set avatar item scaling/rotation cuz roblox can't make good web apis
		await proxyFetch(
			`https://avatar.roblox.com/v1/avatar/set-wearing-assets`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					assetIds: detailsV3.assets.map((a) => a.id).filter(Boolean)
				})
			}
		);

		await proxyFetch(
			`https://avatar.roblox.com/v1/avatar/set-player-avatar-type`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					playerAvatarType: detailsV3.playerAvatarType
				})
			}
		);

		loadThumbnails([
			{
				type: "AvatarHeadShot",
				targetId: acc.id,
				format: "webp",
				size: "720x720"
			}
		]).catch(() => {});
	} catch (err) {
		console.error(err);
	}
}

export const QuickTopUI = React.memo(function () {
	const f = useFriendsHome();
	const bf = useBestFriends();
	useCurrentAccount();

	useFriendsPresence([...(f ? f : []), ...(bf ? bf : [])].map((a) => a.id));

	const robux = useRobuxBalance();
	const [isOutfitSelectorVisible, setIsOutfitSelectorVisible] =
		useState<boolean>(false);
	return (
		<>
			{isOutfitSelectorVisible ? (
				<OutfitSelector
					setVisible={setIsOutfitSelectorVisible}
					updateOutfit={updateOutfit}
				/>
			) : (
				<></>
			)}
			<div className="z-50 absolute top-4 right-4 p-4 flex gap-2 items-center text-blue/75">
				<StupidHoverThing text="Change Outfit">
					<button
						className="rounded-full bg-crust/50 flex items-center p-2"
						onClick={() => {
							setIsOutfitSelectorVisible((a) => !a);
						}}
					>
						<ShirtIcon />
					</button>
				</StupidHoverThing>

				<StupidHoverThing
					text={
						!robux
							? "You might probably have some Robux..."
							: `You have ${robux.toLocaleString()} Robux`
					}
				>
					<div className="rounded-full bg-crust/50 flex items-center p-2">
						<RobuxIcon className="w-6 h-6" />
						{robux ? (
							<p className="pl-1">
								{robux ? robux.toLocaleString() : "???"}
							</p>
						) : (
							<></>
						)}
					</div>
				</StupidHoverThing>
			</div>
		</>
	);
});

export const QuickTopUILogoPart = React.memo(function () {
	return (
		<div className="z-[15] relative top-4 left-4 p-4 flex gap-4 items-center text-blue">
			<Link href="/" className="-m-1 w-8 h-8">
				<img src="/icon-512.webp" className="w-8 h-8" alt="" />
			</Link>
			<Link href="/" className="mt-2 gap-2 flex items-center">
				<p>{"ocbwoy3-chan's roblox"}</p>
				{/* <p className="text-surface2 line-clamp-1">
					{process.env.NODE_ENV} {process.env.NEXT_PUBLIC_CWD}{" "}
					{process.env.NEXT_PUBLIC_ARGV0}
				</p> */}
			</Link>
		</div>
	);
});
