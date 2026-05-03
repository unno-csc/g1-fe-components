import type { Meta, StoryObj } from '@storybook/react';
import { EditOutlined, DeleteOutlined, CopyOutlined, PlusOutlined } from '@ant-design/icons';
import { DropdownButton } from '../../components/DropdownButton/DropdownButton';
import type { IDropdownButtonItem } from '../../components/DropdownButton/DropdownButton';

const meta: Meta<typeof DropdownButton> = {
	title: 'Components/DropdownButton',
	component: DropdownButton,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Botón con menú desplegable integrado\n\n' +
					'**Variantes disponibles:**\n' +
					'- `primary`: Fondo rojo\n' +
					'- `secondary`: Fondo blanco con borde\n\n' +
					'**Tamaños:** `small`, `middle`, `large`',
			},
		},
	},
	argTypes: {
		type: {
			control: { type: 'select' },
			options: ['primary', 'secondary'],
			description: 'Variante visual del botón',
			table: { defaultValue: { summary: 'primary' } },
		},
		size: {
			control: { type: 'select' },
			options: ['small', 'middle', 'large'],
			description: 'Tamaño del botón',
			table: { defaultValue: { summary: 'middle' } },
		},
		placement: {
			control: { type: 'select' },
			options: ['bottomLeft', 'bottomCenter', 'bottomRight', 'topLeft', 'topCenter', 'topRight'],
			description: 'Posición del menú desplegable',
			table: { defaultValue: { summary: 'bottomLeft' } },
		},
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

const defaultItems = [
	{ key: 'edit', label: 'Editar', icon: <EditOutlined />, onClick: () => console.log('Editar') },
	{ key: 'duplicate', label: 'Duplicar', icon: <CopyOutlined />, onClick: () => console.log('Duplicar') },
	{ key: 'delete', label: 'Eliminar', icon: <DeleteOutlined />, onClick: () => console.log('Eliminar') },
];

export const Primary: Story = {
	args: {
		label: 'Acciones',
		items: defaultItems,
		type: 'primary',
	},
};

export const Secondary: Story = {
	args: {
		label: 'Opciones',
		items: defaultItems,
		type: 'secondary',
	},
};

export const WithIcon: Story = {
	args: {
		label: 'Nuevo',
		items: defaultItems,
		type: 'primary',
		icon: <PlusOutlined />,
	},
};

export const Small: Story = {
	args: {
		label: 'Acciones',
		items: defaultItems,
		type: 'primary',
		size: 'small',
	},
};

export const Large: Story = {
	args: {
		label: 'Acciones',
		items: defaultItems,
		type: 'primary',
		size: 'large',
	},
};

export const Disabled: Story = {
	args: {
		label: 'Acciones',
		items: defaultItems,
		type: 'primary',
		disabled: true,
	},
};

export const Loading: Story = {
	args: {
		label: 'Procesando',
		items: defaultItems,
		type: 'primary',
		loading: true,
	},
};

export const WithDisabledItem: Story = {
	args: {
		label: 'Acciones',
		type: 'primary',
		items: [
			{ key: 'edit', label: 'Editar', icon: <EditOutlined />, onClick: () => console.log('Editar') },
			{ key: 'delete', label: 'Eliminar (sin permisos)', icon: <DeleteOutlined />, onClick: () => console.log('Eliminar'), disabled: true },
		],
	},
};

export const ItemTypes: Story = {
	render: () => {
		const items: IDropdownButtonItem[] = [
			{ key: 'ok', label: 'Guardar', icon: <EditOutlined />, onClick: () => console.log('Guardar'), type: 'primary' },
			{ key: 'warn', label: 'Advertencia', icon: <CopyOutlined />, onClick: () => console.log('Advertencia'), type: 'warning' },
			{ key: 'danger', label: 'Eliminar', icon: <DeleteOutlined />, onClick: () => console.log('Eliminar'), type: 'danger' },
			{ key: 'success', label: 'Duplicar', icon: <CopyOutlined />, onClick: () => console.log('Duplicar'), type: 'success' },
		];

		return (
			<div style={{ display: 'flex', gap: 12 }}>
				<DropdownButton label="Acciones" items={items} type="primary" />
			</div>
		);
	},
};

export const PlacementTop: Story = {
	render: () => {
		const items = [
			{ key: '1', label: 'Opción 1', onClick: () => console.log('1') },
			{ key: '2', label: 'Opción 2', onClick: () => console.log('2') },
		];

		return (
			<div style={{ display: 'flex', gap: 12 }}>
				<DropdownButton label="Arriba" items={items} placement="topLeft" />
			</div>
		);
	},
};
