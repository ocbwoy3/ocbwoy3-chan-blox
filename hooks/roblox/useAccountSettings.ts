"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentAccount } from "./useCurrentAccount";
import { proxyFetch } from "@/lib/utils";
import { useEffect } from "react";

type AccountSettings = {
	ChangeUsernameEnabled: boolean;

	/* determines if the account owner is a roblox admin */
	IsAdmin: boolean;

	PreviousUserNames: string;

	/* censored out email */
	UserEmail: string;

	UserAbove13: boolean;

	/* does the user have roblox premium */
	IsPremium: boolean;

	/* ingame chat */
	IsGameChatSettingEnabled: boolean;
};

export function useAccountSettings() {
	const acct = useCurrentAccount();
	const queryClient = useQueryClient();

	const { data: accountSettings } = useQuery<AccountSettings | false | null>({
		queryKey: ["account-settings", acct ? acct.id : "acctId"],
		queryFn: async () => {
			if (!acct) return null;
			try {
				const res = await proxyFetch(
					`https://www.roblox.com/my/settings/json`
				);
				if (!res.ok) {
					console.error(
						`[useAccountSettings] API Error ${res.status} ${res.statusText}`
					);
					return false;
				}
				const data = await res.json();
				return data;
			} catch (error) {
				console.error(
					"[useAccountSettings] Failed to fetch settings",
					error
				);
				return false;
			}
		},
		enabled: !!acct,
		staleTime: Infinity,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false
	});

	useEffect(() => {
		const handleTransaction = () => {
			queryClient.invalidateQueries({
				queryKey: ["account-settings", acct ? acct.id : "acctId"]
			});
		};

		window.addEventListener(
			"settingTransactionCompletedEvent",
			handleTransaction
		);

		return () => {
			window.removeEventListener(
				"settingTransactionCompletedEvent",
				handleTransaction
			);
		};
	}, [acct ? acct.id : "acctId", queryClient]);

	return accountSettings;
}
