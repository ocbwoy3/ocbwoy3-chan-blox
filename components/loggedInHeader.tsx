import {
	getLoggedInUser,
	getUserByUserId,
	UserProfileDetails,
} from "@/lib/profile";
import { useEffect, useState } from "react";

export function HomeLoggedInHeader() {
	const [profileDetails, setProfileDetails] =
		useState<UserProfileDetails | null>(null);

	useEffect(() => {
		(async () => {
			const authed = await getLoggedInUser();
			setProfileDetails(await getUserByUserId(authed.id.toString()));
		})();
	}, []);

	if (!profileDetails) {
		return (<></>)
	}

	return (
		<div>
			<span className="text-xl">Hello, {profileDetails.displayName}</span>
			<span className="text-muted-foreground text-sm text-blue">{"@"}{profileDetails.name}</span>
			<br/>
			{profileDetails.id}
		</div>
	);
}
