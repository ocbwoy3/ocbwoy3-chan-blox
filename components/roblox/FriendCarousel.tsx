import { useCurrentAccount } from "@/hooks/roblox/useCurrentAccount";
import { useFriendsHome } from "@/hooks/roblox/useFriends";
import { useFriendsPresence } from "@/hooks/roblox/usePresence";
import React, { useEffect, useState } from "react";
import LazyLoadedImage from "../util/LazyLoadedImage";
import { StupidHoverThing } from "../util/MiscStuff";
import { VerifiedIcon } from "./RobloxIcons";

export function FriendCarousel({
	friends: friendsUnsorted,
	title,
	dontSortByActivity,
	...props
}: React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLDivElement>,
	HTMLDivElement
> & {
	title: string;
	dontSortByActivity?: boolean;
	friends:
		| {
				hasVerifiedBadge: boolean;
				id: number;
				name: string;
				displayName: string;
		  }[]
		| null
		| false;
}) {
	const acct = useCurrentAccount();
	const presence = useFriendsPresence(
		(!!friendsUnsorted ? friendsUnsorted : []).map((f) => f.id)
	);

	const [friendsLabel, setFriendsLabel] = useState<string>("");

	const [friends, setFriends] = useState<
		{
			hasVerifiedBadge: boolean;
			id: number;
			name: string;
			displayName: string;
		}[]
	>([]);

	useEffect(() => {
		let numStudio = 0;
		let numGame = 0;
		let numOnline = 0;
		for (const friend of friendsUnsorted || []) {
			const st = presence.find((c) => c.userId === friend.id);
			switch (st?.userPresenceType || 0) {
				case 1:
					numOnline += 1;
					break;
				case 2:
					numGame += 1;
					break;
				case 3:
					numStudio += 1;
					break;
			}
		}
		setFriendsLabel(
			[
				// `${friends.length}`,
				(numOnline+numGame+numStudio === 0 || numOnline === 0) ? null : `${numOnline+numGame+numStudio} online`,
				numGame === 0 ? null : `${numGame} in-game`,

			]
				.filter((a) => !!a)
				.join(" | ")
		);

		if (!friendsUnsorted) {
			setFriends([]);
			return;
		}
		setFriends(
			friendsUnsorted.sort((a, b) => {
				if (!!dontSortByActivity) return -10;
				const userStatusA = presence.find((c) => c.userId === a.id);
				const userStatusB = presence.find((c) => c.userId === b.id);

				return (
					(userStatusB?.userPresenceType || 0) -
					(userStatusA?.userPresenceType || 0)
				);
			})
		);
	}, [friendsUnsorted, presence, dontSortByActivity]);

	if (!friends || friends.length === 0) {
		return <></>;
	}

	return (
		<div {...props}>
			{/* <button onClick={()=>console.log(acct,presence,friends)}>debug</button> */}
			<h1 className="text-2xl pt-4 pl-4 -mb-4">
				{title}{" "}
				<span className="text-overlay1 text-sm pl-2">{friendsLabel}</span>
			</h1>
			<div className="rounded-xl flex flex-col gap-2 px-4 no-scrollbar">
				<div
					className="flex p-8 items-center gap-4 overflow-x-auto overflow-y-visible no-scrollbar pb-2 -mx-4 w-screen scrollbar-thin scrollbar-thumb-surface2 scrollbar-track-surface0"
					style={{
						scrollSnapType: "x mandatory",
						WebkitOverflowScrolling: "touch",
						scrollbarWidth: "none"
					}}
				>
					{/* <div className="w-8" /> */}
					{friends.map((a) => {
						const userStatus = presence.find(
							(b) => b.userId === a.id
						);
						const userPresence = userStatus?.userPresenceType || 0;
						const borderColor =
							userPresence === 1
								? "border-blue/25 bg-blue/25"
								: userPresence === 2
								? "border-green/25 bg-green/25"
								: userPresence === 3
								? "border-yellow/25 bg-yellow/25"
								: userPresence === 0
								? "border-surface2/25 bg-surface2/25"
								: "border-red/25 bg-red/25";
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
							<StupidHoverThing
								key={a.id}
								delayDuration={0}
								text={
									<div className="text-center items-center justify-center content-center">
										<span className="space-x-1 flex items-center">
											<p>{a.displayName || a.name}</p>
											{!a.hasVerifiedBadge ? (
												<VerifiedIcon
													useDefault
													className={`w-4 h-4 shrink-0`}
												/>
											) : null}
											{ userPresence >= 2 ? <p>{userStatus?.lastLocation}</p> : <></>}
										</span>
									</div>
								}
							>
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
										<span className="line-clamp-1 overflow-hidden text-ellipsis">
											{a.displayName || a.name}
										</span>
										{!a.hasVerifiedBadge ? (
											<VerifiedIcon
												className={`text-base ${fillColor} w-3 h-3 shrink-0`}
											/>
										) : null}
									</span>
								</div>
							</StupidHoverThing>
						);
					})}
					{/* <div className="w-8" /> */}
				</div>
			</div>
		</div>
	);
}
