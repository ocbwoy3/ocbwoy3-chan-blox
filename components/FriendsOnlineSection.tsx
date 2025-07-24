import { useCurrentAccount } from "@/hooks/roblox/useCurrentAccount";
import { useFriendsHome } from "@/hooks/roblox/useFriendsHome";
import LazyLoadedImage from "./lazyLoadedImage";
import React from "react";
import { VerifiedIcon } from "./RobloxIcons";
import { useFriendsPresence } from "@/hooks/roblox/usePresence";
import { StupidHoverThing } from "./MiscStuff";

export function FriendsHomeSect(
	props: React.DetailedHTMLProps<
		React.HTMLAttributes<HTMLDivElement>,
		HTMLDivElement
	>
) {
	const friends = useFriendsHome();
	const acct = useCurrentAccount();
	const presence = useFriendsPresence(
		(!!friends ? friends : []).map((f) => f.id)
	);

	if (!friends) {
		return <></>;
	}

	return (
		<div {...props}>
			{/* <button onClick={()=>console.log(acct,presence,friends)}>debug</button> */}
			<h1 className="text-2xl pb-2 pl-4">Friends</h1>
			<div className="bg-base p-4 rounded-xl flex flex-col gap-2 px-4 no-scrollbar">
				<div
					className="flex items-center gap-4 overflow-x-auto overflow-y-visible no-scrollbar pb-2 -mx-4 w-screen scrollbar-thin scrollbar-thumb-surface2 scrollbar-track-surface0"
					style={{
						scrollSnapType: "x mandatory",
						WebkitOverflowScrolling: "touch",
						scrollbarWidth: "none"
					}}
				>
					<div className="w-8" />
					{friends.map((a) => {
						const userStatus = presence.find(
							(b) => b.userId === a.id
						);
						const userPresence = userStatus?.userPresenceType || 0;
						const borderColor =
							userPresence === 1
								? "border-blue bg-blue/50"
								: userPresence === 2
								? "border-green bg-green/50"
								: userPresence === 3
								? "border-yellow bg-yellow/50"
								: userPresence === 0
								? "border-surface2 bg-surface2/50"
								: "border-red bg-red/50";
						const textColor =
							userPresence === 1
								? "text-blue"
								: userPresence === 2
								? "text-green"
								: userPresence === 3
								? "text-yellow"
								: userPresence === 0
								? "text-surface2"
								: "text-red";
						const fillColor =
							userPresence === 1
								? "fill-blue"
								: userPresence === 2
								? "fill-green"
								: userPresence === 3
								? "fill-yellow"
								: userPresence === 0
								? "fill-surface2"
								: "fill-red";

						return (
							<div
								key={a.id}
								className="flex flex-col min-w-[6.5rem]"
							>
								<LazyLoadedImage
									imgId={`AvatarHeadShot_${a.id}`}
									alt={a.name}
									className={`w-24 h-24 rounded-full border-2 ${borderColor} object-cover shadow-xl`}
								/>
								<span
									className={`text-xs ${textColor} mt-1 text-center flex items-center justify-center gap-1 max-w-[6.5rem] overflow-hidden line-clamp-2`}
								>
									<StupidHoverThing
										text={
											<span className="space-x-1 flex items-center">
												<p>{a.displayName || a.name}</p>
												{!a.hasVerifiedBadge ? (
													<VerifiedIcon
														useDefault
														className={`w-4 h-4 shrink-0`}
													/>
												) : null}
											</span>
										}
									>
										<span className="line-clamp-1 overflow-hidden text-ellipsis">
											{a.displayName || a.name}
										</span>
									</StupidHoverThing>
									{!a.hasVerifiedBadge ? (
										<VerifiedIcon
											className={`text-base ${fillColor} w-3 h-3 shrink-0`}
										/>
									) : null}
								</span>
							</div>
						);
					})}
					<div className="w-8" />
				</div>
			</div>
		</div>
	);
}
