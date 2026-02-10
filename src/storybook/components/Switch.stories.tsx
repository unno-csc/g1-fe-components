import type { StoryObj } from '@storybook/react';
import { Switch } from '../../components/Switch/Switch';

const meta = {
	title: 'Components/Form/Switch',
	component: Switch,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'Component Switch usando Ant Design.\n\n👉 [Ver documentación oficial](https://ant.design/components/Switch)',
			},
		},
	},
	argTypes: {
		checkedLabel: {
			control: 'text',
			description: 'Label que se muestra cuando el switch está encendido',
		},
		uncheckedLabel: {
			control: 'text',
			description: 'Label que se muestra cuando el switch está apagado',
		},
		activeBgColor: {
			control: 'color',
			description: 'Color de fondo cuando el switch está encendido',
		},
		inactiveBgColor: {
			control: 'color',
			description: 'Color de fondo cuando el switch está apagado',
		},
		size: {
			control: 'select',
			options: ['small', 'default'],
			description: 'Tamaño del switch',
		},
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		checkedLabel: 'Si',
		uncheckedLabel: 'No',
		size: 'default',
		
	},
};

export const WithCustomColors: Story = {
	args: {
		activeBgColor: '#52c41a',
		inactiveBgColor: '#d9d9d9',
		checkedLabel: 'Si',
		uncheckedLabel: 'No',
		size: 'default',
	},
};

export const WithPrimaryColors: Story = {
	args: {
		activeBgColor: '#000000',
		inactiveBgColor: '#D9DFE3',
	},
};