import type { StoryObj } from '@storybook/react';
import { SelectedItemsSlider } from '../../components/SelectedItemsSlider';

const meta = {
	title: 'Components/SelectedItemsSlider',
	component: SelectedItemsSlider,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {},
};

export default meta;

type Story = StoryObj<typeof meta>;

const selectedItems = [
	{
		id: 1,
		eyebrow: 'RUC 1790012345001',
		title: 'Global Parts Trading LLC',
		badgeLabel: 'INTERNACIONAL',
		badgeVariant: 'info' as const,
	},
	{
		id: 2,
		eyebrow: 'RUC 0991234567001',
		title: 'Suministros Industriales Andinos S.A.',
		badgeLabel: 'NACIONAL',
		badgeVariant: 'success' as const,
	},
	{
		id: 3,
		eyebrow: 'RUC 1790098765001',
		title: 'Pacific Import Export Group',
		badgeLabel: 'INTERNACIONAL',
		badgeVariant: 'info' as const,
	},
];

export const Default: Story = {
	args: {
		items: selectedItems,
		emptyMessage: 'No hay proveedores seleccionados',
		onRemoveItem: item => console.log('Quitar item', item),
	},
	render: args => (
		<div className="min-h-screen bg-gray-25 p-6">
			<div className="mx-auto max-w-[840px]">
				<SelectedItemsSlider {...args} />
			</div>
		</div>
	),
};

export const Empty: Story = {
	args: {
		items: [],
		emptyMessage: 'No hay proveedores seleccionados',
	},
	render: args => (
		<div className="min-h-screen bg-gray-25 p-6">
			<div className="mx-auto max-w-[840px]">
				<SelectedItemsSlider {...args} />
			</div>
		</div>
	),
};

export const CardOnly: Story = {
	args: {
		items: selectedItems,
		onRemoveItem: item => console.log('Quitar item', item),
	},
	render: args => (
		<div className="min-h-screen bg-gray-25 p-6">
			<div className="mx-auto max-w-[560px]">
				<SelectedItemsSlider {...args} />
			</div>
		</div>
	),
};

export const CustomContent: Story = {
	args: {
		items: selectedItems,
		onRemoveItem: item => console.log('Quitar item', item),
		renderItem: item => (
			<div className="flex min-h-[76px] flex-col justify-between">
				<div>
					<p className="mb-1 truncate text-xs font-medium uppercase text-gray-400" title={item.eyebrow}>
						{item.eyebrow}
					</p>
					<p className="truncate text-sm font-semibold text-gray-800" title={item.title}>
						{item.title}
					</p>
				</div>
				<div className="flex items-center justify-between gap-3">
					<span className="truncate text-xs text-gray-500">Contenido personalizado desde el consumidor</span>
					{item.badgeLabel !== undefined ? (
						<span className="shrink-0 rounded-full bg-yellow-50 px-2 py-0.5 text-[11px] font-semibold text-yellow-600">
							{item.badgeLabel}
						</span>
					) : null}
				</div>
			</div>
		),
	},
	render: args => (
		<div className="min-h-screen bg-gray-25 p-6">
			<div className="mx-auto max-w-[560px]">
				<SelectedItemsSlider {...args} />
			</div>
		</div>
	),
};
