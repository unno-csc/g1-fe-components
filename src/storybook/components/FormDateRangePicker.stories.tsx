import type { Meta, StoryObj } from '@storybook/react';
import { Button, Space } from 'antd';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { FormDateRangePicker, IFormDateRangePickerProps } from '../../components/FormDateRangePicker';
import { EDateMaskFormat } from '../../enums';

const schema = z.object({
	range: z.string().min(1, 'Seleccione un rango de fechas'),
});
type FormValues = z.infer<typeof schema>;

const BoundFormDateRangePicker = (props: Omit<IFormDateRangePickerProps<FormValues>, 'control'>) => {
	const { control } = useFormContext<FormValues>();
	return <FormDateRangePicker<FormValues> {...props} control={control} />;
};

const RHFForm: React.FC<{
	children: React.ReactNode;
	defaultValues?: Partial<FormValues>;
	mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
}> = ({ children, defaultValues, mode = 'onBlur' }) => {
	const methods = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: { range: undefined, ...defaultValues },
		mode,
	});

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(() => {})} style={{ width: 420 }}>
				<Space direction="vertical" style={{ width: '100%' }} size="middle">
					{children}
					<Button htmlType="submit" type="primary">
						Enviar
					</Button>
				</Space>
			</form>
		</FormProvider>
	);
};

const meta: Meta<typeof BoundFormDateRangePicker> = {
	title: 'components/Form/FormDateRangePicker',
	component: BoundFormDateRangePicker,
	parameters: { layout: 'centered' },
	argTypes: {
		label: { control: 'text' },
		disabled: { control: 'boolean' },
	},
};
export default meta;

type Story = StoryObj<typeof BoundFormDateRangePicker>;

export const Default: Story = {
	name: 'Default',
	args: {
		name: 'range',
		label: 'Rango de fechas',
	},
	render: args => (
		<RHFForm defaultValues={{ range: undefined }}>
			<BoundFormDateRangePicker {...args} optional />
		</RHFForm>
	),
};

export const WithInitialValue: Story = {
	name: 'Con valor inicial ("inicio;fin")',
	args: {
		name: 'range',
		label: 'Rango de fechas',
	},
	render: args => (
		<RHFForm defaultValues={{ range: '2024-12-01;2024-12-15' }}>
			<BoundFormDateRangePicker {...args} />
		</RHFForm>
	),
};

export const Disabled: Story = {
	name: 'Deshabilitado',
	args: {
		name: 'range',
		label: 'Rango de fechas',
		disabled: true,
	},
	render: args => (
		<RHFForm defaultValues={{ range: undefined }}>
			<BoundFormDateRangePicker {...args} />
		</RHFForm>
	),
};

export const CustomFormat: Story = {
	name: 'Formato personalizado (DD/MM/YYYY)',
	args: {
		name: 'range',
		label: 'Rango de fechas',
		format: EDateMaskFormat.DDMMYYYY,
		placeholder: ['Desde', 'Hasta'],
	},
	render: args => (
		<RHFForm defaultValues={{ range: undefined }}>
			<BoundFormDateRangePicker {...args} />
		</RHFForm>
	),
};

export const ShowErrorOnSubmit: Story = {
	name: 'Error al enviar (validación Zod)',
	args: {
		name: 'range',
		label: 'Seleccione un rango de fechas',
	},
	render: args => (
		<RHFForm mode="onSubmit">
			<BoundFormDateRangePicker {...args} />
		</RHFForm>
	),
};
