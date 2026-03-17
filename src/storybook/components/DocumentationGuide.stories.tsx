import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DocumentationGuide } from '../../components/DocumentationGuide';

const meta: Meta<typeof DocumentationGuide> = {
	title: 'Components/DocumentationGuide',
	component: DocumentationGuide,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'Plantilla reutilizable para documentar pantallas o modulos con estructura fija, imagen por seccion y galeria final con preview ampliado al hacer click.',
			},
		},
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		title: 'Guia de uso de Kardex',
		description:
			'En esta seccion encontraras una explicacion sencilla sobre para que sirve esta pantalla y como utilizarla en la consulta de movimientos de inventario.',
		subjectName: 'Kardex',
		documentationBasePath: '/src/assets/documentation',
		sections: {
			overview: {
				content: [
					'Kardex es una pantalla de consulta que te permite revisar el historial de movimientos de un producto dentro del inventario.',
					'Aqui puedes identificar en que fechas tuvo movimientos un item, en que bodega se consultan esos datos y que cantidades estuvieron involucradas.',
				],
				images: ['kardex.png'],
			},
			purpose: {
				content: [
					'Te ayuda a consultar la trazabilidad de un producto y a entender sus entradas y salidas de inventario.',
					'Tambien sirve para confirmar en que bodega estas revisando la informacion y validar rapidamente los datos principales del item seleccionado.',
				],
				images: ['kardex.png'],
			},
			usage: {
				content: [
					'1. Usa el buscador para encontrar el producto que deseas consultar.',
					'2. Revisa la informacion general del item para confirmar que seleccionaste el producto correcto.',
					'3. Selecciona la agencia y luego la bodega donde deseas revisar el historial.',
					'4. Una vez elegida la bodega, el sistema mostrara los movimientos disponibles del producto.',
					'5. Puedes cambiar de pestana para revisar movimientos generales del kardex o consultar seriales relacionados con el item.',
				],
				images: ['kardex.png'],
			},
			information: {
				content: [
					'Resumen del producto seleccionado, como codigo, descripcion y datos complementarios.',
					'Listado de movimientos del item con fecha, tipo de movimiento y cantidad.',
					'Consulta de seriales asociados al producto cuando el item maneja este tipo de control.',
				],
				images: ['kardex.png'],
			},
			recommendations: {
				content: [
					'Si no ves resultados, primero verifica que el producto y la bodega esten correctamente seleccionados.',
					'Usa la informacion del encabezado para confirmar que estas consultando la ubicacion correcta.',
					'Si necesitas revisar un serial en particular, utiliza la pestana de seriales para localizarlo mas rapido.',
				],
				images: ['kardex.png'],
			},
		},
		additionalImagesTitle: 'Referencias visuales',
		additionalImagesDescription: 'Imagenes adicionales para complementar la documentacion.',
		additionalImages: ['kardex.png', 'kardex.png'],
	},
};
