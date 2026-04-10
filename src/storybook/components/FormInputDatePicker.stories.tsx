import type { Meta, StoryObj } from '@storybook/react';
import { Button, Space } from 'antd';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { FormInputDatePicker, IInputProps } from '@/components/FormInputDatePicker';
import { EDateMaskFormat } from '@/enums';

const schema = z.object({
	date: z.string({ required_error: 'Seleccione una fecha' }).min(1, 'Seleccione una fecha'),
});
type FormValues = z.infer<typeof schema>;

const BoundFormInputDatePicker = (props: Omit<IInputProps<FormValues>, 'control'>) => {
	const { control } = useFormContext<FormValues>();
	return <FormInputDatePicker<FormValues> {...props} control={control} />;
};

const RHFForm: React.FC<{
	children: React.ReactNode;
	defaultValues?: Partial<FormValues>;
	mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
}> = ({ children, defaultValues, mode = 'onBlur' }) => {
	const methods = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: { date: undefined, ...defaultValues },
		mode,
	});

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(() => {})} style={{ width: 360 }}>
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

const meta: Meta<typeof BoundFormInputDatePicker> = {
	title: 'components/Form/FormInputDatePicker',
	component: BoundFormInputDatePicker,
	parameters: { layout: 'centered' },
	argTypes: {
		label: { control: 'text' },
		disabled: { control: 'boolean' },
		placeholder: { control: 'text' },
		minuteStep: { control: 'number' },
	},
};
export default meta;

type Story = StoryObj<typeof BoundFormInputDatePicker>;

export const Default: Story = {
	name: 'Default',
	args: {
		name: 'date',
		label: 'Fecha',
		placeholder: 'DD-MM-YYYY',
	},
	render: args => (
		<RHFForm defaultValues={{ date: undefined }}>
			<BoundFormInputDatePicker {...args} optional />
		</RHFForm>
	),
};

export const WithInitialValue: Story = {
	name: 'Con valor inicial',
	args: {
		name: 'date',
		label: 'Fecha',
		placeholder: 'DD-MM-YYYY',
	},
	render: args => (
		<RHFForm defaultValues={{ date: '2024-12-15' }}>
			<BoundFormInputDatePicker {...args} />
		</RHFForm>
	),
};

export const Disabled: Story = {
	name: 'Deshabilitado',
	args: {
		name: 'date',
		label: 'Fecha',
		disabled: true,
	},
	render: args => (
		<RHFForm defaultValues={{ date: undefined }}>
			<BoundFormInputDatePicker {...args} />
		</RHFForm>
	),
};

export const WithTimeAndMinutes: Story = {
	name: 'Con hora y minutos',
	args: {
		name: 'date',
		label: 'Fecha y hora',
		placeholder: 'YYYY-MM-DD HH:mm',
		format: EDateMaskFormat.YYYYMMDD_HHMM,
	},
	render: args => (
		<RHFForm defaultValues={{ date: '2026-03-21 00:00' }}>
			<BoundFormInputDatePicker {...args} />
		</RHFForm>
	),
};

export const WithMinuteStep: Story = {
	name: 'Minutos cada 15 (8:00, 8:15, 8:30, 8:45)',
	args: {
		name: 'date',
		label: 'Fecha y hora',
		placeholder: 'YYYY-MM-DD HH:mm',
		format: EDateMaskFormat.YYYYMMDD_HHMM,
		minuteStep: 15,
	},
	render: args => (
		<RHFForm defaultValues={{ date: undefined }}>
			<BoundFormInputDatePicker {...args} />
		</RHFForm>
	),
};

export const ShowErrorOnSubmit: Story = {
	name: 'Error al enviar (validación Zod)',
	args: {
		name: 'date',
		label: 'Seleccione una fecha',
	},
	render: args => (
		<RHFForm mode="onSubmit">
			<BoundFormInputDatePicker {...args} />
		</RHFForm>
	),
};
