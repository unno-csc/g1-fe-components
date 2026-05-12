import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FilterInput, type IFilterInputProps } from '../../components/FilterInput';

const meta: Meta<IFilterInputProps> = {
	title: 'components/FilterInput',
	component: FilterInput,
	parameters: { layout: 'padded' },
	argTypes: {
		placeholder: { control: 'text' },
		searchTrigger: {
			control: 'radio',
			options: ['change', 'enter'],
		},
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		title: 'Filtrar',
		placeholder: 'Filtrar...',
	},
	render: args => (
		<div style={{ width: 360 }}>
			<FilterInput {...args} />
		</div>
	),
};

export const LocalFiltering: Story = {
	name: 'Filtro local con onChange',
	render: () => {
		const [value, setValue] = useState('');

		return (
			<div style={{ width: 360 }}>
				<FilterInput
					title="Filtrar"
					placeholder="Escribe para filtrar localmente"
					value={value}
					onChange={e => setValue(e.target.value)}
				/>
			</div>
		);
	},
};

export const SearchOnEnter: Story = {
	name: 'Búsqueda con Enter',
	args: {
		title: 'Buscar',
		placeholder: 'Presiona Enter para buscar',
		searchTrigger: 'enter',
	},
	render: args => (
		<div style={{ width: 360 }}>
			<FilterInput {...args} onSearch={() => {}} />
		</div>
	),
};

export const WithoutPlaceholder: Story = {
	name: 'Sin placeholder',
	render: () => (
		<div style={{ width: 360 }}>
			<FilterInput title="Filtrar" value="" onChange={() => {}} />
		</div>
	),
};
