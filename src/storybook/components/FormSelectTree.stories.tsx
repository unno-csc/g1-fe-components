import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, Space } from 'antd';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { FormSelectTree, IFormSelectTreeProps, IFormSelectTreeOption } from '../../components/FormTreeSelect/FormSelectTree';

const options: IFormSelectTreeOption[] = [
	{
		label: 'Vehículos',
		value: 'vehiculos',
		children: [
			{ label: 'Autos', value: 'autos' },
			{ label: 'Motos', value: 'motos' },
		],
	},
	{
		label: 'Repuestos',
		value: 'repuestos',
		children: [
			{ label: 'Frenos', value: 'frenos' },
			{ label: 'Motor', value: 'motor' },
		],
	},
];

type FormValues = { category: string };

const BoundFormSelectTree = (props: Omit<IFormSelectTreeProps<FormValues>, 'control'>) => {
	const { control } = useFormContext<FormValues>();
	return <FormSelectTree {...props} control={control} />;
};

const RHFForm: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const methods = useForm<FormValues>({ defaultValues: { category: '' } });
	return (
		<FormProvider {...methods}>
			<form
				onSubmit={methods.handleSubmit(data => console.log('submit', data))}
				style={{ width: 320 }}
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

const meta: Meta<typeof BoundFormSelectTree> = {
	title: 'components/Form/FormSelectTree',
	component: BoundFormSelectTree,
	parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof BoundFormSelectTree>;

export const Default: Story = {
	args: {
		name: 'category',
		label: 'Categoría',
		options,
	},
	render: args => (
		<RHFForm>
			<BoundFormSelectTree {...args} />
		</RHFForm>
	),
};
