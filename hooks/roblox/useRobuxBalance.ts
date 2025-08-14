"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentAccount } from "./useCurrentAccount";
import { proxyFetch } from "@/lib/utils";
import { useEffect } from "react";

export function useRobuxBalance() {
	const acct = useCurrentAccount();
	const queryClient = useQueryClient();

	const { data: robux } = useQuery<number | false | null>({
		queryKey: ["robux-balance", acct ? acct.id : "acctId"],
		queryFn: async () => {
			if (!acct) return null;
			try {
				const res = await proxyFetch(
					`https://economy.roblox.com/v1/users/${acct.id}/currency`
				);
				const data = await res.json();
				return data.robux;
			} catch {
				return false;
			}
		},
		enabled: !!acct,
		refetchInterval: 10000,
		staleTime: 10000
	});

	useEffect(() => {
		const handleTransaction = () => {
			queryClient.invalidateQueries({
				queryKey: ["robux-balance", acct ? acct.id : "acctId"]
			});
		};

		window.addEventListener("transactionCompletedEvent", handleTransaction);

		return () => {
			window.removeEventListener(
				"transactionCompletedEvent",
				handleTransaction
			);
		};
	}, [acct ? acct.id : "acctId", queryClient]);

	return robux;
}
