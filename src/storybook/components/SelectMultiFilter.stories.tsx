import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SelectMultiFilter } from '../../components/SelectMultiFilter';
import { SelectMultiFilterProps } from '../../interfaces';

type Person = { id: number; name: string; document: string; city: string };

const allData: Person[] = [
	{ id: 1, name: 'Jim Green', document: '0102030405', city: 'Quito' },
	{ id: 2, name: 'Joe Black', document: '0203040506', city: 'Guayaquil' },
	{ id: 3, name: 'John Smith', document: '0304050607', city: 'Cuenca' },
	{ id: 4, name: 'Sarah Davis', document: '0405060708', city: 'Ambato' },
];

const meta: Meta<SelectMultiFilterProps<Person>> = {
	title: 'Components/SelectMultiFilter',
	component: SelectMultiFilter,
	tags: ['autodocs'],
	parameters: { layout: 'centered' },
	args: {
		fields: [
			{ key: 'name', label: 'Nombre', placeholder: 'Buscar por nombre' },
			{ key: 'document', label: 'Documento', placeholder: 'Buscar por documento' },
			{ key: 'city', label: 'Ciudad', placeholder: 'Buscar por ciudad' },
		],
		valueKey: 'id' as any,
		placeholder: 'Seleccione una persona...',
	},
};

export default meta;
type Story = StoryObj<SelectMultiFilterProps<Person>>;

const Controlled = (args: SelectMultiFilterProps<Person>) => {
	const [value, setValue] = React.useState<Person | null>(null);
	const [data, setData] = React.useState<Person[]>(allData);

	return (
		<div style={{ width: 420 }}>
			<SelectMultiFilter
				{...args}
				data={data}
				value={value}
				onSelect={item => setValue(item)}
				onClear={() => setValue(null)}
				onFiltersChange={filters => {
					const term = Object.values(filters).join('').toLowerCase();
					setData(
						allData.filter(person =>
							`${person.name}${person.document}${person.city}`.toLowerCase().includes(term),
						),
					);
				}}
			/>
		</div>
	);
};

export const Default: Story = {
	render: args => <Controlled {...args} />,
};
