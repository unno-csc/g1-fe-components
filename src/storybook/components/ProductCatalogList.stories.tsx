import type { Meta, StoryObj } from '@storybook/react';
import { ProductCatalogList, IProductCatalogListItem, IProductCatalogListProps } from '../../components/ProductCatalogList';

const sampleItems: IProductCatalogListItem[] = [
	{
		code: 'A-001',
		brandName: 'Bosch',
		productCode: 'BSH-1029',
		description: 'Pastillas de freno delanteras',
		status: 'Activo',
		itemClassName: 'Frenos',
		itemSubclassName: 'Pastillas',
	},
	{
		code: 'A-002',
		brandName: 'Mobil',
		productCode: 'MBL-5541',
		description: 'Aceite sintético 5W-30',
		status: 'Activo',
		itemClassName: 'Lubricantes',
		itemSubclassName: 'Motor',
		addDisabled: true,
	},
	{
		code: 'A-003',
		brandName: 'NGK',
		productCode: 'NGK-8842',
		description: 'Bujía de encendido',
		status: 'Activo',
		itemClassName: 'Encendido',
		itemSubclassName: 'Bujías',
		viewDisabled: true,
	},
];

const meta: Meta<IProductCatalogListProps> = {
	title: 'Components/ProductCatalogList',
	component: ProductCatalogList,
	tags: ['autodocs'],
	parameters: { layout: 'padded' },
	args: {
		items: sampleItems,
		onViewItem: item => console.log('view', item),
		onAddItem: item => console.log('add', item),
	},
};

export default meta;
type Story = StoryObj<IProductCatalogListProps>;

export const Default: Story = {};

export const Empty: Story = {
	args: { items: [] },
};
