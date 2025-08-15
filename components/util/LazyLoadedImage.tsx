"use client";

import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getThumbnails, ThumbnailRequest } from "@/lib/thumbnailLoader";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";

interface LazyLoadedImageProps {
	imgId: string;
	alt: string;
	width?: number;
	height?: number;
	className?: string;
	lazyFetch?: boolean; // true for avatars, false for game thumbnails
	size?: string; // optional fetch size
}

const LazyLoadedImage: React.FC<LazyLoadedImageProps> = ({
	imgId,
	alt,
	width = 1024,
	height = 1024,
	className,
	lazyFetch = true,
	size = "48x48",
	...props
}) => {
	const [isVisible, setIsVisible] = useState(!lazyFetch);
	const ref = useRef<HTMLDivElement>(null);

	const [type, targetIdStr] = imgId.split("_");
	const targetId = Number(targetIdStr);

	// React Query to fetch thumbnail when visible or immediately if lazyFetch=false
	const { data: thumbnails, isLoading } = useQuery({
		queryKey: ["thumbnails", targetId, size],
		queryFn: async () => {
			const result = await getThumbnails([
				{ type: type as any, targetId, format: "webp", size }
			]);
			return result;
		},
		enabled: isVisible,
		staleTime: 60_000 * 60 * 60 // 1 hour
	});

	const imgUrl = thumbnails?.[0]?.imageUrl;

	// IntersectionObserver only used if lazyFetch=true
	useEffect(() => {
		if (!lazyFetch || !ref.current) return;

		const observer = new IntersectionObserver(
			([entry]) => setIsVisible(entry.isIntersecting),
			{ rootMargin: "200px" }
		);

		observer.observe(ref.current);
		return () => observer.disconnect();
	}, [lazyFetch]);

	return (
		<div ref={ref}>
			{imgUrl && !isLoading ? (
				<Image
					src={imgUrl as any}
					width={width}
					height={height}
					alt={alt}
					className={className}
					{...props}
				/>
			) : (
				<Skeleton className={className} />
			)}
		</div>
	);
};

export default LazyLoadedImage;
