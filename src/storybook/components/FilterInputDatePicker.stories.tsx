import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, Space } from 'antd';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import dayjs from 'dayjs';
import { FormInputDatePicker, IInputProps } from '../../components/FormInputDatePicker';
import { EDateMaskFormat } from '../../enums';

// ---------- Schema y tipos ----------
const schema = z.object({
	date: z.any().refine(v => !!v, { message: 'Seleccione una fecha' }),
});
type FormValues = z.infer<typeof schema>;

// Wrapper que obtiene el control del contexto del formulario
const BoundFormInputDatePicker = (props: Omit<IInputProps<FormValues>, 'control'>) => {
	const { control, watch } = useFormContext<FormValues>();
	const date = watch('date');
	return <FormInputDatePicker {...props} control={control as any} />;
};

// ---------- Wrapper con RHF ----------
const RHFForm: React.FC<{
	children: React.ReactNode;
	defaultValues?: Partial<FormValues>;
	mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
	onSubmitLogLabel?: string;
}> = ({ children, defaultValues, mode = 'onBlur', onSubmitLogLabel = 'submit' }) => {
	const methods = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: { date: undefined, ...defaultValues },
		mode,
	});

	return (
		<FormProvider {...methods}>
			<form
				onSubmit={methods.handleSubmit(data => {
					// eslint-disable-next-line no-console
					console.log(onSubmitLogLabel, data);
				})}
				style={{ width: 360 }}
			>
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

// ---------- Meta ----------
const meta: Meta<typeof BoundFormInputDatePicker> = {
	title: 'components/Form/FormInputDatePicker',
	component: BoundFormInputDatePicker,
	parameters: { layout: 'centered' },
	argTypes: {
		label: { control: 'text' },
		disabled: { control: 'boolean' },
		placeholder: { control: 'text' },
	},
};
export default meta;

type Story = StoryObj<typeof BoundFormInputDatePicker>;

// ---------- Historias ----------
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
		<RHFForm defaultValues={{ date: dayjs('15-12-2024') }}>
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

export const ShowErrorOnSubmit: Story = {
	name: 'Error al enviar (validación Zod)',
	args: {
		name: 'date',
		label: 'Seleccione una fecha',
	},
	render: args => (
		<RHFForm mode="onSubmit" onSubmitLogLabel="submit-invalid">
			<BoundFormInputDatePicker {...args} />
		</RHFForm>
	),
};


