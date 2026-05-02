import type { StoryObj } from '@storybook/react';
import { ReadOnlyField } from '../../components/ReadOnlyField';

const meta = {
	title: 'Components/ReadOnlyField',
	component: ReadOnlyField,
	tags: ['autodocs'],
	argTypes: {},
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: 'Proveedor',
		value: 'Global Parts Trading LLC',
	},
	render: args => (
		<div className="max-w-[360px] p-6">
			<ReadOnlyField {...args} />
		</div>
	),
};

export const Emphasized: Story = {
	args: {
		label: 'Total',
		value: '$ 1,240.50',
		emphasize: true,
	},
	render: args => (
		<div className="max-w-[360px] p-6">
			<ReadOnlyField {...args} />
		</div>
	),
};

export const EmptyDashed: Story = {
	args: {
		label: 'Referencia',
		value: '',
		placeholder: 'Sin referencia',
		dashed: true,
	},
	render: args => (
		<div className="max-w-[360px] p-6">
			<ReadOnlyField {...args} />
		</div>
	),
};
