import React from "react";

export const PremiumIconSmall = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		viewBox="0 0 16 16"
		{...props}
	>
		<defs>
			<clipPath id="clip-path">
				<path d="M14,14V2H2V16a2,2,0,0,1-2-2V2A2,2,0,0,1,2,0H14a2,2,0,0,1,2,2V14a2,2,0,0,1-2,2H8V14ZM12,6v6H8V10h2V6H6V16H4V4h8Z" />
			</clipPath>
		</defs>
		<title>premium_small</title>
		<g id="premium">
			<g clipPath="url(#clip-path)">
				<rect
					x="-5"
					y="-5"
					width="26"
					height="26"
					fill="currentColor"
				/>
			</g>
		</g>
	</svg>
);

export const VerifiedIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="28"
		height="28"
		viewBox="0 0 28 28"
		fill="none"
		{...props}
	>
		<g clipPath="url(#clip0_8_46)">
			<rect
				x="5.88818"
				width="22.89"
				height="22.89"
				transform="rotate(15 5.88818 0)"
				fill="currentFill" /* #0066FF */
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M20.543 8.7508L20.549 8.7568C21.15 9.3578 21.15 10.3318 20.549 10.9328L11.817 19.6648L7.45 15.2968C6.85 14.6958 6.85 13.7218 7.45 13.1218L7.457 13.1148C8.058 12.5138 9.031 12.5138 9.633 13.1148L11.817 15.2998L18.367 8.7508C18.968 8.1498 19.942 8.1498 20.543 8.7508Z"
				fill="currentColor"  /* white */
			/>
		</g>
		<defs>
			<clipPath id="clip0_8_46">
				<rect width="28" height="28" fill="white" />
			</clipPath>
		</defs>
	</svg>
);
