import React from 'react';
import type { StoryObj } from '@storybook/react';
import { ButtonWithIcon } from '../../components/ButtonWithIcon';
import { SearchOutlined } from '@ant-design/icons';

const meta = {
	title: 'Components/ButtonWithIcon',
	component: ButtonWithIcon,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		size: {
			control: 'select',
			options: ['small', 'middle', 'large'],
			description: 'Tamaño del botón',
		},
		type: {
			control: 'select',
			options: ['primary', 'secondary', 'danger', 'text'],
			description: 'Estilo del botón',
		},
		default: {
			control: 'boolean',
			description: 'Solo aplica en type="secondary".',
		},
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: 'Button With Icon',
		type: 'primary',
		icon: <SearchOutlined />,
	},
	render: (args) => {
		return (
			<div className="flex flex-col gap-4 p-4 items-start">
				<ButtonWithIcon {...args} />
			</div>
		);
	},
};

export const Variants: Story = {
	render: () => {
		return (
			<div className="flex flex-col gap-4 p-4 items-start">
				<ButtonWithIcon label="Primary" type="primary" icon={<SearchOutlined />} />
				<ButtonWithIcon label="Secondary" type="secondary" icon={<SearchOutlined />} />
				<ButtonWithIcon label="Danger" type="danger" icon={<SearchOutlined />} />
				<ButtonWithIcon label="Icon Only" type="primary" icon={<SearchOutlined />} />
			</div>
		);
	},
};
