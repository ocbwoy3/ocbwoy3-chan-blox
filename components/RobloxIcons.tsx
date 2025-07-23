import React from 'react';

const PremiumIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 16 16"
    {...props}
  >
    <defs>
      <clipPath id="clip-path">
        <path
          d="M14,14V2H2V16a2,2,0,0,1-2-2V2A2,2,0,0,1,2,0H14a2,2,0,0,1,2,2V14a2,2,0,0,1-2,2H8V14ZM12,6v6H8V10h2V6H6V16H4V4h8Z"
        />
      </clipPath>
    </defs>
    <title>premium_small</title>
    <g id="premium">
      <g clipPath="url(#clip-path)">
        <rect x="-5" y="-5" width="26" height="26" fill="currentColor" />
      </g>
    </g>
  </svg>
);

export default PremiumIcon;