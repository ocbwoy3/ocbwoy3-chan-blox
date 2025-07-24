import { useFriendsHome } from "@/hooks/roblox/useFriends";
import React from "react";
import { FriendCarousel } from "./FriendCarousel";
import { useBestFriends } from "@/hooks/roblox/useBestFriends";

export function FriendsHomeSect(
	props: React.DetailedHTMLProps<
		React.HTMLAttributes<HTMLDivElement>,
		HTMLDivElement
	>
) {
	const friends = useFriendsHome();

	return <FriendCarousel {...props} title="Friends" friends={friends} />;
}

export function BestFriendsHomeSect(
	props: React.DetailedHTMLProps<
		React.HTMLAttributes<HTMLDivElement>,
		HTMLDivElement
	>
) {
	const friends = useBestFriends();

	return <FriendCarousel {...props} title="Best Friends" dontSortByActivity friends={friends} />;
}
