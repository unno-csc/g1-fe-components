import React, { useEffect, useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ImageCatalog, type IImageCatalogProps, type ImageCatalogSource } from '../../components/ImageCatalog';

const URL_IMAGES = [
	'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
	'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
	'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
];

const createMockImageFile = (name: string, backgroundColor: string, textColor = '#FFFFFF') =>
	new File(
		[
			`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="420" viewBox="0 0 600 420">
				<rect width="600" height="420" fill="${backgroundColor}" rx="32" />
				<text x="300" y="210" text-anchor="middle" dominant-baseline="middle" font-size="42" font-family="Arial, sans-serif" fill="${textColor}">
					${name}
				</text>
			</svg>`,
		],
		`${name.toLowerCase().replace(/\s+/g, '-')}.svg`,
		{ type: 'image/svg+xml' },
	);

const FILE_IMAGES = [
	createMockImageFile('Portada', '#0F766E'),
	createMockImageFile('Producto', '#7C3AED'),
	createMockImageFile('Detalle', '#EA580C'),
];

interface ImageCatalogStoryWrapperProps
	extends Pick<IImageCatalogProps, 'title' | 'emptyMessage' | 'reloadLabel' | 'showReloadButton' | 'showItemFooter'> {
	initialImages: ImageCatalogSource;
}

const ImageCatalogStoryWrapper = ({
	initialImages,
	title = 'Catalogo de imagenes',
	emptyMessage = 'No hay imagenes disponibles',
	reloadLabel = 'Recargar',
	showReloadButton = true,
	showItemFooter = true,
}: ImageCatalogStoryWrapperProps) => {
	const seedImages = useMemo(() => initialImages, [initialImages]);
	const [images, setImages] = useState<ImageCatalogSource>(seedImages);

	useEffect(() => {
		setImages(seedImages);
	}, [seedImages]);

	return (
		<div className="mx-auto max-w-7xl p-6">
			<ImageCatalog
				images={images}
				title={title}
				emptyMessage={emptyMessage}
				reloadLabel={reloadLabel}
				showReloadButton={showReloadButton}
				showItemFooter={showItemFooter}
				onReload={() => setImages(seedImages)}
				onDeleteImage={index => {
					setImages(current => current.filter((_, currentIndex) => currentIndex !== index) as ImageCatalogSource);
				}}
			/>
		</div>
	);
};

const meta: Meta<typeof ImageCatalogStoryWrapper> = {
	title: 'Components/ImageCatalog',
	component: ImageCatalogStoryWrapper,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'Catalogo visual para renderizar imagenes desde `File[]` o `string[]`. Valida que el arreglo no mezcle tipos, permite recargar el listado y eliminar cada preview de forma individual.',
			},
		},
	},
	argTypes: {
		title: { control: 'text' },
		emptyMessage: { control: 'text' },
		reloadLabel: { control: 'text' },
		showReloadButton: { control: 'boolean' },
		showItemFooter: { control: 'boolean' },
		initialImages: { control: false },
	},
	args: {
		title: 'Catalogo de imagenes',
		emptyMessage: 'No hay imagenes disponibles',
		reloadLabel: 'Recargar',
		showReloadButton: true,
		showItemFooter: true,
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WithUrls: Story = {
	name: 'Con URLs',
	args: {
		initialImages: URL_IMAGES,
	},
};

export const WithFiles: Story = {
	name: 'Con archivos File[]',
	args: {
		initialImages: FILE_IMAGES,
	},
};

export const EmptyState: Story = {
	name: 'Vacio',
	args: {
		initialImages: [],
	},
};

export const WithoutItemFooter: Story = {
	name: 'Sin pie de item',
	args: {
		initialImages: URL_IMAGES,
		showItemFooter: false,
	},
};

export const InvalidMixedValues: Story = {
	name: 'Invalido mezclando tipos',
	render: args => (
		<div className="mx-auto max-w-7xl p-6">
			<ImageCatalog
				{...args}
				images={[URL_IMAGES[0], FILE_IMAGES[0]] as unknown as ImageCatalogSource}
				title="Catalogo invalido"
			/>
		</div>
	),
};
