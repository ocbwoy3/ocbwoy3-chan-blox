import React from 'react';
import { useThumbnailURL } from '@/hooks/use-lazy-load';
import { Skeleton } from './ui/skeleton';

interface LazyLoadedImageProps {
	imgId: string;
	alt: string;
	[prop: string]: string
}

const LazyLoadedImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement> & LazyLoadedImageProps> = ({
	imgId,
	alt,
	...props
}) => {
	const imgUrl = useThumbnailURL(imgId);

	return (
		<div>
			{imgUrl ? (
				<img src={imgUrl} alt={alt} {...props} />
			) : (
				<Skeleton {...props} />
			)}
		</div>
	);
};

export default LazyLoadedImage;