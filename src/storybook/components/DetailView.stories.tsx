import type { Meta, StoryObj } from '@storybook/react';
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
# DetailView - Sistema de Visualización de Entidades

Componente de alto nivel para la representación estructurada y consistente de información detallada de cualquier entidad del dominio.

## Características Principales

- **Arquitectura Declarativa**: Construcción mediante esquemas configurables que eliminan código boilerplate
- **Type Safety**: Validación exhaustiva de tipos en tiempo de compilación con generics de TypeScript
- **Sistema de Renderizado Extensible**: 9 renderers especializados con soporte para componentes personalizados
- **Diseño Responsivo**: Grid configurable por breakpoint (xs, sm, md, lg, xl, xxl)
- **Gestión de Estados**: Integración nativa de carga, datos vacíos y renderizado condicional

## Tipos de Renderizado Soportados

- **text**: Renderizado de cadenas de texto con formateo opcional
- **badge**: Indicadores de estado con componente TagStatus
- **link**: Enlaces externos con validación de URL
- **date**: Formateo de fechas mediante dayjs
- **currency**: Valores monetarios con prefijos/sufijos configurables
- **array**: Colecciones renderizadas como etiquetas
- **table**: Tablas anidadas con configuración de columnas
- **gallery**: Carruseles de imágenes con aspectRatio configurable
- **custom**: Función de renderizado completamente personalizable


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

// Usar datos reales de modelPreviewData
const vehicleData = _mockModelData;

export const Basic: Story = {
	args: {
		data: vehicleData,
		schema: createDetailSchema<IVehicleModel>()
			.title('Detalle del Vehículo')
			.section('Información Básica', s =>
				s
					.field('itemCode', 'Código')
					.field('itemSuffix', 'Sufijo')
					.field('brandName', 'Marca')
					.badge('isActive', 'Estado', { true: 'Sí', false: 'No' })
			)
			.section('Especificaciones', s =>
				s
					.field('displacement', 'Cilindraje')
					.field('capacity', 'Capacidad')
					.field('transmissionDescription', 'Transmisión')
			)
			.build(),
		isLoading: false,
	},
};

