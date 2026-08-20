import React, { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Control, FieldValues, FormProvider, useForm } from 'react-hook-form';
import { FormRadio } from '../../components/FormRadio';
import { Radio } from '../../components/Radio/Radio';

interface ITestFormValues extends FieldValues {
	option: string;
	consignment: boolean;
}

interface IRHFWithControlProps {
	children: (control: Control<ITestFormValues>) => ReactNode;
	defaultValues?: Partial<ITestFormValues>;
}

const RHFWithControl = ({
	children,
	defaultValues = {},
}: IRHFWithControlProps) => {
	const methods = useForm<ITestFormValues>({ defaultValues: defaultValues as ITestFormValues });
	return <FormProvider {...methods}>{children(methods.control)}</FormProvider>;
};

describe('FormRadio component', () => {
	it('renders label and selects radio option from options prop', async () => {
		const user = userEvent.setup();
		render(
			<RHFWithControl defaultValues={{ option: '1' }}>
				{control => (
					<FormRadio<ITestFormValues>
						name="option"
						label="Opción"
						control={control}
						options={[
							{ label: 'Uno', value: '1' },
							{ label: 'Dos', value: '2' },
						]}
					/>
				)}
			</RHFWithControl>
		);

		expect(screen.getByText('Opción')).toBeInTheDocument();
		const radioTwo = screen.getByLabelText('Dos') as HTMLInputElement;
		await user.click(radioTwo);
		expect(radioTwo.checked).toBe(true);
	});

	it('renders with compound Radio children', async () => {
		const user = userEvent.setup();
		render(
			<RHFWithControl defaultValues={{ consignment: false }}>
				{control => (
					<FormRadio<ITestFormValues>
						name="consignment"
						label="Tipo de Pedido"
						control={control}
					>
						<Radio value={false}>Venta Normal</Radio>
						<Radio value={true}>Consignación</Radio>
					</FormRadio>
				)}
			</RHFWithControl>
		);

		expect(screen.getByText('Tipo de Pedido')).toBeInTheDocument();
		const consignmentRadio = screen.getByRole('radio', { name: /consignación/i });
		expect(consignmentRadio).not.toBeChecked();

		await user.click(consignmentRadio);
		expect(consignmentRadio).toBeChecked();
	});
});
