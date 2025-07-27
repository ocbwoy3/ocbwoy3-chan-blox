import type { NextConfig } from "next";

if (!process.isBun) {
	console.error(`You are running this with node. Rerun the process: bun --bun run dev`)
	process.exit(1)
}

process.env.NEXT_PUBLIC_CWD = __dirname || "~"
process.env.NEXT_PUBLIC_ARGV0 = process.argv0 || "node"


const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**"
			},
			{
				protocol: "http",
				hostname: "**"
			}
		]
	}
};

export default nextConfig;
