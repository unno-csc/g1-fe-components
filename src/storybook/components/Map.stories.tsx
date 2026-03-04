import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Map } from '../../components/Map';
import { EMapZoom } from '../../enums';
import { LOCATION_DEFAULT } from '../../constants';
import { GOOGLE_API_KEY, GOOGLE_MAP_ID } from '../../utils/constants';
import { IMapSelection } from '../../interfaces';

type MapProps = React.ComponentProps<typeof Map>;

const zoomOptions = Object.values(EMapZoom).filter(
	(value): value is number => typeof value === 'number'
);

const meta: Meta<typeof Map> = {
	title: 'Components/Map',
	component: Map,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'Mapa basado en Google Maps usando @vis.gl/react-google-maps. Requiere la variable de entorno VITE_GOOGLE_MAPS_API_KEY.',
			},
		},
	},
	argTypes: {
		location: {
			control: 'object',
			description: 'Coordenadas lat/lng para centrar el mapa.',
		},
		zoom: {
			control: 'select',
			options: zoomOptions,
			description: 'Nivel de zoom inicial (1-20).',
		},
		mapId: {
			control: 'text',
			description: 'ID opcional de mapa de Google para estilos.',
		},
		googleMapsApiKey: {
			control: false,
			table: { disable: true },
			description: 'Usa la variable de entorno VITE_GOOGLE_MAPS_API_KEY.',
		},
		onLocationChange: {
			control: 'object',
			description: 'Función para manejar el cambio de ubicación.',
		},
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

const renderMap = (args: MapProps) => {
	if (!GOOGLE_API_KEY) {
		return (
			<div className="flex flex-col h-[50vh] items-center justify-center p-4">
				<strong>No se puede cargar el mapa.</strong>
				<p style={{ marginTop: 8 }}>
					Define la variable de entorno <code>VITE_GOOGLE_MAPS_API_KEY</code> para visualizar Google Maps en Storybook.
				</p>
			</div>
		);
	}

	return (
		<div className="flex-1 h-[60vh] w-full">
			<Map {...args} />
		</div>
	);
};

export const Default: Story = {
	name: 'Default',
	args: {
		location: LOCATION_DEFAULT,
		zoom: EMapZoom.zoom14,
		googleMapsApiKey: GOOGLE_API_KEY,
		mapId: GOOGLE_MAP_ID,
		onLocationChange: (mapPoint: IMapSelection | null) => {
			console.log('Mapa clickeado con dirección:', mapPoint);
		},
	},
	render: renderMap,
};

export const CustomLocation: Story = {
	name: 'Custom location',
	args: {
		location: {
			lat: -0.180653,
			lng: -78.467834,
		},
		zoom: EMapZoom.zoom12,
		googleMapsApiKey: GOOGLE_API_KEY,
		mapId: GOOGLE_MAP_ID,
		onLocationChange: (mapPoint: IMapSelection | null) => {
			console.log('Mapa clickeado con dirección:', mapPoint);
		},
	},
	render: renderMap,
};
