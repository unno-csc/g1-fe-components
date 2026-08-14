import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, Space } from 'antd';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { FormSwitch, IFormSwitchProps } from '../../components/FormSwitch';

// ---------- Schema y tipos ----------
const schema = z.object({
	enabled: z.boolean().refine(v => v === true, { message: 'Debes activar esta opción' }),
});
type FormValues = z.infer<typeof schema>;

// Wrapper que obtiene el control del contexto del formulario
const BoundFormSwitch = (props: Omit<IFormSwitchProps<FormValues>, 'control'>) => {
	const { control } = useFormContext<FormValues>();
	return <FormSwitch {...(props as IFormSwitchProps<FormValues>)} control={control as any} />;
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
		defaultValues: { enabled: false, ...defaultValues },
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
const meta: Meta<typeof BoundFormSwitch> = {
	title: 'components/Form/FormSwitch',
	tags: ['autodocs'],
	component: BoundFormSwitch,
	parameters: { layout: 'centered' },
	argTypes: {
		label: { control: 'text', description: 'Texto de la etiqueta' },
		disabled: { control: 'boolean', description: 'Estado deshabilitado' },
		checkedLabel: { control: 'text', description: 'Texto cuando está activado' },
		uncheckedLabel: { control: 'text', description: 'Texto cuando está desactivado' },
		activeBgColor: { control: 'color', description: 'Color de fondo activo' },
		inactiveBgColor: { control: 'color', description: 'Color de fondo inactivo' },
		hideWrapperBorder: { control: 'boolean', description: 'Oculta el borde exterior' },
		classNameBorder: { control: 'text', description: 'Clase CSS personalizada para el contenedor con borde' },
	},
};
export default meta;

type Story = StoryObj<typeof BoundFormSwitch>;

// ---------- Historias ----------
export const Default: Story = {
	name: 'Default',
	args: {
		name: 'enabled',
		label: 'Activar notificaciones',
	},
	render: args => (
		<RHFForm defaultValues={{ enabled: false }}>
			<BoundFormSwitch {...args} />
		</RHFForm>
	),
};

export const WithLabels: Story = {
	name: 'Con etiquetas personalizadas',
	args: {
		name: 'enabled',
		label: 'Activar notificaciones',
		checkedLabel: 'Sí',
		uncheckedLabel: 'No',
	},
	render: args => (
		<RHFForm defaultValues={{ enabled: false }}>
			<BoundFormSwitch {...args} />
		</RHFForm>
	),
};

export const WithInitialValue: Story = {
	name: 'Con valor inicial',
	args: {
		name: 'enabled',
		label: 'Activar notificaciones',
		checkedLabel: 'Sí',
		uncheckedLabel: 'No',
	},
	render: args => (
		<RHFForm defaultValues={{ enabled: true }}>
			<BoundFormSwitch {...args} />
		</RHFForm>
	),
};

export const WithCustomColors: Story = {
	name: 'Con colores personalizados',
	args: {
		name: 'enabled',
		label: 'Activar notificaciones',
		checkedLabel: 'Sí',
		uncheckedLabel: 'No',
		activeBgColor: '#52c41a',
		inactiveBgColor: '#d9d9d9',
	},
	render: args => (
		<RHFForm defaultValues={{ enabled: false }}>
			<BoundFormSwitch {...args} />
		</RHFForm>
	),
};

export const Disabled: Story = {
	name: 'Deshabilitado',
	args: {
		name: 'enabled',
		label: 'Activar notificaciones',
		checkedLabel: 'Sí',
		uncheckedLabel: 'No',
		disabled: true,
	},
	render: args => (
		<RHFForm defaultValues={{ enabled: false }}>
			<BoundFormSwitch {...args} />
		</RHFForm>
	),
};

export const ShowErrorOnSubmit: Story = {
	name: 'Error al enviar (validación Zod)',
	args: {
		name: 'enabled',
		label: 'Debes activar esta opción para continuar',
		checkedLabel: 'Sí',
		uncheckedLabel: 'No',
	},
	render: args => (
		<RHFForm mode="onSubmit" onSubmitLogLabel="submit-invalid">
			<BoundFormSwitch {...args} />
		</RHFForm>
	),
};

export const WithCustomBorder: Story = {
	name: 'Con borde personalizado',
	args: {
		name: 'enabled',
		label: 'Estado de la Orden',
		checkedLabel: 'ACTIVA',
		uncheckedLabel: 'INACTIVA',
		classNameBorder: 'p-2 border-2 border-primary-500 rounded-lg shadow-sm',
	},
	render: args => (
		<RHFForm defaultValues={{ enabled: true }}>
			<BoundFormSwitch {...args} />
		</RHFForm>
	),
};
