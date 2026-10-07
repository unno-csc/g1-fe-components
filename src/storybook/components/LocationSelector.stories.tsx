import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
	LocationSelector,
	type ILocationSelectorProps,
} from '../../components/LocationSelector';

const countries = [{ label: 'Ecuador', value: 1 }];

const provinces = [
	{ label: 'Pichincha', value: 1, countryID: 1 },
	{ label: 'Guayas', value: 2, countryID: 1 },
];

const cantons = [
	{ label: 'Quito', value: 1, provinceID: 1 },
	{ label: 'Rumiñahui', value: 2, provinceID: 1 },
	{ label: 'Guayaquil', value: 3, provinceID: 2 },
	{ label: 'Durán', value: 4, provinceID: 2 },
];

const parishes = [
	{ label: 'Centro Histórico', value: 1, cantonID: 1 },
	{ label: 'La Mariscal', value: 2, cantonID: 1 },
	{ label: 'Sangolquí', value: 3, cantonID: 2 },
	{ label: 'Tarqui', value: 4, cantonID: 3 },
	{ label: 'Febres Cordero', value: 5, cantonID: 3 },
	{ label: 'El Recreo', value: 6, cantonID: 4 },
];

const LocationSelectorWrapper = (
	props: Partial<ILocationSelectorProps> & {
		containerWidth?: string | number;
	}
) => {
	const { containerWidth = '100%', ...rest } = props;
	const [countryId, setCountryId] = useState<number | undefined>(1);
	const [provinceId, setProvinceId] = useState<number | undefined>();
	const [cantonId, setCantonId] = useState<number | undefined>();
	const [parishId, setParishId] = useState<number | undefined>();

	const filteredProvinces = provinces.filter(
		item => item.countryID === countryId
	);
	const filteredCantons = cantons.filter(
		item => item.provinceID === provinceId
	);
	const filteredParishes = parishes.filter(
		item => item.cantonID === cantonId
	);

	return (
		<div
			style={{ maxWidth: containerWidth }}
			className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs flex flex-col gap-4"
		>
			<LocationSelector
				optionsCountries={countries}
				optionsProvinces={filteredProvinces}
				optionsCantons={filteredCantons}
				optionsParishes={filteredParishes}
				isLoadingCountries={false}
				isLoadingProvinces={false}
				isLoadingCantons={false}
				isLoadingParishes={false}
				onChangeCountry={(value: number) => {
					setCountryId(value);
					setProvinceId(undefined);
					setCantonId(undefined);
					setParishId(undefined);
				}}
				onChangeProvince={(value: number) => {
					setProvinceId(value);
					setCantonId(undefined);
					setParishId(undefined);
				}}
				onChangeCanton={(value: number) => {
					setCantonId(value);
					setParishId(undefined);
				}}
				onChangeParish={(value: number) => {
					setParishId(value);
				}}
				valueCountryId={countryId}
				valueProvinceId={provinceId}
				valueCantonId={cantonId}
				valueParishId={parishId}
				showProvince
				showCanton
				showParish
				allowClear
				{...rest}
			/>

			<div className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded p-2 flex flex-wrap gap-4">
				<span>País: <b>{countryId ?? '-'}</b></span>
				<span>Provincia: <b>{provinceId ?? '-'}</b></span>
				<span>Cantón: <b>{cantonId ?? '-'}</b></span>
				<span>Parroquia: <b>{parishId ?? '-'}</b></span>
			</div>
		</div>
	);
};

const meta: Meta<typeof LocationSelector> = {
	title: 'Components/LocationSelector',
	component: LocationSelector,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Selector en cascada de localización geográfica (País, Provincia, Cantón y Parroquia). Permite configurar de forma responsiva el ancho y distribución de columnas mediante la propiedad `colSpan` (ej. 4 columnas en desktop, 3 en lg, 2 en sm/md y 1 en móvil).',
			},
		},
	},
	argTypes: {
		colSpan: {
			control: 'object',
			description:
				'Configuración de columnas responsiva ({ xl: 4, lg: 3, sm: 2, xs: 1 }) o número de columnas fijo.',
		},
		gutter: {
			control: 'number',
			description: 'Espaciado entre columnas (gutter de Ant Design Row)',
		},
		showProvince: {
			control: 'boolean',
			description: 'Muestra el selector de provincia',
		},
		showCanton: {
			control: 'boolean',
			description: 'Muestra el selector de cantón',
		},
		showParish: {
			control: 'boolean',
			description: 'Muestra el selector de parroquia',
		},
		allowClear: {
			control: 'boolean',
			description: 'Permite limpiar la selección en los desplegables',
		},
	},
};

export default meta;
type Story = StoryObj<typeof LocationSelector>;

export const Default: Story = {
	name: 'Por defecto (2 columnas en desktop / 1 en móvil)',
	render: args => <LocationSelectorWrapper {...args} containerWidth={640} />,
};

export const ResponsiveFourThreeTwoOne: Story = {
	name: 'Responsivo 4 -> 3 -> 2 -> 1',
	render: () => (
		<div className="flex flex-col gap-2">
			<p className="text-xs text-gray-600 font-medium">
				4 columnas en desktop (xl), 3 en lg, 2 en sm/md y 1 en móvil (xs):
			</p>
			<LocationSelectorWrapper
				colSpan={{
					xl: 4,
					lg: 3,
					md: 2,
					sm: 2,
					xs: 1,
				}}
			/>
		</div>
	),
};

export const FourColumnsSingleRow: Story = {
	name: '4 Columnas en una sola fila (Desktop)',
	render: () => (
		<div className="flex flex-col gap-2">
			<p className="text-xs text-gray-600 font-medium">
				Distribución horizontal completa de 4 selectores (`colSpan={4}`):
			</p>
			<LocationSelectorWrapper colSpan={4} />
		</div>
	),
};

export const ThreeColumns: Story = {
	name: '3 Columnas (colSpan={3})',
	render: () => (
		<div className="flex flex-col gap-2">
			<p className="text-xs text-gray-600 font-medium">
				Distribución en cuadrícula de 3 columnas (`colSpan={3}`):
			</p>
			<LocationSelectorWrapper colSpan={3} />
		</div>
	),
};

export const WithErrors: Story = {
	name: 'Con errores de validación',
	render: () => (
		<LocationSelectorWrapper
			containerWidth={640}
			errorCountry="El país es requerido"
			errorProvince="Seleccione una provincia válida"
			errorCanton="Seleccione el cantón"
			errorParish="Seleccione la parroquia"
		/>
	),
};
