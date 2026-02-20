import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SelectorButtonList } from '../../components/SelectorButtonList';

const meta: Meta<typeof SelectorButtonList> = {
	title: 'Components/SelectorButtonList',
	component: SelectorButtonList,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component: 'Lista de botones seleccionables pensada para agrupar opciones rápidas en una sección compacta.',
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	name: 'Default',
	render: () => (
		<SelectorButtonList
			clickHandler={() => {}}
			buttons={[
				{ label: 'Button 1', value: 'button1' },
				{ label: 'Button 2', value: 'button2' },
				{ label: 'Button 3', value: 'button3' },
			]}
			notificationMessage="Tipo proveedor seleccionado"
			notificationType="success"
			showNotification={true}
		/>
	),
	parameters: {
		docs: {
			description: {
				story: 'Vista base del componente sin props adicionales.',
			},
		},
	},
};
