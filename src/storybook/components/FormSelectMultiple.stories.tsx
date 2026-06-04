import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, Space } from 'antd';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { FormSelectMultiple, IFormSelectMultipleProps } from '../../components/FormSelectMultiple';

const schema = z.object({
	lineBusinessIds: z.array(z.union([z.string(), z.number()])).min(1, 'Seleccione al menos una línea de negocio'),
});

type FormValues = z.infer<typeof schema>;

const BoundFormSelectMultiple = (props: Omit<IFormSelectMultipleProps<FormValues>, 'control'>) => {
	const { control } = useFormContext<FormValues>();
	return <FormSelectMultiple {...props} control={control as any} />;
};

const RHFForm: React.FC<{
	children: React.ReactNode;
	defaultValues?: Partial<FormValues>;
	mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
	onSubmitLogLabel?: string;
}> = ({ children, defaultValues, mode = 'onBlur', onSubmitLogLabel = 'submit' }) => {
	const methods = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: { lineBusinessIds: [], ...defaultValues },
		mode,
	});

	return (
		<FormProvider {...methods}>
			<form
				onSubmit={methods.handleSubmit(data => {
					// eslint-disable-next-line no-console
					console.log(onSubmitLogLabel, data);
				})}
				style={{ width: 420 }}
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

const meta: Meta<typeof BoundFormSelectMultiple> = {
	title: 'components/Form/FormSelectMultiple',
	component: BoundFormSelectMultiple,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Componente de select múltiple integrado con react-hook-form. Las opciones seleccionadas se muestran dentro del propio select para mantener el formulario compacto.',
			},
		},
	},
	argTypes: {
		label: { control: 'text' },
		placeholder: { control: 'text' },
		allowClear: { control: 'boolean' },
		isLoading: { control: 'boolean' },
	},
};

export default meta;

type Story = StoryObj<typeof BoundFormSelectMultiple>;

const sampleOptions = [
	{ label: 'Ventas', value: 'sales' },
	{ label: 'Postventa', value: 'after-sales' },
	{ label: 'Logística', value: 'logistics' },
	{ label: 'Comercial', value: 'commercial' },
];

export const Default: Story = {
	name: 'Default',
	args: {
		name: 'lineBusinessIds',
		label: 'Líneas de negocio',
		placeholder: 'Seleccione las líneas de negocio',
		allowClear: true,
		options: sampleOptions,
	},
	render: args => (
		<RHFForm defaultValues={{ lineBusinessIds: ['sales', 'logistics'] }}>
			<BoundFormSelectMultiple {...args} />
		</RHFForm>
	),
};

export const Empty: Story = {
	name: 'Sin selección',
	args: {
		name: 'lineBusinessIds',
		label: 'Líneas de negocio',
		placeholder: 'Seleccione las líneas de negocio',
		allowClear: true,
		options: sampleOptions,
	},
	render: args => (
		<RHFForm defaultValues={{ lineBusinessIds: [] }}>
			<BoundFormSelectMultiple {...args} />
		</RHFForm>
	),
};