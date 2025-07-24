import React from "react";
import { useThumbnailURL } from "@/hooks/use-lazy-load";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";

interface LazyLoadedImageProps {
	imgId: string;
	alt: string;
	[prop: string]: string;
}

const LazyLoadedImage: React.FC<LazyLoadedImageProps> = ({
	imgId,
	alt,
	...props
}) => {
	const imgUrl = useThumbnailURL(imgId);

	return (
		<div>
			{imgUrl ? (
				<Image
					src={imgUrl as any}
					width={1024}
					height={1024}
					alt={alt}
					{...props}
				/>
			) : (
				<Skeleton {...props} />
			)}
		</div>
	);
};

export default LazyLoadedImage;
