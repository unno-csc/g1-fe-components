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
				component:
					'Componente Segmented basado en Ant Design estilizado con tokens ITSA para filtros y selectores rápidos.',
			},
		},
	},
	argTypes: {
		variant: {
			control: { type: 'select' },
			options: ['default', 'brand'],
			description: 'Variante visual del segmented (default con gris neutro o brand con paleta amber)',
		},
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

export const Default: Story = {
	render: () => {
		const SegmentedPreview = () => {
			const [saleTypeValue, setSaleTypeValue] = useState<string>('todos');

			return (
				<Segmented
					value={saleTypeValue}
					onChange={value => setSaleTypeValue((value as string) || '')}
					options={[
						{ label: 'Todos', value: 'todos' },
						{ label: 'Con Garantia', value: 'garantia' },
						{ label: 'Sin Garantia', value: 'sin_garantia' },
					]}
				/>
			);
		};

		return <SegmentedPreview />;
	},
};

export const BrandVariant: Story = {
	render: () => {
		const BrandPreview = () => {
			const [filterValue, setFilterValue] = useState<string>('active');

			return (
				<Segmented
					variant="brand"
					value={filterValue}
					onChange={value => setFilterValue((value as string) || '')}
					options={[
						{ label: 'Activos', value: 'active' },
						{ label: 'Inactivos', value: 'inactive' },
						{ label: 'Pendientes', value: 'pending' },
					]}
				/>
			);
		};

		return <BrandPreview />;
	},
};

export const Sizes: Story = {
	render: () => {
		const SizesPreview = () => {
			const [valSmall, setValSmall] = useState<string>('dia');
			const [valMiddle, setValMiddle] = useState<string>('dia');
			const [valLarge, setValLarge] = useState<string>('dia');

			const options = [
				{ label: 'Día', value: 'dia' },
				{ label: 'Semana', value: 'semana' },
				{ label: 'Mes', value: 'mes' },
			];

			return (
				<div className="flex flex-col items-center gap-5">
					<div className="flex items-center gap-3">
						<span className="text-xs text-gray-500 w-16">Pequeño:</span>
						<Segmented size="small" value={valSmall} onChange={v => setValSmall(v as string)} options={options} />
					</div>
					<div className="flex items-center gap-3">
						<span className="text-xs text-gray-500 w-16">Medio:</span>
						<Segmented size="middle" value={valMiddle} onChange={v => setValMiddle(v as string)} options={options} />
					</div>
					<div className="flex items-center gap-3">
						<span className="text-xs text-gray-500 w-16">Grande:</span>
						<Segmented size="large" value={valLarge} onChange={v => setValLarge(v as string)} options={options} />
					</div>
				</div>
			);
		};

		return <SizesPreview />;
	},
};

export const Disabled: Story = {
	args: {
		value: 'todos',
		disabled: true,
		options: [
			{ label: 'Todos', value: 'todos' },
			{ label: 'Con Garantia', value: 'garantia' },
		],
	},
};
