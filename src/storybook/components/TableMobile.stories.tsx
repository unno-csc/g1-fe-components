import type { Meta, StoryObj } from '@storybook/react';
import { TableMobile } from '../../components/TableMobile/TableMobile';
import { TStrictTableColumnsType } from '../../types';

type Person = { id: number; name: string; age: number; address: string };

const data: Person[] = [
	{ id: 1, name: 'Jim Green', age: 32, address: 'New York No. 1 Lake Park' },
	{ id: 2, name: 'Joe Black', age: 42, address: 'London No. 1 Lake Park' },
	{ id: 3, name: 'John Smith', age: 28, address: 'Sydney No. 1 Lake Park' },
];

const columns: TStrictTableColumnsType<Person> = [
	{ title: 'Nombre', dataIndex: 'name', key: 'name' },
	{ title: 'Edad', dataIndex: 'age', key: 'age' },
	{ title: 'Dirección', dataIndex: 'address', key: 'address' },
];

const meta: Meta<typeof TableMobile<Person>> = {
	title: 'Components/TableMobile',
	component: TableMobile,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component: 'Vista de tabla en formato tarjeta/cuadrícula pensada para viewports angostos (< 480px).',
			},
		},
	},
	args: { columns, data },
};

export default meta;
type Story = StoryObj<typeof TableMobile<Person>>;

export const Default: Story = {
	render: args => (
		<div style={{ maxWidth: 420 }}>
			<TableMobile {...args} />
		</div>
	),
};

export const EmptyState: Story = {
	args: { data: [], emptyContent: <p className="text-center text-gray-400">Sin datos disponibles</p> },
};
