"use client";

import { useEffect, useState } from "react";
import { useCurrentAccount } from "./useCurrentAccount";
import { proxyFetch } from "@/lib/utils";

export function useRobuxBalance() {
	const acct = useCurrentAccount();
	const [robux, setRobux] = useState<number | false | null>(null);

	useEffect(() => {
		if (!acct) return;

		let cancelled = false;

		const fetchBalance = async () => {
			if (!acct || cancelled) return;
			try {
				const res = await proxyFetch(
					`https://economy.roblox.com/v1/users/${acct.id}/currency`
				);
				const data = await res.json();
				if (!cancelled) setRobux(data.robux);
			} catch {
				if (!cancelled) setRobux(false);
			}
		};

		fetchBalance();
		const interval = setInterval(fetchBalance, 10000);

		const handleTransaction = () => {
			fetchBalance();
		};

		window.addEventListener("transactionCompletedEvent", handleTransaction);

		return () => {
			cancelled = true;
			clearInterval(interval);
			window.removeEventListener(
				"transactionCompletedEvent",
				handleTransaction
			);
		};
	}, [acct]);

	return robux;
}
