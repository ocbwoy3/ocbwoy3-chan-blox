"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { getUserByUserId } from "@/lib/profile";
import { UserProfileHeader } from "@/components/roblox/UserProfileHeader";

interface UserProfileContentProps {
	userId: string;
}

export default function UserProfileContent({
	userId
}: UserProfileContentProps) {
	const { data: profile, isLoading } = useQuery({
		queryKey: ["user-profile", userId],
		queryFn: () => getUserByUserId(userId),
		enabled: !!userId
	});

	// Set dynamic document title
	useEffect(() => {
		if (profile?.displayName) {
			document.title = `${profile.displayName}'s profile | ocbwoy3-chan's roblox`;
		}
	}, [profile]);

	if (isLoading) return <div className="p-4">Loading user profile...</div>;
	if (!profile) notFound();

	return (
		<div className="p-4 space-y-6">
			<UserProfileHeader user={profile} />
			<Separator />
			<div className="break-all whitespace-normal">
				{profile.description}
			</div>
		</div>
	);
}
