import React from 'react';
import { useThumbnailLazyLoad } from '@/hooks/use-lazy-load';

interface LazyLoadedImageProps {
	imgId: string;
	alt: string;
	[prop: string]: string
}

const LazyLoadedImage: React.FC<LazyLoadedImageProps> = ({ imgId, alt, ...props }: LazyLoadedImageProps) => {
	const imgUrl = useThumbnailLazyLoad(imgId);

	return (
		<div>
			{imgUrl ? (
				<img src={imgUrl} alt={alt} {...props} />
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
};

export default LazyLoadedImage;