import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, Space } from 'antd';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import dayjs, { Dayjs } from 'dayjs';
import { FormDateTimePicker, IFormDateTimePickerProps } from '../../components/FormDateTimePicker';

// ---------- Schema y tipos ----------
const schema = z.object({
	datetime: z.string().min(1, { message: 'Seleccione fecha y hora' }),
});
type FormValues = z.infer<typeof schema>;

// Wrapper que obtiene el control del contexto del formulario
const BoundFormDateTimePicker = (props: Omit<IFormDateTimePickerProps<FormValues>, 'control'>) => {
	const { control, watch } = useFormContext<FormValues>();
	const datetime = watch('datetime');
	// eslint-disable-next-line no-console
	console.log('datetime ISO =>', datetime);
	return <FormDateTimePicker {...props} control={control as any} />;
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
		defaultValues: { datetime: '', ...defaultValues },
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
const meta: Meta<typeof BoundFormDateTimePicker> = {
	title: 'components/Form/FormDateTimePicker',
	component: BoundFormDateTimePicker,
	parameters: { layout: 'centered' },
	argTypes: {
		label: { control: 'text' },
		disabled: { control: 'boolean' },
		placeholder: { control: 'text' },
		minuteStep: { control: 'number' },
	},
};
export default meta;

type Story = StoryObj<typeof BoundFormDateTimePicker>;

// ---------- Historias ----------
export const Default: Story = {
	name: 'Default',
	args: {
		name: 'datetime',
		label: 'Fecha y Hora',
		placeholder: 'Seleccionar fecha y hora',
	},
	render: args => (
		<RHFForm>
			<BoundFormDateTimePicker {...args} />
		</RHFForm>
	),
};

export const WithInitialValue: Story = {
	name: 'Con valor inicial (ISO)',
	args: {
		name: 'datetime',
		label: 'Fecha y Hora',
		placeholder: 'Seleccionar fecha y hora',
	},
	render: args => (
		<RHFForm defaultValues={{ datetime: '2026-03-27T14:30:00.000Z' }}>
			<BoundFormDateTimePicker {...args} />
		</RHFForm>
	),
};

export const Optional: Story = {
	name: 'Opcional',
	args: {
		name: 'datetime',
		label: 'Fecha y Hora',
		placeholder: 'Seleccionar fecha y hora',
		optional: true,
	},
	render: args => (
		<RHFForm>
			<BoundFormDateTimePicker {...args} />
		</RHFForm>
	),
};

export const Disabled: Story = {
	name: 'Deshabilitado',
	args: {
		name: 'datetime',
		label: 'Fecha y Hora',
		disabled: true,
	},
	render: args => (
		<RHFForm defaultValues={{ datetime: '2026-03-27T14:30:00.000Z' }}>
			<BoundFormDateTimePicker {...args} />
		</RHFForm>
	),
};

export const WithMinuteStep30: Story = {
	name: 'Paso de minutos cada 30',
	args: {
		name: 'datetime',
		label: 'Fecha y Hora',
		placeholder: 'Seleccionar fecha y hora',
		minuteStep: 30,
	},
	render: args => (
		<RHFForm>
			<BoundFormDateTimePicker {...args} />
		</RHFForm>
	),
};

export const WithDisabledRules: Story = {
	name: 'Con días y horas bloqueadas',
	args: {
		name: 'datetime',
		label: 'Turno de taller',
		placeholder: 'Seleccionar fecha y hora',
		minuteStep: 15,
	},
	render: args => {
		const disabledDate = (current: Dayjs) => {
			// Bloquea domingos (0) y fechas pasadas
			return current.isBefore(dayjs().startOf('day')) || current.day() === 0;
		};
		const disabledTime = () => ({
			disabledHours: () => {
				const hours: number[] = [];
				for (let i = 0; i < 8; i++) hours.push(i);   // antes de las 8
				for (let i = 18; i < 24; i++) hours.push(i); // después de las 18
				return hours;
			},
		});
		return (
			<RHFForm>
				<BoundFormDateTimePicker {...args} disabledDate={disabledDate} disabledTime={disabledTime} />
			</RHFForm>
		);
	},
};

export const ShowErrorOnSubmit: Story = {
	name: 'Error al enviar (validación Zod)',
	args: {
		name: 'datetime',
		label: 'Fecha y Hora de Confirmación',
		placeholder: 'Seleccionar fecha y hora',
	},
	render: args => (
		<RHFForm mode="onSubmit" onSubmitLogLabel="submit-invalid">
			<BoundFormDateTimePicker {...args} />
		</RHFForm>
	),
};
