import { PremiumIconSmall, VerifiedIcon } from "./RobloxIcons";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from "../ui/tooltip";

export function RobloxPremiumSmall(props: React.SVGProps<SVGSVGElement>) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<PremiumIconSmall {...props} />
			</TooltipTrigger>
			<TooltipContent className="bg-surface0 text-text m-2">
				<p className="text-sm">Roblox Premium</p>
			</TooltipContent>
		</Tooltip>
	);
}

export function RobloxVerifiedSmall(
	props: React.SVGProps<SVGSVGElement> & { useDefault?: boolean }
) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<VerifiedIcon {...props} />
			</TooltipTrigger>
			<TooltipContent className="bg-surface0 text-text m-2">
				<p className="text-sm">Verified</p>
			</TooltipContent>
		</Tooltip>
	);
}
