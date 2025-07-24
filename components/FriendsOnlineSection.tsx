import { useCurrentAccount } from "@/hooks/roblox/useCurrentAccount";
import { useFriendsHome } from "@/hooks/roblox/useFriendsHome";
import LazyLoadedImage from "./lazyLoadedImage";
import React from "react";
import { VerifiedIcon } from "./RobloxIcons";

export function FriendsHomeSect(
	props: React.DetailedHTMLProps<
		React.HTMLAttributes<HTMLDivElement>,
		HTMLDivElement
	>
) {
	const friends = useFriendsHome();
	const acct = useCurrentAccount();

	if (!friends) {
		return <></>;
	}

	return (
		<div {...props}>
			<h1 className="text-2xl pb-2 pl-4">Friends</h1>
			<div className="bg-base p-4 rounded-xl flex flex-col gap-2 px-4">
				<div
					className="flex items-center gap-4 overflow-x-auto pb-2 -mx-4 w-screen scrollbar-thin scrollbar-thumb-surface2 scrollbar-track-surface0"
					style={{
						scrollSnapType: "x mandatory",
						WebkitOverflowScrolling: "touch"
					}}
				>
					<div className="w-8" />
					{friends.map((a) => (
						<div
							key={a.id}
							className="flex flex-col items-center min-w-[6.5rem]"
							// style={{ scrollSnapAlign: "start" }}
						>
							<LazyLoadedImage
								imgId={`AvatarHeadShot_${a.id}`}
								alt={a.name}
								className="w-24 h-24 rounded-full border-2 border-surface2 object-cover shadow"
							/>
							<span className="truncate text-xs text-text mt-1 text-center flex items-center justify-center gap-1">
								{a.displayName || a.name}
								{a.hasVerifiedBadge ? null : (
									<VerifiedIcon className="text-base fill-blue w-3 h-3" />
								)}
							</span>
						</div>
					))}
					<div className="w-8" />
				</div>
			</div>
		</div>
	);
}
