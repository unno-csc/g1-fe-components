import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { Meta, StoryObj } from '@storybook/react';
import { TableMobileTypeCollapse } from '../../components/TableMobileTypeCollapse/TableMobileTypeCollapse';
import { ControlActionsProvider } from '../../HOC/ControlActions';
import { ITableColumnAction, TStrictTableColumnsType } from '../../types';

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

const columnActions: ITableColumnAction<Person>[] = [
	{ key: 'edit', title: 'Editar', icon: <EditOutlined />, action: record => console.log('edit', record) },
	{
		key: 'delete',
		title: 'Eliminar',
		icon: <DeleteOutlined />,
		action: record => console.log('delete', record),
		danger: true,
	},
];

const meta: Meta<typeof TableMobileTypeCollapse<Person>> = {
	title: 'Components/TableMobileTypeCollapse',
	component: TableMobileTypeCollapse,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Tabla mobile con filas colapsables (accordion). Requiere ejecutarse dentro de un `ControlActionsProvider`.',
			},
		},
	},
	decorators: [
		Story => (
			<ControlActionsProvider fnApiValidatePermissionAction={async () => true}>
				<Story />
			</ControlActionsProvider>
		),
	],
	args: {
		columns,
		data,
		rowKey: 'id',
		showColumnActions: true,
		columnActions,
	},
};

export default meta;
type Story = StoryObj<typeof TableMobileTypeCollapse<Person>>;

export const Default: Story = {
	render: args => (
		<div style={{ maxWidth: 420 }}>
			<TableMobileTypeCollapse {...args} />
		</div>
	),
};

export const EmptyState: Story = {
	args: { data: [] },
	render: args => (
		<div style={{ maxWidth: 420 }}>
			<TableMobileTypeCollapse {...args} />
		</div>
	),
};
