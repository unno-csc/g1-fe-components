import { Carousel } from '@/components/Carousel';
import { Empty } from 'antd';
import { FieldConfig } from '../schema/types';

interface GalleryRendererProps {
	value: unknown;
	data: Record<string, unknown>;
	config: FieldConfig;
}

export const GalleryRenderer = ({ value, config }: GalleryRendererProps) => {
	const galleryConfig = config.galleryConfig || {};
	const {
		aspectRatio = '16/9',
		autoPlay = true,
		autoPlayInterval = 4000,
		imageKey = 'url',
		emptyText = 'No hay imágenes disponibles',
	} = galleryConfig;

	let imageUrls: string[] = [];

	if (!value) {
	} else if (Array.isArray(value)) {
		imageUrls = value.map((item) => {
			if (typeof item === 'string') {
				return item;
			} else if (typeof item === 'object' && item !== null) {
				return (item as Record<string, string>)[imageKey] || '';
			}
			return '';
		}).filter(url => url !== '');
	} else if (typeof value === 'string') {
		imageUrls = [value];
	} else if (typeof value === 'object' && value !== null) {
		const url = (value as Record<string, string>)[imageKey] || '';
		if (url) {
			imageUrls = [url];
		}
	}

	if (imageUrls.length === 0) {
		return (
			<div className="flex items-center justify-center min-h-[200px] py-8">
				<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={emptyText} />
			</div>
		);
	}

	return (
		<div className="flex items-center justify-center">
			<div className="max-w-2xl w-full mx-auto">
				<Carousel.Root autoPlay={autoPlay} autoPlayInterval={autoPlayInterval}>
					<Carousel.Content aspectRatio={aspectRatio}>
						{imageUrls.map((url, index) => (
							<Carousel.Item key={index}>
								<Carousel.Image src={url} alt={`Imagen ${index + 1}`} />
							</Carousel.Item>
						))}
					</Carousel.Content>
					<Carousel.PrevButton />
					<Carousel.NextButton />
					<Carousel.Indicators position="bottom" variant="dots" />
				</Carousel.Root>
			</div>
		</div>
	);
};
