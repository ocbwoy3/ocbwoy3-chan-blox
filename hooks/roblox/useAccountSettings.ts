"use client";

import { useEffect, useState } from "react";
import { useCurrentAccount } from "./useCurrentAccount";
import { proxyFetch } from "@/lib/utils";

type AccountSettings = {
	ChangeUsernameEnabled: boolean

	/* determines if the account owner is a roblox admin */
	IsAdmin: boolean,

	PreviousUserNames: string,

	/* censored out email */
	UserEmail: string,

	UserAbove13: boolean,

	/* does the user have roblox premium */
	IsPremium: boolean,

	/* ingame chat */
	IsGameChatSettingEnabled: boolean
}

export function useAccountSettings() {
	const acct = useCurrentAccount();
	const [accountSettings, setAccountSettings] = useState<AccountSettings | false | null>(null);

	useEffect(() => {
		if (!acct) return;

		let cancelled = false;

		const fetchSetttings = async () => {
			if (!acct || cancelled) return;
			try {
				const res = await proxyFetch(
					`https://www.roblox.com/my/settings/json`
				);
				const data = await res.json();
				if (!cancelled) setAccountSettings(data);
			} catch {
				if (!cancelled) setAccountSettings(false);
			}
		};

		fetchSetttings();

		const handleTransaction = () => {
			fetchSetttings();
		};

		window.addEventListener("settingTransactionCompletedEvent", handleTransaction);

		return () => {
			cancelled = true;
			window.removeEventListener(
				"settingTransactionCompletedEvent",
				handleTransaction
			);
		};
	}, [acct]);

	return accountSettings;
}
