import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, Space } from 'antd';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { FormInputNumber, IInputProps } from '../../components/FormInputNumber';

// ---------- Schema y tipos ----------
const schema = z.object({
	amount: z
		.number()
		.min(0, 'Debe ser mayor o igual a 0')
		.nullable()
		.refine(value => value !== null, { message: 'Ingrese un valor' }),
});
type FormValues = z.infer<typeof schema>;

// Wrapper que obtiene el control del contexto del formulario
const BoundFormInputNumber = (props: Omit<IInputProps<FormValues>, 'control'>) => {
	const { control } = useFormContext<FormValues>();
	return <FormInputNumber {...props} control={control as any} />;
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
		defaultValues: { amount: null, ...defaultValues },
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
const meta: Meta<typeof BoundFormInputNumber> = {
	title: 'components/Form/FormInputNumber',
	component: BoundFormInputNumber,
	parameters: { layout: 'centered' },
	argTypes: {
		label: { control: 'text' },
		disabled: { control: 'boolean' },
		placeholder: { control: 'text' },
		prefix: { control: 'text' },
		suffix: { control: 'text' },
		showCaracteres: { control: 'boolean' },
	},
};
export default meta;

type Story = StoryObj<typeof BoundFormInputNumber>;

// ---------- Historias ----------
export const Default: Story = {
	name: 'Default',
	args: {
		name: 'amount',
		label: 'Monto',
		placeholder: '0',
	},
	render: args => (
		<RHFForm defaultValues={{ amount: null }}>
			<BoundFormInputNumber {...args} />
		</RHFForm>
	),
};

export const WithPrefixSuffix: Story = {
	name: 'Con prefijo y sufijo',
	args: {
		name: 'amount',
		label: 'Monto',
		placeholder: '0',
		prefix: '$',
		suffix: 'USD',
	},
	render: args => (
		<RHFForm defaultValues={{ amount: null }}>
			<BoundFormInputNumber {...args} />
		</RHFForm>
	),
};

export const WithInitialValue: Story = {
	name: 'Con valor inicial',
	args: {
		name: 'amount',
		label: 'Monto',
		placeholder: '0',
	},
	render: args => (
		<RHFForm defaultValues={{ amount: 1250 }}>
			<BoundFormInputNumber {...args} />
		</RHFForm>
	),
};

export const Disabled: Story = {
	name: 'Deshabilitado',
	args: {
		name: 'amount',
		label: 'Monto',
		disabled: true,
	},
	render: args => (
		<RHFForm defaultValues={{ amount: 1250 }}>
			<BoundFormInputNumber {...args} />
		</RHFForm>
	),
};

export const ShowErrorOnSubmit: Story = {
	name: 'Error al enviar (validación Zod)',
	args: {
		name: 'amount',
		label: 'Ingrese un monto',
	},
	render: args => (
		<RHFForm mode="onSubmit" onSubmitLogLabel="submit-invalid">
			<BoundFormInputNumber {...args} />
		</RHFForm>
	),
};
