import { VerifiedIcon } from "./RobloxIcons";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function StupidHoverThing({ children, text }: React.PropsWithChildren & { text: string | React.ReactNode }) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				{children}
			</TooltipTrigger>
			<TooltipContent className="bg-surface0 text-text m-2">
				<p className="text-sm flex items-center">{text}</p>
			</TooltipContent>
		</Tooltip>
	)
}
