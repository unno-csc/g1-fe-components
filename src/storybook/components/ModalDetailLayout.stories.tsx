import type { Meta, StoryObj } from '@storybook/react';
import { ModalDetailLayout, ModalField } from '../../components/Modals';
import { Table } from '../../components/Table';

const meta: Meta = {
	title: 'Components/Modals/ModalDetailLayout',
	tags: ['autodocs'],
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Layout reutilizable para contenido interno de modales de visualización/detalle. Proporciona estructura visual estándar con slots para status, campos header, métricas, tabla y resumen lateral.',
			},
		},
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

const mockDetailData = [
	{
		rowKey: '1',
		concept: 'Material Nacional',
		quantity: 10,
		unitCost: 150.5,
		total: 1505.0,
	},
	{
		rowKey: '2',
		concept: 'Importado FOB',
		quantity: 5,
		unitCost: 300.25,
		total: 1501.25,
	},
];

const mockColumns = [
	{
		title: 'Concepto',
		dataIndex: 'concept',
		key: 'concept',
		width: 150,
	},
	{
		title: 'Cantidad',
		dataIndex: 'quantity',
		key: 'quantity',
		align: 'center' as const,
		width: 100,
	},
	{
		title: 'Costo Unitario',
		dataIndex: 'unitCost',
		key: 'unitCost',
		align: 'right' as const,
		width: 130,
		render: (value: number) => `$ ${value.toFixed(2)}`,
	},
	{
		title: 'Total',
		dataIndex: 'total',
		key: 'total',
		align: 'right' as const,
		width: 130,
		render: (value: number) => `$ ${value.toFixed(2)}`,
	},
];

export const Default: Story = {
	render: () => (
		<ModalDetailLayout
			statusSlot={
				<div className="flex flex-wrap items-center gap-3">
					<span className="text-sm font-semibold text-zinc-600">Estado</span>
					<span className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
						Activo
					</span>
				</div>
			}
			headerFieldsSlot={
				<>
					<div className="h-px w-full bg-zinc-100" />
					<div className="grid grid-cols-1 gap-x-6 gap-y-4 py-4 sm:grid-cols-2 xl:grid-cols-3">
						<ModalField label="Código" value="COMP-2024-001" />
						<ModalField label="Modelo" value="Componente Nacional Estándar" />
						<ModalField label="Fecha de registro" value="01/04/2026" />
						<ModalField label="Partida Arancelaria" value="8517.62" />
						<ModalField label="Marca" value="LocalBrand" />
						<ModalField label="Total Detalles" value={mockDetailData.length} />
					</div>
				</>
			}
			metricsSlot={
				<div className="space-y-2">
					<div className="flex justify-between text-sm">
						<span className="font-medium text-zinc-700">Costo FOB:</span>
						<span className="text-zinc-900">$ 3,006.25</span>
					</div>
					<div className="flex justify-between text-sm">
						<span className="font-medium text-zinc-700">Otros Materiales:</span>
						<span className="text-zinc-900">$ 500.00</span>
					</div>
				</div>
			}
			tableTitle="Detalles del Componente"
			tableSlot={
				<Table
					columns={mockColumns}
					data={mockDetailData}
					rowKey="rowKey"
					loading={false}
					showPagination={false}
					onChange={() => {}}
					scroll={{ x: 'max-content' }}
				/>
			}
			summarySlot={
				<div className="flex flex-col items-end">
					<div className="w-full overflow-hidden rounded-xl border border-zinc-200 bg-white md:max-w-sm">
						<div className="h-1 w-full bg-amber-400" />
						<div className="flex flex-col gap-2 px-4 py-4 text-xs text-zinc-700">
							<div className="flex items-center justify-between gap-2">
								<span className="font-medium">COSTO NACIONAL:</span>
								<span className="text-right">$ 1,505.00</span>
							</div>
							<div className="flex items-center justify-between gap-2">
								<span className="font-medium">COSTO IMPORTADO:</span>
								<span className="text-right">$ 1,501.25</span>
							</div>
							<div className="flex items-center justify-between gap-2">
								<span className="font-medium">COSTO TOTAL:</span>
								<span className="text-right font-semibold">$ 3,006.25</span>
							</div>
							<div className="border-t border-zinc-200 pt-2">
								<div className="flex items-center justify-between gap-2">
									<span className="font-medium">% INTEGRACIÓN:</span>
									<span className="text-right font-semibold">50.02%</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			}
		/>
	),
};

export const WithoutSummary: Story = {
	render: () => (
		<ModalDetailLayout
			statusSlot={
				<div className="flex flex-wrap items-center gap-3">
					<span className="text-sm font-semibold text-zinc-600">Estado</span>
					<span className="inline-flex items-center rounded-md border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
						Inactivo
					</span>
				</div>
			}
			headerFieldsSlot={
				<>
					<div className="h-px w-full bg-zinc-100" />
					<div className="grid grid-cols-1 gap-x-6 gap-y-4 py-4 sm:grid-cols-2 xl:grid-cols-3">
						<ModalField label="Código" value="COMP-2023-005" />
						<ModalField label="Modelo" value="Componente Descontinuado" />
						<ModalField label="Fecha de registro" value="15/02/2023" />
					</div>
				</>
			}
			tableTitle="Detalles"
			tableSlot={
				<Table
					columns={mockColumns}
					data={mockDetailData}
					rowKey="rowKey"
					loading={false}
					showPagination={false}
					onChange={() => {}}
					scroll={{ x: 'max-content' }}
				/>
			}
		/>
	),
};

export const ModalFieldTypes: Story = {
	render: () => (
		<div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6">
			<h3 className="text-lg font-semibold text-zinc-900">Variantes de ModalField</h3>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<ModalField label="Con valor" value="Valor registrado" />

				<ModalField label="Sin valor (fallback)" value={undefined} />

				<ModalField label="Valor vacío" value="" fallback="Sin especificar" />

				<ModalField label="Número" value={42} />

				<ModalField
					label="Largo"
					value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt."
				/>

				<ModalField label="Null" value={null} />
			</div>
		</div>
	),
};
