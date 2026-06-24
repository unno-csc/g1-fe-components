import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ImageGallerySection } from '../../components/ImageGallerySection';
import { IGenericLocalImage } from '../../components/UploadImageCompressor';

const MOCK_IMAGES: IGenericLocalImage[] = [
	{
		id: '1',
		previewUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
		label: 'imagen_1.jpg',
		file: new File([''], 'imagen_1.jpg', { type: 'image/jpeg' }),
	},
	{
		id: '2',
		previewUrl: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&w=800&q=80',
		label: 'imagen_2.jpg',
		file: new File([''], 'imagen_2.jpg', { type: 'image/jpeg' }),
	},
];

const ImageGallerySectionStoryWrapper = (args: any) => {
	const [images, setImages] = useState<IGenericLocalImage[]>(args.images || []);

	const handleRemoveImage = (index: number) => {
		setImages((prev) => prev.filter((_, i) => i !== index));
	};

	const handleAddImage = () => {
		setImages((prev) => [
			...prev,
			{
				id: Math.random().toString(),
				previewUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3c87?auto=format&fit=crop&w=800&q=80',
				label: 'nueva_imagen.jpg',
				file: new File([''], 'nueva_imagen.jpg', { type: 'image/jpeg' }),
			},
		]);
	};

	return (
		<div className="w-full max-w-4xl">
			<ImageGallerySection
				{...args}
				images={images}
				onRemoveImage={handleRemoveImage}
				onAddImage={handleAddImage}
			/>
		</div>
	);
};

const meta: Meta<typeof ImageGallerySectionStoryWrapper> = {
	title: 'Components/ImageGallerySection',
	component: ImageGallerySectionStoryWrapper,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component: 'Sección para mostrar una cuadrícula de imágenes seleccionadas con opciones para eliminar y añadir más.',
			},
		},
	},
	argTypes: {
		maxImages: { control: 'number' },
		isLoadingImages: { control: 'boolean' },
		title: { control: 'text' },
		emptyMessage: { control: 'text' },
	},
	args: {
		maxImages: 10,
		isLoadingImages: false,
		title: 'Galería de Imágenes',
		emptyMessage: 'No hay imágenes cargadas todavía.',
	},
};

export default meta;

type Story = StoryObj<typeof ImageGallerySectionStoryWrapper>;

export const Default: Story = {
	name: 'Con Imágenes',
	args: {
		images: MOCK_IMAGES,
	},
};

export const Empty: Story = {
	name: 'Sin Imágenes',
	args: {
		images: [],
	},
};

export const Loading: Story = {
	name: 'Cargando Imágenes',
	args: {
		images: [],
		isLoadingImages: true,
		maxImages: 3,
	},
};
