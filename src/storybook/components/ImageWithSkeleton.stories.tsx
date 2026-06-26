import type { Meta, StoryObj } from '@storybook/react';
import { ImageWithSkeleton } from '../../components/ImageWithSkeleton';

const meta: Meta<typeof ImageWithSkeleton> = {
	title: 'Components/ImageWithSkeleton',
	component: ImageWithSkeleton,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: 'Componente que muestra una imagen de Ant Design con un Skeleton como placeholder mientras carga o cuando no hay URL.',
			},
		},
	},
	argTypes: {
		src: { control: 'text' },
		alt: { control: 'text' },
		width: { control: 'text' },
		height: { control: 'text' },
		index: { control: 'number' },
	},
};

export default meta;

type Story = StoryObj<typeof ImageWithSkeleton>;

export const Default: Story = {
	name: 'Con Imagen',
	args: {
		src: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
		alt: 'Motocicleta de prueba',
		width: '220px',
		height: '124px',
		index: 0,
	},
};

export const WithoutImage: Story = {
	name: 'Sin Imagen (Skeleton activo)',
	args: {
		src: '',
		alt: 'Sin imagen',
		width: '220px',
		height: '124px',
		index: 0,
	},
};
