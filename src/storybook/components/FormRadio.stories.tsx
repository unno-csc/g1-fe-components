import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, Space } from 'antd';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { FormRadio, IFormRadioProps } from '../../components/FormRadio';

// ---------- Schema y tipos ----------
const schema = z.object({
	gender: z.enum(['M', 'F'] as const, { message: 'Selecciona una opción' }),
});
type FormValues = z.infer<typeof schema>;

// Wrapper que obtiene el control del contexto del formulario
const BoundFormRadio = ({ name, ...rest }: Omit<IFormRadioProps<FormValues>, 'control'>) => {
	const { control } = useFormContext<FormValues>();
	return <FormRadio label="" name={name} {...rest} control={control} />;
};

// ---------- Wrapper con RHF ----------
const RHFForm: React.FC<{
	children: React.ReactNode;
	defaultValues?: Partial<FormValues>;
	mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
	onSubmitLogLabel?: string;
}> = ({ children, defaultValues, mode = 'onBlur' }) => {
	const methods = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: { gender: undefined, ...defaultValues },
		mode,
	});

	return (
		<FormProvider {...methods}>
			<form
				onSubmit={methods.handleSubmit(() => {
					// submit handler for story demo
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
const meta: Meta<typeof BoundFormRadio> = {
	title: 'components/Form/FormRadio',
	tags: ['autodocs'],
	component: BoundFormRadio,
	parameters: { layout: 'centered' },
	argTypes: {
		label: { control: 'text' },
		disabled: { control: 'boolean' },
	},
};
export default meta;

type Story = StoryObj<typeof BoundFormRadio>;

// ---------- Historias ----------
export const Default: Story = {
	name: 'Default',
	args: {
		name: 'gender',
		label: 'Género',
		options: [
			{ label: 'Masculino', value: 'M' },
			{ label: 'Femenino', value: 'F' },
		],
	},
	render: args => (
		<RHFForm defaultValues={{ gender: undefined }}>
			<BoundFormRadio {...args} />
		</RHFForm>
	),
};

export const WithInitialValue: Story = {
	name: 'Con valor inicial',
	args: {
		name: 'gender',
		label: 'Género',
		options: [
			{ label: 'Masculino', value: 'M' },
			{ label: 'Femenino', value: 'F' },
		],
	},
	render: args => (
		<RHFForm defaultValues={{ gender: 'M' }}>
			<BoundFormRadio {...args} />
		</RHFForm>
	),
};

export const Disabled: Story = {
	name: 'Deshabilitado',
	args: {
		name: 'gender',
		label: 'Género',
		disabled: true,
		options: [
			{ label: 'Masculino', value: 'M' },
			{ label: 'Femenino', value: 'F' },
		],
	},
	render: args => (
		<RHFForm defaultValues={{ gender: undefined }}>
			<BoundFormRadio {...args} />
		</RHFForm>
	),
};

export const ShowErrorOnSubmit: Story = {
	name: 'Error al enviar (validación Zod)',
	args: {
		name: 'gender',
		label: 'Seleccione su género',
		options: [
			{ label: 'Masculino', value: 'M' },
			{ label: 'Femenino', value: 'F' },
		],
	},
	render: args => (
		<RHFForm mode="onSubmit">
			<BoundFormRadio {...args} />
		</RHFForm>
	),
};
