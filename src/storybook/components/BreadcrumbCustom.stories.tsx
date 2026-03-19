import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BreadcrumbCustom, IBreadcrumbCustomProps } from '../../components/BreadcrumbCustom';

const meta: Meta<typeof BreadcrumbCustom> = {
	title: 'Components/BreadcrumbCustom',
	component: BreadcrumbCustom,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: 'Componente de breadcrumb personalizado con botón de retroceso y información de título y descripción.',
			},
		},
	},
	argTypes: {
		title: {
			control: 'text',
			description: 'Título principal del breadcrumb',
		},
		description: {
			control: 'text',
			description: 'Descripción secundaria del breadcrumb',
		},
		action: {
			action: 'clicked',
			description: 'Función que se ejecuta al hacer clic en el botón de retroceso',
		},
		actionButtonDocumentation: {
			action: 'clicked',
			description: 'Función que se ejecuta al hacer clic en el botón de documentación',
		},
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	name: 'Default',
	args: {
		title: 'Mi Sección',
		description: 'Detalle del contenido',
		action: () => console.log('Navegando hacia atrás'),
		actionButtonDocumentation: () => console.log('Mostrando documentación'),
	},
};

export const LongTitle: Story = {
	name: 'Título Largo',
	args: {
		title: 'Gestión de Usuarios y Permisos del Sistema',
		description: 'Administración de roles y accesos',
		action: () => console.log('Navegando hacia atrás'),
	},
};

export const LongDescription: Story = {
	name: 'Descripción Larga',
	args: {
		title: 'Configuración',
		description: 'Configuración avanzada del sistema de gestión empresarial',
		action: () => console.log('Navegando hacia atrás'),
	},
};

export const BothLong: Story = {
	name: 'Título y Descripción Largos',
	args: {
		title: 'Administración de Proyectos y Tareas Empresariales',
		description: 'Gestión completa del ciclo de vida de proyectos y asignación de recursos',
		action: () => console.log('Navegando hacia atrás'),
	},
};

export const ShortText: Story = {
	name: 'Texto Corto',
	args: {
		title: 'Home',
		description: 'Inicio',
		action: () => console.log('Navegando hacia atrás'),
	},
};
