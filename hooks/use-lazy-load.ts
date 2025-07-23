import { useState, useEffect } from 'react';

// Shared cache and listeners
const gameImages: { [id: string]: string } = {};
const listeners: { [id: string]: Set<(url: string) => void> } = {};

export function useThumbnailURL(img: string) {
	const [status, setStatus] = useState<string | undefined>(gameImages[img]);

	useEffect(() => {
		if (!listeners[img]) listeners[img] = new Set();
		const update = (url: string) => setStatus(url);
		listeners[img].add(update);

		// If the image is already available, set it immediately
		if (gameImages[img]) setStatus(gameImages[img]);

		return () => {
			listeners[img].delete(update);
			if (listeners[img].size === 0) delete listeners[img];
		};
	}, [img]);

	return status;
}

export function addThumbnail(id: string, url: string) {
	gameImages[id] = url;
	if (listeners[id]) {
		listeners[id].forEach(cb => cb(url));
	}
}