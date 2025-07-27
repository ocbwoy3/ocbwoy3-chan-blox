import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import Image from "next/image";
import { QuickTopUI, QuickTopUILogoPart } from "@/components/site/QuickTopUI";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"]
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"]
});

export const metadata: Metadata = {
	title: "home | ocbwoy3-chan's roblox",
	description: "roblox meets next.js i think"
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
			>
				<TooltipProvider>
					<main>
						<Image
							/* window.localStorage.BgImageUrl */
							src={"/bg.png"}
							width={1920}
							height={1080}
							className="w-screen h-screen bg-blend-hard-light fixed top-0 left-0 blur-lg opacity-25"
							alt=""
						/>
						<div className="z-10 isolate overflow-scroll no-scrollbar w-screen max-h-screen h-screen antialiased overflow-x-hidden">
							<QuickTopUI />
							<QuickTopUILogoPart />
							{children}
						</div>
					</main>
					<Toaster />
				</TooltipProvider>
			</body>
		</html>
	);
}
