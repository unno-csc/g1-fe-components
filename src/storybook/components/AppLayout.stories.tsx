import React from 'react';
import type { StoryObj } from '@storybook/react';
import { AppLayout } from '../../components/AppLayout';

const meta = {
	title: 'Components/AppLayout',
	component: AppLayout,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'Componente de layout principal de la aplicación.',
			},
		},
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: <div>Hello World</div>,
		navigateApp: () => {},
		loadingAppLayout: false,
		onClickOptionMenu: () => {},
	},
};
