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
	startDate: string;
	expiresAt: string;
	email: string;
	description: string;
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
		startDate: '2026-03-10',
		expiresAt: '2026-03-10 14:30',
		email: 'john.doe@example.com',
		description:
			'Seguro de transporte - gastos no sujetos a IVA con detalle largo para mostrar el tooltip completo.',
		status: 'active',
	},
	{
		id: 2,
		name: 'Jane Smith',
		age: 28,
		discount: 20,
		salary: 980,
		startDate: '2026-03-14',
		expiresAt: '2026-03-14 08:45',
		email: 'jane.smith@example.com',
		description:
			'Seguro de transporte - gastos gravados con IVA y texto extendido para ver el truncado y el popup.',
		status: 'inactive',
	},
	{
		id: 3,
		name: 'Bob Johnson',
		age: 45,
		discount: 30,
		salary: 1575,
		startDate: '2026-03-18',
		expiresAt: '2026-03-18 17:15',
		email: 'bob.johnson@example.com',
		description:
			'Seguro de transporte - prima neta (grava IVA) con una descripción suficientemente larga.',
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
		title: 'Descripción',
		dataIndex: 'description',
		key: 'description',
		width: 220,
	},
	{
		title: 'Fecha inicio',
		dataIndex: 'startDate',
		key: 'startDate',
		type: 'date',
		width: 170,
	},
	{
		title: 'Vence',
		dataIndex: 'expiresAt',
		key: 'expiresAt',
		type: 'date',
		includeTime: true,
		width: 200,
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
			<div className='bg-primary-300 p-2'>
				<TableDetails
					{...args}
					data={rows}
					onDelete={handleDelete}
					onChangeData={handleChangeData}
					rowKey={args.rowKey || 'id'}
					footer={<div className='flex min-h-0 w-full justify-end items-center p-2'>
						Total
					</div>}
					scroll={{ x: 'max-content', y: 320 }}
					showHeader={false}
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

const HEIGHT_PRESETS = [200, 280, 360, 400, 500] as const;
const EXPAND_WIDTH_PRESETS = [32, 56, 80] as const;

export const FixedHeight: Story = {
	render: args => {
		const [rows, setRows] = useState<ITableDetailsData[]>(args.data);
		const [height, setHeight] = useState<number>(280);

		const handleChangeData: NonNullable<ITableDetailsProps<ITableDetailsData>['onChangeData']> = ({
			record,
			dataIndex,
			value,
		}) => {
			setRows(prev =>
				prev.map(item => (item.id === record.id ? { ...record, [dataIndex as keyof ITableDetailsData]: value } : item)),
			);
		};

		const handleDelete = (_value: any, record: ITableDetailsData) => {
			setRows(prev => prev.filter(item => item.id !== record.id));
		};

		return (
			<div className='space-y-4'>
				<div className='flex flex-wrap items-center gap-2'>
					<span className='text-sm text-gray-600'>Alto:</span>
					{HEIGHT_PRESETS.map(h => (
						<button
							key={h}
							type='button'
							onClick={() => setHeight(h)}
							className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
								height === h ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
							}`}
						>
							{h}px
						</button>
					))}
				</div>
				<TableDetails
					{...args}
					data={rows}
					onDelete={handleDelete}
					onChangeData={handleChangeData}
					rowKey={args.rowKey || 'id'}
					height={height}
					footer={
						<div className='flex min-h-0 w-full justify-end items-center p-2'>
							Total
						</div>
					}
				/>
			</div>
		);
	},
	args: {
		data: sampleData,
		columns: sampleColumns,
		rowKey: 'id',
	},
	parameters: {
		docs: {
			description: {
				story: 'Tabla con alto fijo mediante la prop `height`. Mantiene el mismo tamaño con o sin datos. Usa los botones de eliminar para vaciar la tabla y ver que el contenedor conserva su altura.',
			},
		},
	},
};

export const ExpandableColumnWidth: Story = {
	render: args => {
		const [rows, setRows] = useState<ITableDetailsData[]>(args.data);
		const [expandWidth, setExpandWidth] = useState<number>(56);

		const handleChangeData: NonNullable<ITableDetailsProps<ITableDetailsData>['onChangeData']> = ({
			record,
			dataIndex,
			value,
		}) => {
			setRows(prev =>
				prev.map(item => (item.id === record.id ? { ...record, [dataIndex as keyof ITableDetailsData]: value } : item)),
			);
		};

		const handleDelete = (_value: any, record: ITableDetailsData) => {
			setRows(prev => prev.filter(item => item.id !== record.id));
		};

		return (
			<div className='space-y-4'>
				<div className='flex flex-wrap items-center gap-2'>
					<span className='text-sm text-gray-600'>Ancho expand:</span>
					{EXPAND_WIDTH_PRESETS.map(width => (
						<button
							key={width}
							type='button'
							onClick={() => setExpandWidth(width)}
							className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
								expandWidth === width ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
							}`}
						>
							{width}px
						</button>
					))}
				</div>
				<TableDetails
					{...args}
					data={rows}
					onDelete={handleDelete}
					onChangeData={handleChangeData}
					rowKey={args.rowKey || 'id'}
					expandable={{
						columnWidth: expandWidth,
						indentSize: 8,
						defaultExpandedRowKeys: [1],
						expandedRowRender: record => (
							<div className='px-3 py-2 text-sm text-gray-700'>
								<strong>Detalle:</strong> {record.name} - {record.description}
							</div>
						),
					}}
				/>
			</div>
		);
	},
	args: {
		data: sampleData,
		columns: sampleColumns,
		rowKey: 'id',
	},
	parameters: {
		docs: {
			description: {
				story:
					'Ejemplo de filas expandibles con columna expand en distintos tamaños (32px, 56px y 80px) usando `expandable.columnWidth`.',
			},
		},
	},
};

