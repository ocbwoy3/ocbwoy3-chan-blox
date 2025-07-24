// https://avatar.roblox.com/v2/avatar/users/1083030325/outfits?isEditable=true&itemsPerPage=50&outfitType=Avatar

"use client";

import { useEffect, useState } from "react";
import { useCurrentAccount } from "./useCurrentAccount";
import { proxyFetch } from "@/lib/utils";
import { loadThumbnails } from "@/lib/thumbnailLoader";

type Outfit = {
	name: string,
	id: number
}

export function useAvatarOutfits() {
	const acct = useCurrentAccount();
	const [outfits, setOutfits] = useState<Outfit[] | false | null>(null);

	useEffect(() => {
		if (!acct) return;

		let cancelled = false;

		const fetchSetttings = async () => {
			if (!acct || cancelled) return;
			try {
				const res = await proxyFetch(
					`https://avatar.roblox.com/v2/avatar/users/${acct.id}/outfits?page=1&itemsPerPage=25&isEditable=true`
				);
				const data = await res.json() as {data: Outfit[]};
				if (!cancelled) {
					setOutfits(data.data);
					loadThumbnails(data.data.map(a=>({
						type: "Outfit",
						targetId: a.id,
						format: "webp",
						size: "420x420"
					}))).catch(a=>{})
				}
			} catch {
				if (!cancelled) setOutfits(false);
			}
		};

		fetchSetttings();

		const handleTransaction = () => {
			fetchSetttings();
		};

		window.addEventListener("avatarTransactionCompletedEvent", handleTransaction);

		return () => {
			cancelled = true;
			window.removeEventListener(
				"avatarTransactionCompletedEvent",
				handleTransaction
			);
		};
	}, [acct]);

	return outfits;
}
