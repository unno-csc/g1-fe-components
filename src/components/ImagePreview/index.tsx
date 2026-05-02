import { Empty, Image as AntdImage } from 'antd';
import { CSSProperties, ReactNode, useEffect, useState } from 'react';

export interface IImagePreviewProps {
	src?: string;
	alt?: string;
	minHeight?: number | string;
	className?: string;
	imageClassName?: string;
	emptyText?: ReactNode;
	preview?: boolean;
	previewMask?: ReactNode;
	objectFit?: CSSProperties['objectFit'];
}

export const ImagePreview = ({
	src,
	alt = 'Preview image',
	minHeight = 240,
	className = '',
	imageClassName = '',
	emptyText = 'No data',
	preview = true,
	previewMask = <span className="text-xs">Click para ampliar</span>,
	objectFit = 'contain',
}: IImagePreviewProps) => {
	const [hasError, setHasError] = useState(false);

	useEffect(() => {
		setHasError(false);
	}, [src]);

	const resolvedMinHeight = typeof minHeight === 'number' ? `${minHeight}px` : minHeight;
	const showFallback = !src || hasError;

	return (
		<div
			className={`flex w-full items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-50 ${className}`.trim()}
			style={{ minHeight: resolvedMinHeight }}
		>
			{showFallback ? (
				<div className="flex h-full w-full items-center justify-center p-4">
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={emptyText} />
				</div>
			) : (
				<AntdImage
					alt={alt}
					src={src}
					width="100%"
					className={`cursor-zoom-in object-contain ${imageClassName}`.trim()}
					style={{ width: '100%', minHeight: resolvedMinHeight, objectFit }}
					onError={() => setHasError(true)}
					preview={
						preview
							? {
									movable: true,
									mask: previewMask,
							  }
							: false
					}
				/>
			)}
		</div>
	);
};
