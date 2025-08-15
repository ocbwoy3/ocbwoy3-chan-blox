import { Suspense } from "react";
import UserProfileContent from "./content";

// page.tsx (Server Component)
export default async function UserProfilePage({ params }: { params: { id: string } }) {
	return (
		<Suspense fallback={<div className="p-4">Loading profile…</div>}>
			<UserProfileContent userId={(await params).id} />
		</Suspense>
	);
}
