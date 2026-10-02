import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SearchOutlined } from '@ant-design/icons';
import { InputSearch, type IInputSearchProps } from '../../components/InputSearch';

const meta: Meta<IInputSearchProps> = {
	title: 'components/InputSearch',
	component: InputSearch,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Componente de búsqueda InputSearch alineado al Design System y a FormInput. Soporta allowClear correctamente posicionado, indicador de carga (loading), FormLabel, FormLabelError y transformación de texto.',
			},
		},
	},
	argTypes: {
		label: { control: 'text', description: 'Etiqueta superior alineada con FormLabel' },
		title: { control: 'text', description: 'Título alternativo (retrocompatibilidad)' },
		placeholder: { control: 'text', description: 'Texto de marcador de posición' },
		allowClear: { control: 'boolean', description: 'Permite limpiar el contenido con icono' },
		loading: { control: 'boolean', description: 'Muestra indicador de carga en el sufijo' },
		disabled: { control: 'boolean', description: 'Deshabilita la interacción' },
		optional: { control: 'boolean', description: 'Muestra indicador de campo opcional en la etiqueta' },
		error: { control: 'text', description: 'Mensaje de error con FormLabelError y estado error' },
		textTransform: {
			control: 'select',
			options: ['none', 'uppercase', 'lowercase', 'capitalize'],
			description: 'Transformación de texto aplicada al valor',
		},
		searchTrigger: {
			control: 'select',
			options: ['both', 'change', 'enter'],
			description: 'Disparador del callback onSearch',
		},
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	name: 'Por defecto (con allowClear)',
	args: {
		label: 'Buscar cliente',
		placeholder: 'Escribe para buscar...',
		defaultValue: 'Empresa ABC',
		allowClear: true,
	},
	render: args => (
		<div className="max-w-md">
			<InputSearch {...args} />
		</div>
	),
};

export const WithAllowClear: Story = {
	name: 'Demostración de allowClear',
	render: () => {
		const [val, setVal] = useState<string>('Texto de prueba inicial');
		return (
			<div className="flex flex-col gap-3 max-w-md">
				<InputSearch
					label="Búsqueda con limpieza rápida"
					value={val}
					allowClear
					onChange={e => setVal(e.target.value)}
					placeholder="Ingresa texto para ver el botón de limpiar"
				/>
				<p className="text-xs text-gray-500">Valor actual: &quot;{val}&quot;</p>
			</div>
		);
	},
};

export const WithLoading: Story = {
	name: 'Estado de carga (loading)',
	args: {
		label: 'Búsqueda remota',
		defaultValue: 'Consultando datos...',
		loading: true,
		allowClear: true,
	},
	render: args => (
		<div className="max-w-md">
			<InputSearch {...args} />
		</div>
	),
};

export const WithLabelAndError: Story = {
	name: 'Alineado a FormInput (con error)',
	args: {
		label: 'Número de identificación',
		placeholder: 'Ingresa 10 o 13 dígitos',
		error: 'No se encontraron resultados para la identificación proporcionada',
		allowClear: true,
	},
	render: args => (
		<div className="max-w-md">
			<InputSearch {...args} />
		</div>
	),
};

export const WithCustomSuffix: Story = {
	name: 'Con icono sufijo personalizado',
	args: {
		label: 'Buscar producto',
		placeholder: 'Buscar por código o descripción...',
		allowClear: true,
		suffix: <SearchOutlined className="text-gray-400" />,
	},
	render: args => (
		<div className="max-w-md">
			<InputSearch {...args} />
		</div>
	),
};

export const WithSearchHandler: Story = {
	name: 'Con onSearch interactivo',
	render: () => {
		const [message, setMessage] = useState<string>('');
		const [loading, setLoading] = useState<boolean>(false);

		const handleSearch = (v: string) => {
			if (!v) {
				setMessage('');
				return;
			}
			setLoading(true);
			setTimeout(() => {
				setMessage(`Resultados para: "${v}"`);
				setLoading(false);
			}, 800);
		};

		return (
			<div className="flex flex-col gap-2 max-w-md">
				<InputSearch
					label="Búsqueda con callback asíncrono"
					placeholder="Escribe y presiona Enter o escribe para buscar"
					allowClear
					loading={loading}
					onSearch={handleSearch}
				/>
				<div className="text-xs text-primary-600 font-medium min-h-5">{message}</div>
			</div>
		);
	},
};
