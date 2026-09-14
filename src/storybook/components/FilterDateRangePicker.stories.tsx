import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FilterDateRangePicker, FilterDateRangePickerProps } from '../../components/FilterDateRangePicker';

const ControlledFilterDateRangePicker = (props: FilterDateRangePickerProps) => {
	const [value, setValue] = useState(props.value);
	return <FilterDateRangePicker {...props} value={value} onChange={setValue} />;
};

const meta: Meta<typeof ControlledFilterDateRangePicker> = {
	title: 'components/Filter/FilterDateRangePicker',
	component: ControlledFilterDateRangePicker,
	parameters: { layout: 'centered' },
	argTypes: {
		title: { control: 'text' },
	},
};
export default meta;

type Story = StoryObj<typeof ControlledFilterDateRangePicker>;

export const Default: Story = {
	name: 'Default',
	args: {
		title: 'Fecha de creación',
	},
};

export const WithInitialValue: Story = {
	name: 'Con valor inicial ("inicio;fin")',
	args: {
		title: 'Fecha de creación',
		value: '2026-01-01;2026-01-31',
	},
};

export const CustomFormat: Story = {
	name: 'Formato personalizado (DD/MM/YYYY)',
	args: {
		title: 'Fecha de nacimiento',
		format: 'DD/MM/YYYY',
		value: '01/01/2026;31/01/2026',
	},
};
