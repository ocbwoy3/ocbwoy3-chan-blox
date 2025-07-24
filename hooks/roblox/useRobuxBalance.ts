"use client";

import { useEffect, useState } from "react";
import { useCurrentAccount } from "./useCurrentAccount";
import { proxyFetch } from "@/lib/utils";

let isFetching = false;
let cachedData: number | false | null = null;

export function useRobuxBalance() {
	const acct = useCurrentAccount();
	const [robux, setRobux] = useState<number | false | null>(cachedData);

	useEffect(() => {
		let cancelled = false;
		if (!acct) return;

		async function fetchBalance() {
			if (isFetching) return;
			if (!acct) return;
			isFetching = true;
			try {
				const res = await proxyFetch(
					`https://economy.roblox.com/v1/users/${acct.id}/currency`
				);
				const data = await res.json();
				if (!cancelled) setRobux(data.robux);
				cachedData = data.robux;
			} catch {
				if (!cancelled) setRobux(false);
				cachedData = false;
			} finally {
				isFetching = false;
			}
		}

		fetchBalance();

		function handleTransaction() {
			fetchBalance();
		}

		window.addEventListener("transactionCompletedEvent", handleTransaction);

		return () => {
			cancelled = true;
			window.removeEventListener(
				"transactionCompletedEvent",
				handleTransaction
			);
		};
	}, [acct]);

	return robux;
}
