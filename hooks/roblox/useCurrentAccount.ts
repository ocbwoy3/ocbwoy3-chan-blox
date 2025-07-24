"use client";

import {
	getLoggedInUser,
	getUserByUserId,
	UserProfileDetails
} from "@/lib/profile";
import { loadThumbnails } from "@/lib/thumbnailLoader";
import { useEffect, useState } from "react";

let isFetching = false;
let cachedData: any = null;

export function useCurrentAccount() {
	const [profileDetails, setProfileDetails] = useState<
		UserProfileDetails | null | false
	>(cachedData);

	useEffect(() => {
		let cancelled = false;
		if (profileDetails !== null) return;
		if (isFetching) {
			const IN = setInterval(() => {
				if (cachedData !== null) {
					if (!cancelled) setProfileDetails(cachedData);
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
			const authed = await getLoggedInUser();
			if (authed) {
				const user = await getUserByUserId(authed.id.toString());
				if (!cancelled) setProfileDetails(user);
				cachedData = user;
				loadThumbnails([
					{
						type: "AvatarHeadShot",
						targetId: authed.id,
						format: "webp",
						size: "720x720"
					}
				]).catch(() => {});
			} else {
				if (!cancelled) setProfileDetails(false);
				cachedData = false;
			}
			isFetching = false;
		})();
		return () => {
			cancelled = true;
		};
	}, [profileDetails]);

	return profileDetails;
}
