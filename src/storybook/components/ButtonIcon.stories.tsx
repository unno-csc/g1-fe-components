import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { ButtonIcon, type IButtonIconProps } from '../../components/ButtonIcon';

const ICON_OPTIONS = {
	delete: <DeleteOutlined />,
	edit: <EditOutlined />,
	plus: <PlusOutlined />,
} as const;

const meta: Meta<typeof ButtonIcon> = {
	title: 'Components/ButtonIcon',
	component: ButtonIcon,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component: 'Botón ícono con variantes de color (primary/secondary/success/warning/danger).',
			},
		},
	},
	argTypes: {
		type: {
			control: 'select',
			options: ['primary', 'secondary', 'success', 'warning', 'danger'],
			description: 'Variante visual del botón.',
		},
		title: { control: 'text', description: 'Tooltip nativo (atributo title).' },
		ariaLabel: { control: 'text', description: 'Accesibilidad (aria-label).' },
		icon: {
			control: 'select',
			options: Object.keys(ICON_OPTIONS),
			mapping: ICON_OPTIONS,
			description: 'Ícono a mostrar.',
		},
	},
	args: {
		type: 'secondary',
		title: 'Acción',
		ariaLabel: 'Acción',
		icon: 'delete' as unknown as IButtonIconProps['icon'],
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
	render: args => (
		<div className="flex items-center gap-3">
			<ButtonIcon {...args} type="primary" title="Primary" ariaLabel="Primary" icon={<PlusOutlined />} />
			<ButtonIcon {...args} type="secondary" title="Secondary" ariaLabel="Secondary" icon={<EditOutlined />} />
			<ButtonIcon {...args} type="success" title="Success" ariaLabel="Success" icon={<PlusOutlined />} />
			<ButtonIcon {...args} type="warning" title="Warning" ariaLabel="Warning" icon={<EditOutlined />} />
			<ButtonIcon {...args} type="danger" title="Danger" ariaLabel="Danger" icon={<DeleteOutlined color="white" style={{ color: 'white' }} />} />
		</div>
	),
};

