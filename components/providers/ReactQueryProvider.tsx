"use client";

import { ReactNode, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface Props {
	children: ReactNode;
}

export function ReactQueryProvider({ children }: Props) {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 1000 * 60 * 5, // 5 minutes
				retry: 1
			}
		}
	});

	useEffect(() => {
		// Persist to localStorage (safe, runs client-side)
		const localStoragePersister = createAsyncStoragePersister({
			storage: window.localStorage
		});

		persistQueryClient({
			queryClient,
			persister: localStoragePersister,
			maxAge: 1000 * 60 * 60 // 1 hour max
		});
	}, [window || "wtf"]);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} client={queryClient} />
		</QueryClientProvider>
	);
}
