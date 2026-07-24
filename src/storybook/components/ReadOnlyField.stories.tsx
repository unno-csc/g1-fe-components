import type { StoryObj } from '@storybook/react';
import { ReadOnlyField } from '../../components/ReadOnlyField';

const meta = {
	title: 'Components/ReadOnlyField',
	component: ReadOnlyField,
	tags: ['autodocs'],
	argTypes: {
		type: {
			control: 'select',
			options: ['high', 'medium', 'low', 'info', 'success'],
		},
		descriptionPosition: {
			control: 'radio',
			options: ['bottom-label', 'bottom-value'],
		},
		customBorderColor: { control: 'color' },
		customBackgroundColor: { control: 'color' },
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: 'Proveedor',
		value: 'Global Parts Trading LLC',
	},
	render: args => (
		<div className="max-w-[360px] p-6">
			<ReadOnlyField {...args} />
		</div>
	),
};

export const Emphasized: Story = {
	args: {
		label: 'Total',
		value: '$ 1,240.50',
		emphasize: true,
	},
	render: args => (
		<div className="max-w-[360px] p-6">
			<ReadOnlyField {...args} />
		</div>
	),
};

export const EmptyDashed: Story = {
	args: {
		label: 'Referencia',
		value: '',
		placeholder: 'Sin referencia',
		dashed: true,
	},
	render: args => (
		<div className="max-w-[360px] p-6">
			<ReadOnlyField {...args} />
		</div>
	),
};

export const Variants: Story = {
	args: {
		label: 'Variantes',
	},
	render: () => (
		<div className="flex flex-col gap-4 max-w-[360px] p-6">
			<ReadOnlyField label="Alta (High)" value="Prioridad Alta" type="high" />
			<ReadOnlyField label="Media (Medium)" value="Prioridad Media" type="medium" />
			<ReadOnlyField label="Baja (Low)" value="Prioridad Baja (Default)" type="low" />
			<ReadOnlyField label="Informativa (Info)" value="Mensaje Informativo" type="info" />
			<ReadOnlyField label="Éxito (Success)" value="Operación Exitosa" type="success" />
		</div>
	),
};

export const WithDescription: Story = {
	args: {
		label: 'Descripciones',
	},
	render: () => (
		<div className="flex flex-col gap-4 max-w-[360px] p-6">
			<ReadOnlyField 
				label="Description Bottom Label" 
				value="Contenido Principal" 
				description="Esta descripción aparece debajo del label"
				descriptionPosition="bottom-label" 
			/>
			<ReadOnlyField 
				label="Description Bottom Value" 
				value="Contenido Principal" 
				description="Esta descripción aparece debajo del valor"
				descriptionPosition="bottom-value" 
			/>
		</div>
	),
};

export const CustomStyles: Story = {
	args: {
		label: 'Estilo Personalizado',
		value: 'Colores y tamaño custom',
		customBorderColor: '#8b5cf6', // Violet
		customBackgroundColor: '#ede9fe',
		width: '100%',
		height: '100px',
		description: 'Usando props de customización',
		descriptionPosition: 'bottom-value',
	},
	render: args => (
		<div className="w-full max-w-[600px] p-6">
			<ReadOnlyField {...args} />
		</div>
	),
};
