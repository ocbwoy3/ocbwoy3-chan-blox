"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useCurrentAccount } from "./useCurrentAccount";
import { proxyFetch } from "@/lib/utils";
import { loadThumbnails } from "@/lib/thumbnailLoader";

type Outfit = {
	name: string;
	id: number;
};

export function useAvatarOutfits(): Outfit[] | false | null {
	const acct = useCurrentAccount();
	const queryClient = useQueryClient();

	const query = useQuery<Outfit[] | false>({
		queryKey: ["avatarOutfits", acct ? acct.id : "acctId"],
		enabled: !!acct,
		queryFn: async () => {
			if (!acct) return false;

			const res = await proxyFetch(
				`https://avatar.roblox.com/v2/avatar/users/${acct.id}/outfits?page=1&itemsPerPage=25&isEditable=true`
			);
			const data = (await res.json()) as { data: Outfit[] };

			loadThumbnails(
				data.data.map((a) => ({
					type: "Outfit",
					targetId: a.id,
					format: "webp",
					size: "420x420"
				}))
			).catch(() => {});

			return data.data;
		},
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false
	});

	useEffect(() => {
		const handleTransaction = () => {
			queryClient.invalidateQueries({
				queryKey: ["avatarOutfits", acct ? acct.id : "acctId"]
			});
		};

		window.addEventListener(
			"avatarTransactionCompletedEvent",
			handleTransaction
		);
		return () => {
			window.removeEventListener(
				"avatarTransactionCompletedEvent",
				handleTransaction
			);
		};
	}, [acct ? acct.id : "acctId", queryClient]);

	return query.data ?? null;
}
