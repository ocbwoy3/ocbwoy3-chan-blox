"use client";

import { GameCard } from "@/components/gameCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	getOmniRecommendationsHome,
	OmniRecommendation,
} from "@/lib/omniRecommendation";
import { loadThumbnails, ThumbnailRequest } from "@/lib/thumbnailLoader";
import { useEffect, useState } from "react";

export default function Home() {
	const [rec, setRec] = useState<OmniRecommendation | null>(null);
	const SORTS_ALLOWED_IDS = [100000003, 100000001];
	useEffect(() => {
		(async () => {
			const r = await getOmniRecommendationsHome();
			console.log("[ROBLOX]", "got omni recommendation from api", r);
			let th: ThumbnailRequest[] = [];
			r.sorts.filter(a=>SORTS_ALLOWED_IDS.includes(a.topicId)).forEach(b=>{
				(b.recommendationList || []).forEach(c=>{
					th.push({
						type: "GameThumbnail",
						targetId: r.contentMetadata.Game[c.contentId.toString()].rootPlaceId,
						format: "webp",
						size: "384x216"
					})
				})
			});
			loadThumbnails(th).catch(a=>console.error(a))
			setRec(r);
		})();
	}, []);

	if (!rec) {
		return (
			<div className="p-4">
				<Card>
					<CardContent className="p-4">
						<div className="h-[200px] flex items-center justify-center">
							<div className="animate-pulse text-muted-foreground">
								Loading...
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="overflow-scroll no-scrollbar w-screen max-h-screen h-screen">
			{"roblox x next.js when"}
			<br/>
			{"experimental (functional) roblox.com clone"}
			<div className="p-4 space-y-8 no-scrollbar">
				{rec.sorts
					.filter((a) => SORTS_ALLOWED_IDS.includes(a.topicId))
					.map((sort, idx) => (
						<div key={idx}>
							<h1 className="text-2xl">{sort.topic}</h1>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
								{(sort.recommendationList || []).map(
									(recommendation, idxb) => {
										const game =
											rec.contentMetadata.Game[
												recommendation.contentId.toString()
											];
										return <GameCard key={idxb} game={game} />;
									}
								)}
							</div>
						</div>
					))}
			</div>
		</div>
	);
}
