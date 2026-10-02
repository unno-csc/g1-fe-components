import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FilterInputDatePicker, type IFilterInputDatePickerProps } from '../../components/FilterInputDatePicker';

const meta: Meta<IFilterInputDatePickerProps> = {
	title: 'components/Filters/FilterInputDatePicker',
	component: FilterInputDatePicker,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Selector de fecha optimizado para barras de filtros (`FilterContainer`). Cuenta con altura normalizada (32px / `max-h-8`), bordes redondeados (`rounded-lg`), soporte para formateo, picker de mes/año y resaltado visual cuando tiene un valor seleccionado.',
			},
		},
	},
	argTypes: {
		label: { control: 'text', description: 'Etiqueta superior del campo de filtro' },
		title: { control: 'text', description: 'Título alternativo (retrocompatibilidad)' },
		placeholder: { control: 'text', description: 'Texto de marcador de posición' },
		format: { control: 'text', description: 'Formato de fecha (ej. YYYY-MM-DD, DD/MM/YYYY, MM/YYYY)' },
		disabled: { control: 'boolean', description: 'Deshabilita la interacción' },
		picker: {
			control: 'select',
			options: ['date', 'month', 'year', 'quarter', 'week'],
			description: 'Tipo de selector temporal',
		},
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	name: 'Por defecto (Fecha)',
	args: {
		placeholder: 'Seleccione fecha',
		format: 'YYYY-MM-DD',
	},
	render: args => (
		<div className="max-w-xs">
			<FilterInputDatePicker {...args} />
		</div>
	),
};

export const WithLabel: Story = {
	name: 'Con etiqueta (label)',
	args: {
		label: 'Fecha desde',
		placeholder: 'DD/MM/YYYY',
		format: 'DD/MM/YYYY',
	},
	render: args => (
		<div className="max-w-xs">
			<FilterInputDatePicker {...args} />
		</div>
	),
};

export const MonthPicker: Story = {
	name: 'Selector de período (Mes y Año)',
	args: {
		label: 'Período',
		placeholder: 'Seleccione mes y año',
		picker: 'month',
		format: 'MM/YYYY',
	},
	render: args => (
		<div className="max-w-xs">
			<FilterInputDatePicker {...args} />
		</div>
	),
};

export const WithValue: Story = {
	name: 'Con valor seleccionado (resaltado)',
	render: () => {
		const [date, setDate] = useState<string>('2026-10-02');
		return (
			<div className="flex flex-col gap-2 max-w-xs">
				<FilterInputDatePicker
					label="Fecha de visita"
					value={date}
					onChange={setDate}
					placeholder="Seleccione fecha"
				/>
				<p className="text-xs text-gray-500">Valor actual: {date || '(limpio)'}</p>
			</div>
		);
	},
};
