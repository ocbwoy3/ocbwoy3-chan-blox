import { useThumbnailLazyLoad } from "@/hooks/use-lazy-load";
import { ContentMetadata } from "@/lib/omniRecommendation";
import LazyLoadedImage from "./lazyLoadedImage";
import { ContextMenu, ContextMenuContent, ContextMenuSeparator, ContextMenuTrigger } from "./ui/context-menu";
import { ContextMenuItem } from "@radix-ui/react-context-menu";

interface GameCardProps {
	game: ContentMetadata;
}

export function GameCard({ game }: GameCardProps) {
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
								<span className="text-muted-foreground">No image</span>
							</div>
						)}
					</div>
					<div className="bg-muted-foreground flex right-2 bottom-2 absolute rounded-lg p-1 py-0">
						{game.playerCount.toLocaleString()}
					</div>
				</div>
			</ContextMenuTrigger>
			<ContextMenuContent className="w-64">
				<ContextMenuItem disabled className="text-xs text-muted-foreground">
					{game.name}
				</ContextMenuItem>
				<ContextMenuItem disabled className="text-xs text-muted-foreground">
					{Math.round((game.totalUpVotes/(game.totalUpVotes+game.totalDownVotes))*100)}% rating - {game.playerCount} players
				</ContextMenuItem>
				<ContextMenuSeparator/>
				<ContextMenuItem onClick={()=>{window.location.href = (`https://roblox.com/games/${game.rootPlaceId}`)}}>
					Open
				</ContextMenuItem>
				<ContextMenuItem onClick={()=>{window.location.href = (`roblox://placeId=${game.rootPlaceId}`)}}>
					Play
				</ContextMenuItem>
				<ContextMenuSeparator/>
				<ContextMenuItem onClick={()=>{navigator.clipboard.writeText(`https://roblox.com/games/${game.rootPlaceId}`)}}>
					copy game url
				</ContextMenuItem>
				<ContextMenuItem onClick={()=>{navigator.clipboard.writeText(`${game.rootPlaceId}`)}}>
					copy game id
				</ContextMenuItem>
				<ContextMenuItem onClick={()=>{navigator.clipboard.writeText(`${game.universeId}`)}}>
					copy universe id
				</ContextMenuItem>
				<ContextMenuItem onClick={()=>{navigator.clipboard.writeText(`roblox://placeId=${game.rootPlaceId}`)}}>
					copy roblox:// uri
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
