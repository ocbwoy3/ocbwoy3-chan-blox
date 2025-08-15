"use client";

import { ContentMetadata } from "@/lib/omniRecommendation";
import LazyLoadedImage from "../util/LazyLoadedImage";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuSeparator,
	ContextMenuTrigger
} from "../ui/context-menu";
import { ContextMenuItem } from "@radix-ui/react-context-menu";
import React from "react";

interface GameCardProps {
	game: ContentMetadata;
}

export const GameCard = React.memo(function GameCard({ game }: GameCardProps) {
	return (
		<ContextMenu>
			<ContextMenuTrigger>
				<div className="overflow-hidden aspect-video relative bg-muted rounded-2xl">
					<div className="overflow-hidden">
						{game.primaryMediaAsset ? (
							<LazyLoadedImage
								imgId={
									"GameThumbnail_" +
									game.rootPlaceId.toString()
								}
								alt={game.name}
								className="object-fill w-full h-full"
								lazyFetch={false} // ALWAYS fetch immediately
								size="384x216" // match game thumbnail size
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center bg-muted">
								<span className="text-muted-foreground">
									{":("}
								</span>
							</div>
						)}
					</div>
					<div className="text-blue bg-base font-mono flex right-2 bottom-2 absolute rounded-lg px-2 py-1">
						{game.playerCount.toLocaleString()}
					</div>
				</div>
			</ContextMenuTrigger>
			<ContextMenuContent className="max-w-[512px] p-2 space-y-1">
				<ContextMenuItem
					disabled
					className="text-s font-bold text-muted-foreground"
				>
					{game.name}
				</ContextMenuItem>
				<ContextMenuItem
					disabled
					className="text-xs text-subtext0 text-muted-foreground"
				>
					{Math.round(
						(game.totalUpVotes /
							(game.totalUpVotes + game.totalDownVotes)) *
							100
					)}
					% rating - {game.playerCount.toLocaleString()} playing
				</ContextMenuItem>
				<ContextMenuItem
					disabled
					className="pb-1 text-xs text-subtext0 text-muted-foreground"
				>
					{game.ageRecommendationDisplayName || ""}
				</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuItem>
					<a href={`https://roblox.com/games/${game.rootPlaceId}`}>
						Open URL
					</a>
				</ContextMenuItem>
				<ContextMenuItem
					onClick={() => {
						window.location.href = `roblox://placeId=${game.rootPlaceId}`;
					}}
				>
					Play
				</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuItem
					onClick={() => {
						navigator.clipboard.writeText(`${game.rootPlaceId}`);
					}}
				>
					Copy rootPlaceId
				</ContextMenuItem>
				<ContextMenuItem
					onClick={() => {
						navigator.clipboard.writeText(`${game.universeId}`);
					}}
				>
					Copy universeId
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
});
