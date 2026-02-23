import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LocationSelector } from '../../components/LocationSelector';

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
	{ label: 'Centro Historico', value: 1, cantonID: 1 },
	{ label: 'La Mariscal', value: 2, cantonID: 1 },
	{ label: 'Sangolqui', value: 3, cantonID: 2 },
	{ label: 'Tarqui', value: 4, cantonID: 3 },
	{ label: 'Febres Cordero', value: 5, cantonID: 3 },
	{ label: 'El Recreo', value: 6, cantonID: 4 },
];

const BasicEcuadorSelector = () => {
	const [countryId, setCountryId] = React.useState<number | undefined>(1);
	const [provinceId, setProvinceId] = React.useState<number | undefined>();
	const [cantonId, setCantonId] = React.useState<number | undefined>();
	const [parishId, setParishId] = React.useState<number | undefined>();
	const [otherCountryDescription, setOtherCountryDescription] = React.useState('');

	const filteredProvinces = provinces.filter(item => item.countryID === countryId);
	const filteredCantons = cantons.filter(item => item.provinceID === provinceId);
	const filteredParishes = parishes.filter(item => item.cantonID === cantonId);

	return (
		<div style={{ maxWidth: 320 }} className='bg-gray-250 border border-gray-300 rounded-md p-4'>
			<div style={{ marginBottom: 12 }}>Selecciona Ecuador, luego provincia, canton y parroquia.</div>
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
				onChangeOtherCountryDescription={setOtherCountryDescription}
				otherCountryDescription={otherCountryDescription}
				showProvince
				showCanton
				showParish
				allowClear={false}
			/>
			<div style={{ marginTop: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
				<div>Pais: {countryId ?? '-'}</div>
				<div>Provincia: {provinceId ?? '-'}</div>
				<div>Canton: {cantonId ?? '-'}</div>
				<div>Parroquia: {parishId ?? '-'}</div>
			</div>
		</div>
	);
};

const meta: Meta<typeof LocationSelector> = {
	title: 'Components/LocationSelector',
	component: LocationSelector,
};

export default meta;
type Story = StoryObj<typeof LocationSelector>;

export const EcuadorBasico: Story = {
	render: () => <BasicEcuadorSelector />,
};
