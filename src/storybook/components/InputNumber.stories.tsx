import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { InputNumber, InputNumberProps } from '../../components/InputNumber';

const meta: Meta<InputNumberProps> = {
	title: 'Components/InputNumber',
	component: InputNumber,
	tags: ['autodocs'],
	parameters: { layout: 'centered' },
	args: {
		placeholder: 'Ingrese un monto',
		prefix: '$',
	},
};

export default meta;
type Story = StoryObj<InputNumberProps>;

const Controlled = (args: InputNumberProps) => {
	const [value, setValue] = React.useState<number | null>(null);
	return <InputNumber {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
	render: args => <Controlled {...args} />,
};

export const Loading: Story = {
	args: { loading: true },
	render: args => <Controlled {...args} />,
};

export const Disabled: Story = {
	args: { disabled: true },
	render: args => <Controlled {...args} />,
};
