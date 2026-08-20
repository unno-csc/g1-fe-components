import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TreeSelect, ITreeSelectProps } from '../../components/TreeSelect';

const treeData = [
	{
		title: 'Vehículos',
		value: 'vehiculos',
		children: [
			{ title: 'Autos', value: 'autos' },
			{ title: 'Motos', value: 'motos' },
		],
	},
	{
		title: 'Repuestos',
		value: 'repuestos',
		children: [
			{ title: 'Frenos', value: 'frenos' },
			{ title: 'Motor', value: 'motor' },
		],
	},
];

const meta: Meta<ITreeSelectProps> = {
	title: 'Components/TreeSelect',
	component: TreeSelect,
	tags: ['autodocs'],
	parameters: { layout: 'centered' },
	args: {
		treeData,
		placeholder: 'Selecciona una opción',
		showSearch: true,
		treeDefaultExpandAll: true,
		style: { width: 320 },
	},
};

export default meta;
type Story = StoryObj<ITreeSelectProps>;

const Controlled = (args: ITreeSelectProps) => {
	const [value, setValue] = React.useState<string | undefined>();
	return <TreeSelect {...args} value={value} onChange={val => setValue(val as string)} />;
};

export const Default: Story = {
	render: args => <Controlled {...args} />,
};
