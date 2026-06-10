import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from 'antd';
import { DetailView, createDetailSchema } from '../../components/DetailView';
import { _mockModelData } from '../../constants/modelPreviewData';
import { IVehicleModel } from '../../interfaces/modelInterface';

const meta: Meta<typeof DetailView> = {
	title: 'Components/DetailView',
	component: DetailView,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component: `
# DetailView — Visualización Estructurada de Entidades

Componente declarativo para mostrar información detallada de cualquier entidad.
Incluye cabecera con código identificador, estado y descripción; secciones con título en ámbar
y campos organizados en grid responsivo con separadores.

## Props nuevas
- \`statusSlot\`: Acepta cualquier \`ReactNode\` para mostrar el estado en la cabecera (Tag Activo/Inactivo, etc.)

## Cabecera
- \`schema.title\` → badge ámbar con el código/nombre principal
- \`statusSlot\` → tag de estado (opcional)
- \`schema.description\` → descripción/subtítulo en gris

## Responsive
- **Móvil** → 1 columna siempre
- **sm** → 2 columnas siempre (independiente del schema)
- **md+** → columnas definidas por schema
				`,
			},
		},
	},
	argTypes: {
		isLoading: {
			control: 'boolean',
			description: 'Muestra skeleton de carga',
		},
		emptyMessage: {
			control: 'text',
			description: 'Mensaje cuando no hay datos',
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

const vehicleData = _mockModelData;

export const ConCabecera: Story = {
	name: 'Con Cabecera (Recomendado)',
	args: {
		data: vehicleData,
		schema: createDetailSchema<IVehicleModel>()
			.title('itemCode')
			.description('itemDescription')
			.statusBadge('isActive')
			.section('Información Básica', s =>
				s
					.columns({ xs: 1, md: 2 })
					.field('itemCode', 'Código')
					.field('brandName', 'Marca')
					.field('itemDescription', 'Descripción', { span: 2 }),
			)
			.section('Clasificaciones', s =>
				s
					.columns({ xs: 1, md: 4 })
					.field('countryName', 'País de origen')
					.field('className', 'Clase')
					.field('subclassName', 'Subclase')
					.field('relationshipDescription', 'Proveedor')
					.field('antTypeDescription', 'Tipo ANT')
					.field('antSubtypeDescription', 'Subtipo ANT'),
			)
			.section('Especificaciones Técnicas', s =>
				s
					.columns({ xs: 1, md: 4 })
					.field('displacement', 'Cilindraje', {
						formatter: v => (v ? `${v} cc` : 'N/A'),
					})
					.field('transmissionDescription', 'Transmisión')
					.field('capacity', 'Capacidad', {
						formatter: v => (v ? `${v} personas` : 'N/A'),
					})
					.field('tonnage', 'Tonelaje', {
						formatter: v => (v ? `${v} T` : 'N/A'),
					}),
			)
			.section('Información Comercial', s =>
				s
					.columns({ xs: 1, md: 4 })
					.field('ivaDescription', 'IVA')
					.field('ecoValueDescription', 'Eco Valor')
					.field('requiresCustomerProfile', 'Requiere perfil', {
						formatter: v => (v ? 'Sí' : 'No'),
					})
					.field('qrCommercialCode', 'Código QR'),
			)
			.build(),
		isLoading: false,
	},
};

export const SinCabecera: Story = {
	name: 'Sin Cabecera',
	args: {
		data: vehicleData,
		schema: createDetailSchema<IVehicleModel>()
			.section('Información Básica', s =>
				s
					.columns({ xs: 1, md: 2 })
					.field('itemCode', 'Código')
					.field('brandName', 'Marca')
					.field('itemDescription', 'Descripción', { span: 2 }),
			)
			.section('Especificaciones Técnicas', s =>
				s
					.columns({ xs: 1, md: 3 })
					.field('displacement', 'Cilindraje', {
						formatter: v => (v ? `${v} cc` : 'N/A'),
					})
					.field('capacity', 'Capacidad', {
						formatter: v => (v ? `${v} personas` : 'N/A'),
					})
					.field('transmissionDescription', 'Transmisión')
					.field('className', 'Clase')
					.field('subclassName', 'Subclase')
					.field('countryName', 'País de Origen'),
			)
			.build(),
		isLoading: false,
	},
};

export const Inactivo: Story = {
	name: 'Estado Inactivo',
	args: {
		data: { ...vehicleData, isActive: false },
		schema: createDetailSchema<IVehicleModel>()
			.title('itemCode')
			.description('itemDescription')
			.statusBadge('isActive')
			.section('Información Básica', s =>
				s
					.columns({ xs: 1, md: 2 })
					.field('itemCode', 'Código')
					.field('brandName', 'Marca')
					.field('itemDescription', 'Descripción', { span: 2 }),
			)
			.build(),
		isLoading: false,
	},
};

export const Cargando: Story = {
	name: 'Skeleton de Carga',
	args: {
		data: vehicleData,
		schema: createDetailSchema<IVehicleModel>()
			.title('itemCode')
			.description('itemDescription')
			.section('Información Básica', s => s.field('itemCode', 'Código'))
			.section('Clasificaciones', s => s.field('className', 'Clase'))
			.section('Especificaciones Técnicas', s => s.field('displacement', 'Cilindraje'))
			.section('Información Comercial', s => s.field('ivaDescription', 'IVA'))
			.build(),
		isLoading: true,
	},
};

export const SinDatos: Story = {
	name: 'Sin Datos',
	args: {
		data: null as unknown as IVehicleModel,
		schema: createDetailSchema<IVehicleModel>()
			.section('Básico', s => s.field('itemCode', 'Código'))
			.build(),
		isLoading: false,
		emptyMessage: 'No se encontró información del vehículo',
	},
};

export const Colapsable: Story = {
	name: 'Secciones Colapsables',
	args: {
		data: vehicleData,
		schema: createDetailSchema<IVehicleModel>()
			.title('itemCode')
			.description('itemDescription')
			.statusBadge('isActive')
			.section('Información Principal', s =>
				s.field('itemCode', 'Código').field('brandName', 'Marca'),
			)
			.section('Especificaciones (Expandible)', s =>
				s
					.collapsible(false)
					.field('displacement', 'Cilindraje')
					.field('capacity', 'Capacidad'),
			)
			.section('Detalles Adicionales (Colapsado)', s =>
				s
					.collapsible(true)
					.field('className', 'Clase')
					.field('subclassName', 'Subclase'),
			)
			.build(),
		isLoading: false,
	},
};

export const Condicional: Story = {
	name: 'Renderizado Condicional',
	args: {
		data: { ...vehicleData, isActive: false },
		schema: createDetailSchema<IVehicleModel>()
			.title('itemCode')
			.description('itemDescription')
			.statusBadge('isActive')
			.section('Siempre Visible', s => s.field('itemCode', 'Código'))
			.section('Solo si Activo', s =>
				s.showIf(data => data.isActive).field('displacement', 'Cilindraje'),
			)
			.section('Solo si Inactivo', s =>
				s
					.showIf(data => !data.isActive)
					.field('itemCode', 'Código Inactivo')
					.custom('brandName', 'Aviso', () => (
						<span style={{ color: 'red', fontWeight: 'bold' }}>
							Este vehículo está inactivo
						</span>
					)),
			)
			.build(),
		isLoading: false,
	},
};
