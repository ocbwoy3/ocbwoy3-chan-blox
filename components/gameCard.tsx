"use client";

import { ContentMetadata } from "@/lib/omniRecommendation";
import LazyLoadedImage from "./lazyLoadedImage";
import { ContextMenu, ContextMenuContent, ContextMenuSeparator, ContextMenuTrigger } from "./ui/context-menu";
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
								imgId={'GameThumbnail_'+game.rootPlaceId.toString()}
								alt={game.name}
								className="object-cover w-full h-full"
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center bg-muted">
								<span className="text-muted-foreground">{":("}</span>
							</div>
						)}
					</div>
					<div className="bg-base flex right-2 bottom-2 absolute rounded-lg p-1 py-0">
						{game.playerCount.toLocaleString()}
					</div>
				</div>
			</ContextMenuTrigger>
			<ContextMenuContent className="w-64 p-2 space-y-1">
				<ContextMenuItem disabled className="text-xs text-muted-foreground">
					{game.name}
				</ContextMenuItem>
				<ContextMenuItem disabled className="text-xs text-muted-foreground">
					{Math.round((game.totalUpVotes/(game.totalUpVotes+game.totalDownVotes))*100)}% rating - {game.playerCount.toLocaleString()} playing
				</ContextMenuItem>
				<ContextMenuSeparator/>
				<ContextMenuItem>
					<a href={`https://roblox.com/games/${game.rootPlaceId}`}>Open URL</a>
				</ContextMenuItem>
				<ContextMenuItem onClick={()=>{window.location.href = (`roblox://placeId=${game.rootPlaceId}`)}}>
					Play
				</ContextMenuItem>
				<ContextMenuSeparator/>
				<ContextMenuItem onClick={()=>{navigator.clipboard.writeText(`${game.rootPlaceId}`)}}>
					Copy rootPlaceId
				</ContextMenuItem>
				<ContextMenuItem onClick={()=>{navigator.clipboard.writeText(`${game.universeId}`)}}>
					Copy universeId
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
});
