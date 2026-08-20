import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Radio, type TRadioChangeEvent } from '../../components/Radio/Radio';

const meta: Meta<typeof Radio> = {
	title: 'Components/Form/Radio',
	component: Radio,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Componente Radio basado en Ant Design adaptado al Design System de Motor1. Soporta el uso como `<Radio>`, `<Radio.Group>` y `<Radio.Button>`.',
			},
		},
	},
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'warning'],
			description: 'Variante de color del radio button',
		},
		disabled: {
			control: 'boolean',
			description: 'Deshabilita la interacción',
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultWithChildren: Story = {
	render: () => {
		const InteractiveGroup = () => {
			const [consignmentValue, setConsignmentValue] = useState<boolean>(false);

			const handleChangeConsignment = (e: TRadioChangeEvent) => {
				setConsignmentValue(e.target.value);
			};

			return (
				<div className="flex flex-col gap-2 max-w-sm p-4 bg-white-100 rounded-lg shadow-sm border border-gray-100">
					<span className="text-sm font-medium text-gray-800">Tipo de Pedido</span>
					<Radio.Group
						value={consignmentValue}
						onChange={handleChangeConsignment}
						className="mt-1"
					>
						<Radio value={false}>Venta Normal</Radio>
						<Radio value={true}>Consignación</Radio>
					</Radio.Group>
					<span className="text-xs text-gray-500 mt-2">
						Valor seleccionado: <strong>{consignmentValue ? 'Consignación' : 'Venta Normal'}</strong>
					</span>
				</div>
			);
		};

		return <InteractiveGroup />;
	},
};

export const WithOptions: Story = {
	render: () => {
		const OptionsExample = () => {
			const [value, setValue] = useState<string>('apple');

			const options = [
				{ label: 'Manzana', value: 'apple' },
				{ label: 'Pera', value: 'pear' },
				{ label: 'Naranja', value: 'orange' },
			];

			return (
				<div className="flex flex-col gap-2 p-4">
					<span className="text-sm font-medium text-gray-800">Seleccione una fruta:</span>
					<Radio.Group
						options={options}
						value={value}
						onChange={(e: TRadioChangeEvent) => setValue(e.target.value)}
					/>
				</div>
			);
		};

		return <OptionsExample />;
	},
};

export const RadioButtons: Story = {
	render: () => {
		const ButtonGroupExample = () => {
			const [size, setSize] = useState<string>('m');

			return (
				<div className="flex flex-col gap-2 p-4">
					<span className="text-sm font-medium text-gray-800">Tamaño de Vehículo:</span>
					<Radio.Group
						value={size}
						onChange={(e: TRadioChangeEvent) => setSize(e.target.value)}
						buttonStyle="solid"
					>
						<Radio.Button value="s">Pequeño (S)</Radio.Button>
						<Radio.Button value="m">Mediano (M)</Radio.Button>
						<Radio.Button value="l">Grande (L)</Radio.Button>
					</Radio.Group>
				</div>
			);
		};

		return <ButtonGroupExample />;
	},
};

export const SingleRadio: Story = {
	render: () => {
		const SingleExample = () => {
			const [checked, setChecked] = useState<boolean>(false);

			return (
				<div className="p-4">
					<Radio
						checked={checked}
						onChange={(e: TRadioChangeEvent) => setChecked(e.target.checked)}
					>
						Acepto los términos y condiciones
					</Radio>
				</div>
			);
		};

		return <SingleExample />;
	},
};

export const DisabledStates: Story = {
	render: () => (
		<div className="flex flex-col gap-4 p-4">
			<div>
				<p className="text-sm font-semibold mb-2">Grupo Deshabilitado:</p>
				<Radio.Group disabled defaultValue="a">
					<Radio value="a">Opción A</Radio>
					<Radio value="b">Opción B</Radio>
				</Radio.Group>
			</div>
			<div>
				<p className="text-sm font-semibold mb-2">Opción Individual Deshabilitada:</p>
				<Radio.Group defaultValue="active">
					<Radio value="active">Activo</Radio>
					<Radio value="disabled" disabled>
						Inactivo (Deshabilitado)
					</Radio>
				</Radio.Group>
			</div>
		</div>
	),
};

export const WarningVariant: Story = {
	render: () => (
		<div className="flex flex-col gap-2 p-4">
			<span className="text-sm font-medium text-gray-800">Variante Warning:</span>
			<Radio.Group variant="warning" defaultValue="alert">
				<Radio value="normal">Normal</Radio>
				<Radio value="alert">Alerta</Radio>
			</Radio.Group>
		</div>
	),
};
