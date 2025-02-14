import { useState, useEffect } from 'react';

let gameImages: { [id: string]: string } = {};

export function useThumbnailLazyLoad(img: string) {
	const [status, setStatus] = useState<string | undefined>(undefined);

	useEffect(() => {
		const interval = setInterval(() => {
			if (gameImages[img]) {
				setStatus(gameImages[img]);
				clearInterval(interval);
			}
		}, 100);

		return () => clearInterval(interval);
	}, []);

	return status;
}

export function addThumbnail(id: string, url: string) {
	gameImages[id] = url;
}