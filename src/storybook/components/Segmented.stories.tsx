import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Segmented } from '../../components/Segmented/Segmented';

const meta: Meta<typeof Segmented> = {
	title: 'Components/Segmented',
	component: Segmented,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: 'Componente Segmented basado en Ant Design con estilos ITSA para filtros rápidos.',
			},
		},
	},
	argTypes: {
		value: {
			control: { type: 'text' },
			description: 'Valor seleccionado',
		},
		disabled: {
			control: { type: 'boolean' },
			description: 'Deshabilitar control',
		},
		size: {
			control: { type: 'select' },
			options: ['small', 'middle', 'large'],
			description: 'Tamaño del segmented',
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SaleTypeFilter: Story = {
	render: () => {
		const SegmentedPreview = () => {
			const [saleTypeValue, setSaleTypeValue] = useState<string>('');

			return (
				<Segmented
					value={saleTypeValue}
					onChange={value => setSaleTypeValue((value as string) || '')}
					options={[
						{ label: 'Todos', value: '' },
						{ label: 'Con Garantia', value: 'GARANTIA' },
					]}
				/>
			);
		};

		return <SegmentedPreview />;
	},
};

export const Disabled: Story = {
	args: {
		value: '',
		disabled: true,
		options: [
			{ label: 'Todos', value: '' },
			{ label: 'Con Garantia', value: 'GARANTIA' },
		],
	},
};
