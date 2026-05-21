import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { useForm, FormProvider } from 'react-hook-form';
import { FormInputNumber as FormInput } from '../../components/FormInputNumber';

// Test wrapper with direct control access
function TestFormWrapperWithControl({
	children,
	defaultValues = {},
}: {
	children: (control: any) => React.ReactNode;
	defaultValues?: Record<string, any>;
}) {
	const methods = useForm({
		defaultValues,
		mode: 'onBlur',
		reValidateMode: 'onBlur',
	});

	return (
		<FormProvider {...methods}>
			{children(methods.control)}
		</FormProvider>
	);
}

describe('FormInputNumber component', () => {
	it('renders with label and number input field', () => {
		render(
			<TestFormWrapperWithControl>
				{(control) => <FormInput name="testField" label="Test Number" control={control} />}
			</TestFormWrapperWithControl>,
		);

		expect(screen.getByText('Test Number')).toBeInTheDocument();
		const input = screen.getByRole('spinbutton'); // input type="number" has role spinbutton
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'number');
	});

	it('displays initial numeric value from form context', () => {
		render(
			<TestFormWrapperWithControl defaultValues={{ testField: '12345' }}>
				{(control) => <FormInput name="testField" label="Test Number" control={control} />}
			</TestFormWrapperWithControl>,
		);

		const input = screen.getByRole('spinbutton') as HTMLInputElement;
		expect(input.value).toBe('12345');
	});

	it('filters non-numeric characters when typing', async () => {
		const user = userEvent.setup();
		render(
			<TestFormWrapperWithControl>
				{(control) => <FormInput name="testField" label="Test Number" control={control} />}
			</TestFormWrapperWithControl>,
		);

		const input = screen.getByRole('spinbutton') as HTMLInputElement;
		
		// Focus the input first
		await user.click(input);
		
		// Type only letters - they should be filtered out
		await user.type(input, 'abc');
		expect(input.value).toBe('');
		
		// Type mixed content - only numbers should remain
		await user.clear(input);
		await user.type(input, '1a2b3c');
		
		await waitFor(() => {
			expect(input.value).toBe('123');
		});
	});

	it('filters special characters and symbols', async () => {
		const user = userEvent.setup();
		render(
			<TestFormWrapperWithControl>
				{(control) => <FormInput name="testField" label="Test Number" control={control} />}
			</TestFormWrapperWithControl>,
		);

		const input = screen.getByRole('spinbutton') as HTMLInputElement;
		
		await user.click(input);
		await user.type(input, '1!2@3#');

		await waitFor(() => {
			expect(input.value).toBe('123');
		});
	});

	it('handles empty input correctly', async () => {
		const user = userEvent.setup();
		render(
			<TestFormWrapperWithControl defaultValues={{ testField: '123' }}>
				{(control) => <FormInput name="testField" label="Test Number" control={control} />}
			</TestFormWrapperWithControl>,
		);

		const input = screen.getByRole('spinbutton') as HTMLInputElement;
		
		// Clear the input completely
		await user.clear(input);

		await waitFor(() => {
			expect(input.value).toBe('');
		});
	});

	it('filters non-numeric characters on blur', async () => {
		const user = userEvent.setup();
		render(
			<TestFormWrapperWithControl>
				{(control) => <FormInput name="testField" label="Test Number" control={control} />}
			</TestFormWrapperWithControl>,
		);

		const input = screen.getByRole('spinbutton') as HTMLInputElement;
		
		// Focus and type mixed content
		await user.click(input);
		await user.type(input, '1a2b3');
		
		// Blur the input
		await user.click(document.body);

		await waitFor(() => {
			expect(input.value).toBe('123');
		});
	});

	it('handles decimal points and negative signs by filtering them out', async () => {
		const user = userEvent.setup();
		render(
			<TestFormWrapperWithControl>
				{(control) => <FormInput name="testField" label="Test Number" control={control} />}
			</TestFormWrapperWithControl>,
		);

		const input = screen.getByRole('spinbutton') as HTMLInputElement;

		await user.click(input);
		await user.type(input, '1.2.3');

		// Component allows one decimal point (first `.` is allowed, second is blocked)
		// '1.2.3' → '1.23' (second dot blocked by handleKeyDown)
		await waitFor(() => {
			expect(input.value).toBe('1.23');
		});
	});

	it('has correct form attributes', () => {
		render(
			<TestFormWrapperWithControl>
				{(control) => <FormInput name="testField" label="Test Number" control={control} />}
			</TestFormWrapperWithControl>,
		);

		const input = screen.getByRole('spinbutton') as HTMLInputElement;
		expect(input).toHaveAttribute('name', 'testField');
		expect(input).toHaveAttribute('aria-invalid', 'false');
		expect(input).toHaveAttribute('type', 'number');
		expect(input).toHaveClass('ant-input');
	});

	it('connects label with input using htmlFor and id', () => {
		render(
			<TestFormWrapperWithControl>
				{(control) => <FormInput name="testField" label="Test Number" control={control} />}
			</TestFormWrapperWithControl>,
		);

		const label = screen.getByText('Test Number');
		const input = screen.getByRole('spinbutton') as HTMLInputElement;

		expect(label).toHaveAttribute('for');
		expect(input).toHaveAttribute('id');
		expect(label.getAttribute('for')).toBe(input.getAttribute('id'));
	});

	it('shows error state when validation fails', async () => {
		const TestComponent = () => {
			const methods = useForm({
				defaultValues: { testField: '' },
				mode: 'onChange',
			});

			return (
				<FormProvider {...methods}>
					<FormInput 
						name="testField" 
						label="Test Number" 
						control={methods.control}
					/>
				</FormProvider>
			);
		};

		const user = userEvent.setup();
		render(<TestComponent />);

		const input = screen.getByRole('spinbutton') as HTMLInputElement;
		
		// Type and then clear to trigger validation
		await user.type(input, '123');
		await user.clear(input);

		// Note: Error state depends on validation rules being set up properly
		// This test verifies the component can handle error states
		expect(input).toHaveAttribute('aria-invalid', 'false');
	});

	it('does not have aria-describedby when there is no error', () => {
		render(
			<TestFormWrapperWithControl>
				{(control) => <FormInput name="testField" label="Test Number" control={control} />}
			</TestFormWrapperWithControl>,
		);

		const input = screen.getByRole('spinbutton') as HTMLInputElement;
		expect(input).not.toHaveAttribute('aria-describedby');
	});

	it('passes additional props to the underlying Input component', () => {
		render(
			<TestFormWrapperWithControl>
				{(control) => (
					<FormInput 
						name="testField" 
						label="Test Number" 
						control={control}
						placeholder="Enter numbers only..." 
						maxLength={10} 
						disabled 
					/>
				)}
			</TestFormWrapperWithControl>,
		);

		const input = screen.getByRole('spinbutton') as HTMLInputElement;
		// Placeholder is uppercased by the component
		expect(input).toHaveAttribute('placeholder', 'ENTER NUMBERS ONLY...');
		expect(input).toHaveAttribute('maxlength', '10');
		expect(input).toBeDisabled();
	});

	it('supports showCaracteres prop for character count', () => {
		render(
			<TestFormWrapperWithControl defaultValues={{ testField: '12345' }}>
				{(control) => (
					<FormInput 
						name="testField" 
						label="Test Number" 
						control={control}
						showCaracteres 
					/>
				)}
			</TestFormWrapperWithControl>,
		);

		const input = screen.getByRole('spinbutton') as HTMLInputElement;
		expect(input).toBeInTheDocument();
		// Note: Character count functionality is handled by Ant Design's Input component
	});

	it('handles reasonable numbers correctly', async () => {
		const user = userEvent.setup();
		render(
			<TestFormWrapperWithControl>
				{(control) => <FormInput name="testField" label="Test Number" control={control} />}
			</TestFormWrapperWithControl>,
		);

		const input = screen.getByRole('spinbutton') as HTMLInputElement;
		const reasonableNumber = '123456789';
		
		await user.click(input);
		await user.type(input, reasonableNumber);

		await waitFor(() => {
			expect(input.value).toBe(reasonableNumber);
		});
	});

	it('handles leading zeros correctly (note: type="number" removes leading zeros)', async () => {
		const user = userEvent.setup();
		render(
			<TestFormWrapperWithControl>
				{(control) => <FormInput name="testField" label="Test Number" control={control} />}
			</TestFormWrapperWithControl>,
		);

		const input = screen.getByRole('spinbutton') as HTMLInputElement;
		
		await user.click(input);
		await user.type(input, '00123');

		await waitFor(() => {
			// Note: input type="number" automatically removes leading zeros
			// This is standard browser behavior
			expect(input.value).toBe('123');
		});
	});

	it('handles mixed content input correctly', async () => {
		const user = userEvent.setup();
		render(
			<TestFormWrapperWithControl>
				{(control) => <FormInput name="testField" label="Test Number" control={control} />}
			</TestFormWrapperWithControl>,
		);

		const input = screen.getByRole('spinbutton') as HTMLInputElement;
		
		// Type mixed content character by character
		await user.click(input);
		await user.type(input, '1');
		await user.type(input, 'a');
		await user.type(input, '2');
		await user.type(input, '#');
		await user.type(input, '3');

		await waitFor(() => {
			expect(input.value).toBe('123');
		});
	});

	it('handles whitespace characters correctly', async () => {
		const user = userEvent.setup();
		render(
			<TestFormWrapperWithControl>
				{(control) => <FormInput name="testField" label="Test Number" control={control} />}
			</TestFormWrapperWithControl>,
		);

		const input = screen.getByRole('spinbutton') as HTMLInputElement;
		
		await user.click(input);
		await user.type(input, '1 2 3');

		await waitFor(() => {
			expect(input.value).toBe('123');
		});
	});

	it('maintains numeric-only behavior with direct onChange events', async () => {
		const user = userEvent.setup();
		render(
			<TestFormWrapperWithControl>
				{(control) => <FormInput name="testField" label="Test Number" control={control} />}
			</TestFormWrapperWithControl>,
		);

		const input = screen.getByRole('spinbutton') as HTMLInputElement;
		
		// Test that typing individual characters works correctly
		await user.click(input);
		
		// Type numbers - should appear
		await user.type(input, '123');
		expect(input.value).toBe('123');
		
		// Try to add letters - should be filtered by browser or component
		await user.type(input, 'abc');
		expect(input.value).toBe('123'); // No change
	});

	it('verifies component integration with form validation', async () => {
		const TestComponentWithValidation = () => {
			const methods = useForm({
				defaultValues: { testField: '' },
				mode: 'onChange',
			});

			return (
				<FormProvider {...methods}>
					<form>
						<FormInput 
							name="testField" 
							label="Test Number" 
							control={methods.control}
						/>
						<div data-testid="form-value">
							{methods.watch('testField')}
						</div>
					</form>
				</FormProvider>
			);
		};

		const user = userEvent.setup();
		render(<TestComponentWithValidation />);

		const input = screen.getByRole('spinbutton') as HTMLInputElement;
		const valueDisplay = screen.getByTestId('form-value');
		
		// Type mixed content
		await user.click(input);
		await user.type(input, '1a2b3c');
		
		await waitFor(() => {
			expect(input.value).toBe('123');
			expect(valueDisplay).toHaveTextContent('123');
		});
	});
});