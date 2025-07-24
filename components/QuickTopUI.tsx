"use client";

import { useRobuxBalance } from "@/hooks/roblox/useRobuxBalance";
import { RobuxIcon } from "./RobloxIcons";

export function QuickTopUI() {
	const robux = useRobuxBalance();
	return (
		<span className="z-50 absolute top-4 right-4 p-4 flex gap-4 items-center">
			<img src="/icon-128.webp" className="-m-1 w-8 h-8" alt="" />
			<span className="rounded-full bg-crust/50 flex items-center p-2">
				<span className="px-2 font-sans text-blue text-xl flex items-center">
					<RobuxIcon className="w-6 h-6" />
					<p className="pl-1">{robux}</p>
				</span>
			</span>
		</span>
	);
}
