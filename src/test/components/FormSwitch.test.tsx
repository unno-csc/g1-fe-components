import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { useForm, FormProvider } from 'react-hook-form';
import { FormSwitch } from '../../components/FormSwitch';

interface ITestFormValues {
	status: boolean;
}

const RHFWithControl = ({
	children,
	defaultValues = { status: false },
}: {
	children: (control: ReturnType<typeof useForm<ITestFormValues>>['control']) => React.ReactNode;
	defaultValues?: ITestFormValues;
}) => {
	const methods = useForm<ITestFormValues>({ defaultValues });
	return <FormProvider {...methods}>{children(methods.control)}</FormProvider>;
};

describe('FormSwitch component', () => {
	it('renders label and toggles switch value', async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();

		const { container } = render(
			<RHFWithControl defaultValues={{ status: false }}>
				{control => (
					<FormSwitch<ITestFormValues>
						name="status"
						label="Estado de la Orden"
						checkedLabel="ACTIVA"
						uncheckedLabel="INACTIVA"
						control={control}
						onChange={handleChange}
					/>
				)}
			</RHFWithControl>
		);

		expect(screen.getByText('Estado de la Orden')).toBeInTheDocument();
		const switchElement = screen.getByRole('switch');
		expect(switchElement).toHaveAttribute('aria-checked', 'false');

		await user.click(switchElement);
		expect(switchElement).toHaveAttribute('aria-checked', 'true');
		expect(handleChange).toHaveBeenCalledWith(true);
		expect(container).toMatchSnapshot();
	});

	it('applies custom classNameBorder and className', () => {
		const { container } = render(
			<RHFWithControl defaultValues={{ status: true }}>
				{control => (
					<FormSwitch<ITestFormValues>
						name="status"
						label="Estado"
						className="custom-container"
						classNameBorder="custom-border-class"
						control={control}
					/>
				)}
			</RHFWithControl>
		);

		expect(container.querySelector('.custom-container')).toBeInTheDocument();
		expect(container.querySelector('.custom-border-class')).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it('renders without border wrapper when hideWrapperBorder is true', () => {
		const { container } = render(
			<RHFWithControl defaultValues={{ status: true }}>
				{control => (
					<FormSwitch<ITestFormValues>
						name="status"
						label="Sin Borde"
						hideWrapperBorder={true}
						control={control}
					/>
				)}
			</RHFWithControl>
		);

		expect(container.querySelector('.border')).not.toBeInTheDocument();
		expect(screen.getByText('Sin Borde')).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});
});
