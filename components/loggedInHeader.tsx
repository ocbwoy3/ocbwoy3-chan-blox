"use client";

import {
	getLoggedInUser,
	getUserByUserId,
	UserProfileDetails
} from "@/lib/profile";
import React, { useEffect, useState } from "react";
import LazyLoadedImage from "./lazyLoadedImage";
import { loadThumbnails } from "@/lib/thumbnailLoader";
import { PremiumIconSmall, VerifiedIcon } from "./RobloxIcons";

export const HomeLoggedInHeader = React.memo(function HomeLoggedInHeader() {
	const [profileDetails, setProfileDetails] =
		useState<UserProfileDetails | null>(null);

	useEffect(() => {
		(async () => {
			const authed = await getLoggedInUser();
			setProfileDetails(await getUserByUserId(authed.id.toString()));
		})();
	}, []);

	if (!profileDetails) {
		return <></>;
	}

	loadThumbnails([
		{
			type: "AvatarHeadShot",
			targetId: profileDetails.id,
			format: "webp",
			size: "720x720"
		}
	]).catch((a) => {});

	return (
		<div className="flex items-center gap-6 bg-base rounded-xl px-8 py-6 w-fit mt-8 ml-0">
			<LazyLoadedImage
				imgId={`AvatarHeadShot_${profileDetails.id}`}
				alt=""
				className="w-28 h-28 rounded-full shadow-2xl"
			/>
			<div className="flex flex-col justify-center">
				<span className="text-3xl font-bold text-text flex items-center gap-2">
					Hello, {profileDetails.displayName}
					{/* TODO: Fetch the User's Roblox Premium subscription state */}
					<PremiumIconSmall className="w-6 h-6 fill-transparent" />
					<VerifiedIcon className="w-6 h-6 fill-blue text-base" />
				</span>
				<span className="text-base font-mono text-subtext0 mt-1">
					@{profileDetails.name}
				</span>
			</div>
		</div>
	);
});
