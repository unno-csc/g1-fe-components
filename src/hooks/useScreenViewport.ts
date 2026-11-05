import { useEffect, useState } from 'react';

const getViewportSize = () => ({
	width: typeof window === 'undefined' ? 0 : window.visualViewport?.width ?? window.innerWidth,
	height: typeof window === 'undefined' ? 0 : window.visualViewport?.height ?? window.innerHeight,
});

export const useScreenViewport = () => {
	const [viewport, setViewport] = useState(getViewportSize);

	useEffect(() => {
		let animationFrame: number | undefined;

		const updateViewport = () => {
			if (animationFrame !== undefined) {
				window.cancelAnimationFrame(animationFrame);
			}

			animationFrame = window.requestAnimationFrame(() => {
				setViewport(getViewportSize());
			});
		};

		updateViewport();
		window.addEventListener('resize', updateViewport);
		window.visualViewport?.addEventListener('resize', updateViewport);

		return () => {
			if (animationFrame !== undefined) {
				window.cancelAnimationFrame(animationFrame);
			}
			window.removeEventListener('resize', updateViewport);
			window.visualViewport?.removeEventListener('resize', updateViewport);
		};
	}, []);

	return viewport;
};

