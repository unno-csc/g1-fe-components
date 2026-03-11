import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FormProvider, useForm } from 'react-hook-form';
import { Login } from '../../components/Login';

// Wrapper para proporcionar control y onSubmit desde RHF
const RHFWrapper: React.FC<{ children: (props: any) => React.ReactNode }> = ({ children }) => {
	const methods = useForm({ mode: 'onSubmit' });
	return (
		<FormProvider {...methods}>
			{children({
				control: methods.control,
				onSubmit: (data: any) => console.log('login submit', data),
				logo: 'QUOTER',
			})}
		</FormProvider>
	);
};

const meta: Meta<typeof Login> = {
	title: 'Components/Login',
	component: Login,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
	argTypes: {},
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: args => (
		<RHFWrapper>
			{({ control, onSubmit }) => <Login {...args} control={control} onSubmit={onSubmit} logo="QUOTER" />}
		</RHFWrapper>
	),
	args: {},
};
