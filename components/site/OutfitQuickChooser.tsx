"use client";

import { useAvatarOutfits } from "@/hooks/roblox/useAvatarOutfits";
import { Button } from "@/components/ui/button";
import { cn, proxyFetch } from "@/lib/utils";
import LazyLoadedImage from "../util/LazyLoadedImage";
import { StupidHoverThing } from "../util/MiscStuff";
import { loadThumbnails } from "@/lib/thumbnailLoader";
import { useCurrentAccount } from "@/hooks/roblox/useCurrentAccount";

type OutfitSelectorProps = {
	setVisible: (visible: boolean) => void;
	updateOutfit: (outfit: { id: number }, acc: {id: number}) => Promise<void>;
};

export function OutfitSelector({ setVisible, updateOutfit }: OutfitSelectorProps) {
	const outfits = useAvatarOutfits();
	const acc = useCurrentAccount();

	if (!outfits || !acc) return null;

	return (
		<div className="z-30 isolate absolute inset-0 flex items-center justify-center bg-crust/50">
			<button
				className="z-10 absolute w-screen h-screen cursor-default"
				onClick={() => {
					setVisible(false);
				}}
			/>
			<div className="z-20 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-8 bg-crust/90 rounded-xl">
				{(outfits || []).map((outfit: { id: number; name: string }) => (
					<button
						key={outfit.id}
						className="hover:bg-base/50 rounded-lg"
						onClick={async () => {
							updateOutfit(outfit,acc);
							setVisible(false);
						}}
					>
						<StupidHoverThing delayDuration={0} text={outfit.name}>
							<LazyLoadedImage
								imgId={`Outfit_${outfit.id}`}
								alt={outfit.name}
								className="w-32 h-32 rounded-md"
							/>
						</StupidHoverThing>
					</button>
				))}
			</div>
		</div>
	);
}
