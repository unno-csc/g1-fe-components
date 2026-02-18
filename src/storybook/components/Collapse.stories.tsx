import type { StoryObj } from '@storybook/react';
import { Collapse } from '../../components/Collapse/Collapse';

const meta = {
	title: 'Components/Collapse',
	component: Collapse,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'Component Collapse usando Ant Design con soporte para variantes.\n\n' +
					'**Variantes disponibles:**\n' +
					'- `default`: Estilo compacto estándar\n' +
					'- `card`: Paneles individuales con estilo de tarjeta, separación y sombras\n\n' +
					'👉 [Ver documentación oficial](https://ant.design/components/Collapse)',
			},
		},
	},
	argTypes: {
		variant: {
			control: { type: 'select' },
			options: ['default', 'card'],
			description: 'Variante visual del Collapse',
			table: {
				type: { summary: 'string' },
				defaultValue: { summary: 'default' },
			},
		},
		showSteps: {
			control: { type: 'boolean' },
			description: 'Mostrar indicador de pasos (solo para variant="card")',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		defaultActiveKey: 1,
		onChange: (key: string | string[]) => {
			console.log(key);
		},
		items: [
			{
				key: '1',
				label: 'This is panel header 1',
				children: <p>text 1</p>,
			},
			{
				key: '2',
				label: 'This is panel header 2',
				children: <p>text 2</p>,
			},
			{
				key: '3',
				label: 'This is panel header 3',
				children: <p>text 3</p>,
			},
		],
	},
};

export const CardVariant: Story = {
	args: {
		variant: 'card',
		showSteps: true,
		defaultActiveKey: ['1'],
		items: [
			{
				key: '1',
				label: 'Información General',
				children: (
					<div>
						<p className="mb-2">
							<strong>Documento Identidad:</strong> 1234567890
						</p>
						<p className="mb-2">
							<strong>Nombre:</strong> Carlos Alberto
						</p>
						<p className="mb-2">
							<strong>Apellido:</strong> Mendoza García
						</p>
						<p>
							<strong>Email:</strong> carlos.mendoza@ejemplo.com
						</p>
					</div>
				),
			},
			{
				key: '2',
				label: 'Información de Contacto',
				children: (
					<div>
						<p className="mb-2">
							<strong>Teléfono:</strong> +593 98 765 4321
						</p>
						<p className="mb-2">
							<strong>Dirección:</strong> Av. Principal 123
						</p>
						<p>
							<strong>Ciudad:</strong> Quito
						</p>
					</div>
				),
			},
			{
				key: '3',
				label: 'Información Adicional',
				children: (
					<div>
						<p className="mb-2">
							<strong>Agencia:</strong> Cuenca
						</p>
						<p className="mb-2">
							<strong>Vendedor:</strong> Juan Pérez
						</p>
						<p>
							<strong>Tipo Persona:</strong> Natural
						</p>
					</div>
				),
			},
		],
	},
};

export const CardVariantMultiple: Story = {
	args: {
		variant: 'card',
		showSteps: true,
		accordion: false,
		items: [
			{
				key: '1',
				label: 'Sección A - Información General',
				children: <p>Contenido con información general de la aplicación y configuraciones básicas.</p>,
			},
			{
				key: '2',
				label: 'Sección B - Detalles Técnicos',
				children: <p>Especificaciones técnicas, versiones y dependencias del sistema.</p>,
			},
			{
				key: '3',
				label: 'Sección C - Documentación',
				children: <p>Enlaces a documentación, guías de uso y recursos adicionales para desarrolladores.</p>,
			},
			{
				key: '4',
				label: 'Sección D - Soporte',
				children: <p>Información de contacto, canales de soporte y recursos de ayuda disponibles.</p>,
			},
		],
	},
};
