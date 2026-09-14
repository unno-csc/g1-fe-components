import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { useForm } from 'react-hook-form';
import { FormDateRangePicker } from '../../components/FormDateRangePicker';

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
	return <FormDateRangePicker name={name} label={label} control={control} {...props} />;
}

describe('FormDateRangePicker component', () => {
	it('renders with label and two date inputs', () => {
		render(<Wrapper />);

		expect(screen.getByText('Test Label')).toBeInTheDocument();
		expect(screen.getAllByRole('textbox')).toHaveLength(2);
	});

	it('displays initial value from form context split by ";"', () => {
		render(<Wrapper defaultValues={{ testField: '2026-01-01;2026-01-31' }} />);

		const [startInput, endInput] = screen.getAllByRole('textbox') as HTMLInputElement[];
		expect(startInput.value).toBe('2026-01-01');
		expect(endInput.value).toBe('2026-01-31');
	});

	it('updates the field value joined by ";" when a full range is selected', async () => {
		const user = userEvent.setup();
		render(<Wrapper />);

		const [startInput, endInput] = screen.getAllByRole('textbox');
		await user.click(startInput);
		await user.paste('2026-01-01');
		await user.keyboard('{enter}');
		await user.click(endInput);
		await user.paste('2026-01-31');
		await user.keyboard('{enter}');

		expect(startInput).toHaveValue('2026-01-01');
		expect(endInput).toHaveValue('2026-01-31');
	});

	it('connects label with the first input using htmlFor and id', () => {
		render(<Wrapper />);

		const label = screen.getByText('Test Label');
		const [startInput] = screen.getAllByRole('textbox');

		expect(label).toHaveAttribute('for');
		expect(startInput).toHaveAttribute('id');
		expect(label.getAttribute('for')).toBe(startInput.getAttribute('id'));
	});

	it('disables both inputs when disabled prop is true', () => {
		render(<Wrapper disabled />);

		const [startInput, endInput] = screen.getAllByRole('textbox');
		expect(startInput).toBeDisabled();
		expect(endInput).toBeDisabled();
	});

	it('passes placeholders to the underlying inputs', () => {
		render(<Wrapper placeholder={['Desde', 'Hasta']} />);

		expect(screen.getByPlaceholderText('Desde')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Hasta')).toBeInTheDocument();
	});

	it('does not have aria-describedby when there is no error', () => {
		render(<Wrapper />);

		const [startInput] = screen.getAllByRole('textbox');
		expect(startInput).not.toHaveAttribute('aria-describedby');
	});
});
