import { TooltipProps } from "@radix-ui/react-tooltip";
import { VerifiedIcon } from "../roblox/RobloxIcons";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function StupidHoverThing({ children, text, ...props }: React.PropsWithChildren & TooltipProps & { text: string | React.ReactNode }) {
	return (
		<Tooltip {...props}>
			<TooltipTrigger asChild>
				{children}
			</TooltipTrigger>
			<TooltipContent className="bg-surface0 text-text m-2">
				<span className="text-sm flex items-center">{text}</span>
			</TooltipContent>
		</Tooltip>
	)
}
