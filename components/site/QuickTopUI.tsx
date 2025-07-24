"use client";

import { useRobuxBalance } from "@/hooks/roblox/useRobuxBalance";
import { RobuxIcon } from "../roblox/RobloxIcons";
import React, { useState } from "react";
import { Separator } from "../ui/separator";
import { Bell, SettingsIcon, ShirtIcon } from "lucide-react";
import { StupidHoverThing } from "../util/MiscStuff";
import { toast } from "sonner";
import { OutfitSelector } from "./OutfitQuickChooser";
import { proxyFetch } from "@/lib/utils";
import { loadThumbnails } from "@/lib/thumbnailLoader";

/**
requires csrf token cuz u cant use noblox.js on the web

either go to https://roblox.com/my/avataar or the app to change ur fit
*/
async function updateOutfit(outfit: { id: number }, acc: {id: number}) {
	try {
		const J = (await (
			await proxyFetch(
				`https://avatar.roblox.com/v3/outfits/${outfit.id}/details`
			)
		).json()) as {
			id: number;
			name: string;
			assets: any[];
		};
		await proxyFetch(
			`https://avatar.roblox.com/v1/avatar/set-wearing-assets`,
			{
				method: "POST",
				body: JSON.stringify({
					assetIds: J.assets.map(a=>a.id).filter(a=>!!a)
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
		]).catch((a) => {});
	} catch {}
}



export const QuickTopUI = React.memo(function () {
	const robux = useRobuxBalance();
	const [isOutfitSelectorVisible, setIsOutfitSelectorVisible] =
		useState<boolean>(false);
	return (
		<>
			{/* {isOutfitSelectorVisible ? (
				<OutfitSelector setVisible={setIsOutfitSelectorVisible} updateOutfit={updateOutfit} />
			) : (
				<></>
			)} */}
			<div className="z-50 absolute top-4 right-4 p-4 flex gap-2 items-center text-blue/75">
				{/* <StupidHoverThing text="Change Outfit">
					<button
						className="rounded-full bg-crust/50 flex items-center p-2"
						onClick={() => {
							setIsOutfitSelectorVisible((a) => !a);
						}}
					>
						<ShirtIcon />
					</button>
				</StupidHoverThing> */}

				<StupidHoverThing
					text={!robux ? "Loading..." : `You have ${robux} Robux`}
				>
					<div className="rounded-full bg-crust/50 flex items-center p-2">
						<RobuxIcon className="w-6 h-6" />
						{robux ? (
							<p className="pl-1">{robux || "???"}</p>
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
			<img src="/icon-512.webp" className="-m-1 w-8 h-8" alt="" />
			<p className="mt-2">{"not roblox lol"}</p>
		</div>
	);
});
