"use client";

import {
	BestFriendsHomeSect,
	FriendsHomeSect
} from "@/components/roblox/FriendsOnline";
import { GameCard } from "@/components/roblox/GameCard";
import { HomeLoggedInHeader } from "@/components/site/HomeUserHeader";
import { OutfitSelector } from "@/components/site/OutfitQuickChooser";
import { QuickTopUI, QuickTopUILogoPart } from "@/components/site/QuickTopUI";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import {
	getOmniRecommendationsHome,
	OmniRecommendation
} from "@/lib/omniRecommendation";
import { loadThumbnails } from "@/lib/thumbnailLoader";
import { AlertTriangleIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
	const SORTS_ALLOWED_IDS = [100000003, 100000001];
	const [rec, setRec] = useState<OmniRecommendation | null>(null);
	useEffect(() => {
		setTimeout(async () => {
			const r = await getOmniRecommendationsHome();
			if (r) {
				setRec(r);
				loadThumbnails(
					Object.entries(r.contentMetadata.Game).map((a) => ({
						type: "GameThumbnail",
						targetId: Number(a[1].rootPlaceId),
						format: "webp",
						size: "384x216"
					}))
				).catch((a) => {});
			}
		}, 1000);
	}, []);

	return (
		<>
			<Image src={window.localStorage.BgImageUrl || "/bg.png"} width={1920} height={1080} className="w-screen h-screen bg-blend-hard-light fixed top-0 left-0 blur-lg opacity-25" alt=""/>
			<div className="z-10 isolate overflow-scroll no-scrollbar w-screen max-h-screen h-screen antialiased overflow-x-hidden">
				<QuickTopUI />
				<QuickTopUILogoPart />
				<HomeLoggedInHeader />
				<div className="h-4" />
				<BestFriendsHomeSect className="pt-2" />
				<FriendsHomeSect className="pt-2" />
				<div className="justify-center w-screen px-8 pt-6">
					<Alert variant="default" className="bg-base/50 space-x-2">
						<AlertTriangleIcon />
						<AlertTitle>Warning</AlertTitle>
						<AlertDescription>
							This is work in progess, you can follow the
							development process on GitHub.
						</AlertDescription>
					</Alert>
				</div>
				<div className="p-4 space-y-8 no-scrollbar">
					{!rec ? (
						<Card>
							<CardContent className="p-4">
								<div className="h-[200px] flex items-center justify-center">
									<div className="animate-pulse text-muted-foreground">
										{"Loading..."}
									</div>
								</div>
							</CardContent>
						</Card>
					) : (
						rec.sorts
							.filter((a) =>
								SORTS_ALLOWED_IDS.includes(a.topicId)
							)
							.map((sort, idx) => (
								<div key={idx}>
									<h1 className="text-2xl pb-2">
										{sort.topic}
									</h1>
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
										{(sort.recommendationList || []).map(
											(recommendation, idxb) => {
												const game =
													rec.contentMetadata.Game[
														recommendation.contentId.toString()
													];
												return (
													<GameCard
														key={idxb}
														game={game}
													/>
												);
											}
										)}
									</div>
								</div>
							))
					)}
				</div>
			</div>
		</>
	);
}
