import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { useForm } from 'react-hook-form';
import { FormInput } from '../../components/FormInput';

function Wrapper({
	name = 'testField',
	label = 'Test Label',
	defaultValues = {} as Record<string, any>,
	...props
}: {
	name?: string;
	label?: string;
	defaultValues?: Record<string, any>;
	[key: string]: any;
}) {
	const { control } = useForm({ defaultValues, mode: 'onBlur', reValidateMode: 'onBlur' });
	return <FormInput name={name} label={label} control={control} {...props} />;
}

describe('FormInput component', () => {
	it('renders with label and input field', () => {
		render(<Wrapper />);

		expect(screen.getByText('Test Label')).toBeInTheDocument();
		expect(screen.getByRole('textbox')).toBeInTheDocument();
	});

	it('displays initial value from form context', () => {
		render(<Wrapper defaultValues={{ testField: 'Initial value' }} />);

		const input = screen.getByRole('textbox') as HTMLInputElement;
		expect(input.value).toBe('Initial value');
	});

	it('allows user to type and updates value', async () => {
		const user = userEvent.setup();
		render(<Wrapper textTransform="none" />);

		const input = screen.getByRole('textbox');
		await user.type(input, 'Hello World');

		expect(input).toHaveValue('Hello World');
	});

	it('transforms input to uppercase by default', async () => {
		const user = userEvent.setup();
		render(<Wrapper />);

		const input = screen.getByRole('textbox');
		await user.type(input, 'hello');

		expect(input).toHaveValue('HELLO');
	});

	it('has correct form attributes', () => {
		render(<Wrapper />);

		const input = screen.getByRole('textbox');
		expect(input).toHaveAttribute('name', 'testField');
		expect(input).toHaveAttribute('aria-invalid', 'false');
		expect(input).toHaveAttribute('type', 'text');
		expect(input).toHaveClass('ant-input');
	});

	it('connects label with input using htmlFor and id', () => {
		render(<Wrapper />);

		const label = screen.getByText('Test Label');
		const input = screen.getByRole('textbox');

		expect(label).toHaveAttribute('for');
		expect(input).toHaveAttribute('id');
		expect(label.getAttribute('for')).toBe(input.getAttribute('id'));
	});

	it('does not have aria-describedby when there is no error', () => {
		render(<Wrapper />);

		const input = screen.getByRole('textbox');
		expect(input).not.toHaveAttribute('aria-describedby');
	});

	it('passes additional props to the underlying Input component', () => {
		render(<Wrapper placeholder="Enter text..." maxLength={50} disabled />);

		const input = screen.getByRole('textbox');
		expect(input).toHaveAttribute('placeholder', 'Enter text...');
		expect(input).toHaveAttribute('maxlength', '50');
		expect(input).toBeDisabled();
	});

	it('supports showCaracteres prop', () => {
		render(<Wrapper defaultValues={{ testField: 'Test' }} showCaracteres />);

		const input = screen.getByRole('textbox');
		expect(input).toBeInTheDocument();
	});
});
