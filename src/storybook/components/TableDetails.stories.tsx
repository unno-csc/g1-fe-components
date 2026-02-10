import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TableDetails, ITableDetailsProps } from '../../components/TableDetails';
import { ITableDetailsColumn  } from '../../interfaces';

export type ITableDetailsData = {
	id: number;
	name: string;
	age: number;
	discount: number;
	salary: number;
	email: string;
	status: 'active' | 'inactive';
	keyObjectError?: Record<string, string>;
};

const sampleData: ITableDetailsData[] = [
	{
		id: 1,
		name: 'John Doe',
		age: 32,
		discount: 10,
		salary: 1250,
		email: 'john.doe@example.com',
		status: 'active',
	},
	{
		id: 2,
		name: 'Jane Smith',
		age: 28,
		discount: 20,
		salary: 980,
		email: 'jane.smith@example.com',
		status: 'inactive',
	},
	{
		id: 3,
		name: 'Bob Johnson',
		age: 45,
		discount: 30,
		salary: 1575,
		email: 'bob.johnson@example.com',
		status: 'active',
		keyObjectError: {
			age: 'Error de prueba',
			discount: 'Descuento inválido',
			salary: 'Salario fuera de rango',
		},
	},
];

const sampleColumns: ITableDetailsColumn<ITableDetailsData>[] = [
	// {
	// 	title: 'Name',
	// 	dataIndex: 'name',
	// 	key: 'name',
	// 	type: 'text',
	// },
	// {
	// 	title: 'Age',
	// 	dataIndex: 'age',
	// 	key: 'age',
	// 	type: 'number',
	// 	maxDigits: 3,
	// },
	{
		title: 'Discount',
		dataIndex: 'discount',
		key: 'discount',
		type: 'percentage',
		maxDigits: 3,
		width: 140,
	},
	{
		title: 'Salary',
		dataIndex: 'salary',
		key: 'salary',
		type: 'money',
		maxDigits: 6,
		width: 160,
	},
	// {
	// 	title: 'Email',
	// 	dataIndex: 'email',
	// 	key: 'email',
	// 	type: 'text',
	// 	disabled: record => record.status === 'inactive',
	// },
	// {
	// 	title: 'Status',
	// 	dataIndex: 'status',
	// 	key: 'status',
	// 	type: 'select',
	// 	options: [
	// 		{ label: 'Activo', value: 'active' },
	// 		{ label: 'Inactivo', value: 'inactive' },
	// 	],
	// },
];

const meta: Meta<typeof TableDetails> = {
	title: 'Components/TableDetails',
	component: TableDetails,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component: 'Componente TableDetails basado en Ant Design Table para mostrar detalles en formato de tabla.',
			},
		},
	},
	argTypes: {
		data: {
			control: 'object',
			description: 'Filas a renderizar en la tabla.',
		},
		columns: {
			control: 'object',
			description: 'Configuración de columnas (tipo de celda, opciones, validaciones).',
		},
		rowKey: {
			control: 'text',
			description: 'Clave única por fila. Usa `id` por defecto en este ejemplo.',
		},
		scroll: {
			control: 'object',
			description: 'Propiedad de scroll de la tabla de Ant Design.',
		},
		onDelete: {
			table: { disable: true },
			description: 'Callback al eliminar un registro.',
		},
		onChangeData: {
			table: { disable: true },
			description: 'Callback al modificar una celda.',
		},
	},
};

export default meta;

type Story = StoryObj<ITableDetailsProps<ITableDetailsData>>;

export const Default: Story = {
	render: args => {
		const [rows, setRows] = useState<ITableDetailsData[]>(args.data);

		const handleChangeData: NonNullable<ITableDetailsProps<ITableDetailsData>['onChangeData']> = ({
			record,
			dataIndex,
			value,
		}) => {
			setRows(prev =>
				prev.map(item => (item.id === record.id ? { ...record, [dataIndex as keyof ITableDetailsData]: value } : item)),
			);
		};

		const handleDelete = (record: ITableDetailsData) => {
			setRows(prev => prev.filter(item => item.id !== record.id));
		};

		return (
			<div>
				<TableDetails
					{...args}
					data={rows}
					onDelete={handleDelete}
					onChangeData={handleChangeData}
					rowKey={args.rowKey || 'id'}
				/>
			</div>
		);
	},
	args: {
		data: sampleData,
		columns: sampleColumns,
		rowKey: 'id',
	},
};

export const WithData: Story = {
	render: args => {
		const [rows, setRows] = useState<ITableDetailsData[]>(args.data);

		const handleChangeData: NonNullable<ITableDetailsProps<ITableDetailsData>['onChangeData']> = ({
			record,
			dataIndex,
			value,
		}) => {
			setRows(prev =>
				prev.map(item => (item.id === record.id ? { ...record, [dataIndex as keyof ITableDetailsData]: value } : item)),
			);
		};

		const handleDelete = (record: ITableDetailsData) => {
			setRows(prev => prev.filter(item => item.id !== record.id));
		};

		return (
			<div>
				<TableDetails
					{...args}
					data={rows}
					onDelete={handleDelete}
					onChangeData={handleChangeData}
					rowKey={args.rowKey || 'id'}
				/>
			</div>
		);
	},
	args: {
		data: sampleData,
		columns: sampleColumns,
		rowKey: 'id',
		scroll: { x: 'max-content', y: 320 },
	},
	parameters: {
		docs: {
			description: {
				story:
					'Variación con scroll personalizado para demostrar edición, eliminación y columnas de tipo porcentaje, dinero y select.',
			},
		},
	},
};

