import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { Empty } from 'antd';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { ImagePreview } from '../ImagePreview';
import { Button } from '../Button';

export type ImageCatalogSource = File[] | string[];
export type ImageCatalogItemValue = File | string;

type ImageCatalogValidation =
	| { status: 'empty' }
	| { status: 'invalid'; message: string }
	| { status: 'valid'; kind: 'file'; items: File[] }
	| { status: 'valid'; kind: 'url'; items: string[] };

export interface IImageCatalogProps {
	images?: ImageCatalogSource;
	title?: ReactNode;
	className?: string;
	emptyMessage?: ReactNode;
	invalidMessage?: ReactNode;
	reloadLabel?: ReactNode;
	showHeader?: boolean;
	showReloadButton?: boolean;
	showItemFooter?: boolean;
	minPreviewHeight?: number | string;
	onReload?: () => void;
	onDeleteImage?: (index: number, image: ImageCatalogItemValue) => void;
}

const getActionButtonClassName = (disabled?: boolean) => {
	const className = [
		'itsa-btn',
		'itsa-btn--md',
		'itsa-btn--secondary',
		'border',
		'appearance-none',
		'px-4',
		'py-2',
		'shadow-none',
		'outline-none',
		'focus:outline-none',
		'focus:shadow-none',
	]
		.filter(Boolean)
		.join(' ');

	return disabled ? [className, 'itsa-btn--disabled', 'rounded-[12px]'].join(' ') : className;
};

const getUrlLabel = (url: string, index: number) => {
	const normalizedUrl = url.trim();
	if (!normalizedUrl) return `Imagen ${index + 1}`;

	const sanitizedUrl = ((normalizedUrl.split('?')[0] ?? '').split('#')[0] ?? '').trim();
	const lastSegment = sanitizedUrl.split('/').filter(Boolean).pop();

	if (!lastSegment) return `Imagen ${index + 1}`;

	try {
		return decodeURIComponent(lastSegment);
	} catch {
		return lastSegment;
	}
};

const formatBytes = (bytes = 0) => {
	if (!bytes) return '0 B';

	const units = ['B', 'KB', 'MB', 'GB'];
	const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
	const value = bytes / 1024 ** unitIndex;

	return `${value >= 10 || unitIndex === 0 ? value.toFixed(0) : value.toFixed(2)} ${units[unitIndex]}`;
};

const validateImages = (images?: ImageCatalogSource): ImageCatalogValidation => {
	if (!images || images.length === 0) {
		return { status: 'empty' };
	}

	const hasFiles = images.some(item => item instanceof File);
	const hasStrings = images.some(item => typeof item === 'string');

	if (hasFiles && hasStrings) {
		return {
			status: 'invalid',
			message: 'El arreglo debe contener solo File[] o solo string[] de URLs, no ambos tipos mezclados.',
		};
	}

	if (hasFiles) {
		const allAreImageFiles = images.every(item => item instanceof File && item.type.startsWith('image/'));
		if (!allAreImageFiles) {
			return {
				status: 'invalid',
				message: 'Todos los elementos deben ser archivos de imagen validos cuando se usa File[].',
			};
		}

		return {
			status: 'valid',
			kind: 'file',
			items: images as File[],
		};
	}

	if (hasStrings) {
		const allAreValidUrls = images.every(item => typeof item === 'string' && item.trim().length > 0);
		if (!allAreValidUrls) {
			return {
				status: 'invalid',
				message: 'Todos los elementos deben ser strings con una URL o ruta de imagen valida.',
			};
		}

		return {
			status: 'valid',
			kind: 'url',
			items: (images as string[]).map(item => item.trim()),
		};
	}

	return {
		status: 'invalid',
		message: 'El catalogo solo acepta un arreglo de File[] o string[] de imagenes.',
	};
};

export const ImageCatalog = ({
	images = [],
	title = 'Catalogo de imagenes',
	className = '',
	emptyMessage = 'No hay imagenes disponibles',
	invalidMessage,
	reloadLabel = 'Recargar',
	showHeader = true,
	showReloadButton = true,
	showItemFooter = true,
	minPreviewHeight = 'clamp(160px, 20vw, 260px)',
	onReload,
	onDeleteImage,
}: IImageCatalogProps) => {
	const validation = useMemo(() => validateImages(images), [images]);
	const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([]);

	useEffect(() => {
		if (validation.status !== 'valid' || validation.kind !== 'file') {
			setFilePreviewUrls([]);
			return;
		}

		const nextUrls = validation.items.map(file => URL.createObjectURL(file));
		setFilePreviewUrls(nextUrls);

		return () => {
			nextUrls.forEach(url => URL.revokeObjectURL(url));
		};
	}, [validation]);

	const items = useMemo(() => {
		if (validation.status !== 'valid') return [];

		if (validation.kind === 'file') {
			return validation.items.map((file, index) => ({
				src: filePreviewUrls[index],
				label: file.name,
				description: `${formatBytes(file.size)}${file.type ? ` • ${file.type}` : ''}`,
				value: file as ImageCatalogItemValue,
			}));
		}

		return validation.items.map((url, index) => ({
			src: url,
			label: getUrlLabel(url, index),
			description: 'URL de imagen',
			value: url as ImageCatalogItemValue,
		}));
	}, [filePreviewUrls, validation]);

	const helperText =
		validation.status === 'valid'
			? `${items.length} ${items.length === 1 ? 'imagen cargada' : 'imagenes cargadas'}`
			: 'Acepta un solo tipo de origen por catalogo';

	return (
		<div className={`flex w-full flex-col gap-2 ${className}`.trim()}>
			{showHeader && (
				<div className="flex flex-wrap items-start justify-between gap-2">
					<div className="space-y-1">
						<h3 className="text-[18px] font-semibold leading-7 text-gray-800">{title}</h3>
						<p className="text-sm text-gray-500">{helperText}</p>
					</div>

					{showReloadButton && onReload && (
						<button type="button" onClick={onReload} className={getActionButtonClassName(false)}>
							<span className="flex items-center gap-2">
								<ReloadOutlined />
								<span>{reloadLabel}</span>
							</span>
						</button>
					)}
				</div>
			)}

			{validation.status === 'invalid' ? (
				<div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
					{invalidMessage ?? validation.message}
				</div>
			) : null}

			{validation.status === 'empty' ? (
				<div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10">
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={emptyMessage} />
				</div>
			) : null}

			{validation.status === 'valid' ? (
				<div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{items.map((item, index) => (
						<div
							key={`${item.label}-${index}`}
							className="box-border w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm"
						>
							<div className="relative w-full min-w-0 max-w-full overflow-hidden rounded-xl">
								<ImagePreview
									src={item.src}
									alt={`Imagen ${index + 1}`}
									minHeight={minPreviewHeight}
									className="w-full border-0 bg-gray-50"
									imageClassName="!h-auto !w-full max-h-[clamp(180px,22vw,340px)] object-contain"
								/>

								{onDeleteImage && (
									<div className="absolute right-3 top-3">
										<Button
											type="secondary"
											size="small"
											label={<DeleteOutlined />}
											onClick={() => onDeleteImage(index, item.value)}
										/>
									</div>
								)}
							</div>

							{showItemFooter && (
								<div className="mt-3 min-w-0 space-y-1">
									<p className="truncate text-sm font-medium text-gray-800">{item.label}</p>
									<p className="truncate text-xs text-gray-500">{item.description}</p>
								</div>
							)}
						</div>
					))}
				</div>
			) : null}
		</div>
	);
};