export const WithBuilder: Story = {
	args: {
		data: vehicleData,
		schema: createDetailSchema<IVehicleModel>()
			.title('Detalle del Vehículo')
			.description('Información completa del modelo')
			.section('Información Básica', s =>
				s
					.columns({ xs: 1, md: 2, xl: 2, xxl: 2 })
					.field('itemCode', 'Código', { copyable: true })
					.field('itemSuffix', 'Sufijo')
					.field('brandName', 'Marca')
					.badge('isActive', 'Estado')
					.field('itemDescription', 'Descripción', { span: 2 }),
			)
			.section('Especificaciones Técnicas', s =>
				s
					.columns({ xs: 1, md: 3, xl: 3, xxl: 3 })
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

export const AllFieldTypes: Story = {
	args: {
		data: vehicleData,
		schema: createDetailSchema<IVehicleModel>()
			.section('Tipos de Campo', s =>
				s
					.columns({ xs: 1, md: 2 })
					.field('itemCode', 'Texto Simple')
					.badge('isActive', 'Badge (Estado)')
					.currency('displacement', 'Cilindraje (Numérico)'),
			)
			.section('Tabla Embebida', s =>
				s.table('interestDetails', 'Detalles de Interés', [
					{ key: 'modelYear', label: 'Año del Modelo', align: 'center' },
					{ key: 'interestRate', label: 'Tasa de Interés', suffix: '%', align: 'right' },
					{ key: 'term', label: 'Plazo (meses)', align: 'right' },
				]),
			)
			.section('Galería de Imágenes', s =>
				s.gallery('images', 'Imágenes', {
					aspectRatio: '16/9',
					autoPlay: true,
					autoPlayInterval: 3000,
				}),
			)
			.build(),
		isLoading: false,
	},
};

export const WithFormatters: Story = {
	args: {
		data: vehicleData,
		schema: createDetailSchema<IVehicleModel>()
			.section('Con Formateadores', s =>
				s
					.field('displacement', 'Motor', {
						prefix: '',
						formatter: v => `${v} cc`,
					})
					.field('capacity', 'Pasajeros', {
						prefix: '',
						formatter: v => `${v} personas`,
					}),
			)
			.build(),
		isLoading: false,
	},
};

export const Collapsible: Story = {
	args: {
		data: vehicleData,
		schema: createDetailSchema<IVehicleModel>()
			.section('Información Principal', s =>
				s.field('itemCode', 'Código').field('brandName', 'Marca'),
			)
			.section('Especificaciones', s =>
				s
					.collapsible(false)
					.field('displacement', 'Cilindraje')
					.field('capacity', 'Capacidad'),
			)
			.section('Detalles Adicionales', s =>
				s
					.collapsible(true)
					.field('className', 'Clase')
					.field('subclassName', 'Subclase'),
			)
			.build(),
		isLoading: false,
	},
};

export const Loading: Story = {
	args: {
		data: vehicleData,
		schema: createDetailSchema<IVehicleModel>()
			.section('Sección 1', s => s.field('itemCode', 'Código'))
			.section('Sección 2', s => s.field('brandName', 'Marca'))
			.section('Sección 3', s => s.field('displacement', 'Cilindraje'))
			.build(),
		isLoading: true,
	},
};

export const Empty: Story = {
	args: {
		data: null as any,
		schema: createDetailSchema<IVehicleModel>()
			.section('Básico', s => s.field('itemCode', 'Código'))
			.build(),
		isLoading: false,
		emptyMessage: 'No se encontró información del vehículo',
	},
};

export const Conditional: Story = {
	args: {
		data: { ...vehicleData, isActive: false },
		schema: createDetailSchema<IVehicleModel>()
			.section('Siempre Visible', s => s.field('itemCode', 'Código'))
			.section('Solo si Activo', s =>
				s.showIf(data => data.isActive).field('displacement', 'Cilindraje'),
			)
			.section('Solo si Inactivo', s =>
				s
					.showIf(data => !data.isActive)
					.field('itemCode', 'Código Inactivo')
					.custom('brandName', 'Mensaje', () => <div style={{ color: 'red' }}>Este vehículo está inactivo</div>),
			)
			.build(),
		isLoading: false,
	},
};

export const CustomRenderer: Story = {
	args: {
		data: vehicleData,
		schema: createDetailSchema<IVehicleModel>()
			.section('Renderizado Personalizado', s =>
				s
					.field('brandName', 'Marca Normal')
					.custom('brandName', 'Marca Custom', (value, data) => (
						<div
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								gap: '8px',
								padding: '8px 12px',
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								color: 'white',
								borderRadius: '8px',
								fontWeight: 'bold',
							}}
						>
							{String(value)}
						</div>
					)),
			)
			.build(),
		isLoading: false,
	},
};

export const ResponsiveColumns: Story = {
	args: {
		data: vehicleData,
		schema: createDetailSchema<IVehicleModel>()
			.section('Grid Adaptativo: xs=1, md=2, lg=3', s =>
				s
					.columns({ xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 3 })
					.field('itemCode', 'Código')
					.field('brandName', 'Marca')
					.field('transmissionDescription', 'Transmisión')
					.field('className', 'Clase')
					.field('subclassName', 'Subclase')
					.field('countryName', 'País'),
			)
			.build(),
		isLoading: false,
	},
};

export const RealWorldExample: Story = {
	args: {
		data: vehicleData,
		schema: createDetailSchema<IVehicleModel>()
			.title('Detalle del Modelo de Vehículo')
			.description('Implementación completa con renderizado multi-tipo y configuración avanzada')
			.defaultColumns({ xs: 1, md: 2, xl: 2, xxl: 2 })
			.section('Información General', s =>
				s
					.field('itemCode', 'Código', { copyable: true })
					.field('itemSuffix', 'Sufijo')
					.field('brandName', 'Marca')
					.badge('isActive', 'Estado')
					.field('itemDescription', 'Descripción', { span: 2 }),
			)
			.section('Especificaciones Técnicas', s =>
				s
					.columns({ xs: 1, md: 3 })
					.field('displacement', 'Cilindraje', {
						formatter: v => `${v} cc`,
						prefix: '',
					})
					.field('capacity', 'Capacidad', {
						formatter: v => `${v} personas`,
						prefix: '',
					})
					.field('transmissionDescription', 'Transmisión')
					.field('className', 'Clase')
					.field('subclassName', 'Subclase')
					.field('countryName', 'País de Origen'),
			)
			.section('Información Comercial', s =>
				s.field('ivaDescription', 'IVA'),
			)
			.section('Tabla de Intereses', s =>
				s.table('interestDetails', 'Tasas por Plazo', [
					{ key: 'modelYear', label: 'Año', align: 'center' },
					{
						key: 'interestRate',
						label: 'Tasa',
						suffix: '%',
						align: 'right',
					},
					{ key: 'quotaFrom', label: 'Cuota Desde', align: 'right' },
				]),
			)
			.section('Galería de Imágenes', s =>
				s.gallery('images', 'Fotos del Vehículo', {
					aspectRatio: '16/9',
					autoPlay: true,
					autoPlayInterval: 4000,
				}),
			)
			.build(),
		isLoading: false,
	},
};
