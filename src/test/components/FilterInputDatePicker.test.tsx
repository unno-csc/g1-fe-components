import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import dayjs from 'dayjs';
import { FilterInputDatePicker } from '../../components/FilterInputDatePicker';

describe('FilterInputDatePicker component', () => {
	it('renders correctly with default props and matches snapshot', () => {
		const { container } = render(
			<FilterInputDatePicker placeholder="Seleccionar fecha" />
		);
		const input = screen.getByPlaceholderText('Seleccionar fecha');
		expect(input).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it('renders with label and connects htmlFor and id', () => {
		render(
			<FilterInputDatePicker
				label="Fecha de registro"
				id="filter-date-id"
				placeholder="DD/MM/YYYY"
			/>
		);
		const label = screen.getByText('Fecha de registro');
		const input = screen.getByPlaceholderText('DD/MM/YYYY');

		expect(label).toHaveAttribute('for', 'filter-date-id');
		expect(input).toHaveAttribute('id', 'filter-date-id');
	});

	it('supports legacy title prop for backward compatibility', () => {
		render(<FilterInputDatePicker title="Filtro fecha" />);
		expect(screen.getByText('Filtro fecha')).toBeInTheDocument();
	});

	it('displays initial value from defaultValue in uncontrolled mode', () => {
		render(
			<FilterInputDatePicker
				defaultValue="2026-10-02"
				format="YYYY-MM-DD"
			/>
		);
		const input = screen.getByRole('textbox') as HTMLInputElement;
		expect(input.value).toBe('2026-10-02');
	});

	it('displays value in controlled mode and updates when prop changes', () => {
		const ControlledWrapper = () => {
			const [date, setDate] = useState('2026-05-10');
			return (
				<div>
					<FilterInputDatePicker value={date} onChange={setDate} />
					<button onClick={() => setDate('2026-12-25')}>Cambiar fecha</button>
				</div>
			);
		};

		render(<ControlledWrapper />);
		const input = screen.getByRole('textbox') as HTMLInputElement;
		expect(input.value).toBe('2026-05-10');

		fireEvent.click(screen.getByText('Cambiar fecha'));
		expect(input.value).toBe('2026-12-25');
	});

	it('renders with picker="month" and format="MM/YYYY"', () => {
		render(
			<FilterInputDatePicker
				picker="month"
				format="MM/YYYY"
				defaultValue="10/2026"
				placeholder="MM/YYYY"
			/>
		);
		const input = screen.getByPlaceholderText('MM/YYYY') as HTMLInputElement;
		expect(input.value).toBe('10/2026');
	});

	it('applies subtle highlight style when a value is present', () => {
		const { container } = render(
			<FilterInputDatePicker defaultValue="2026-10-02" />
		);
		const picker = container.querySelector('.ant-picker') as HTMLElement;
		expect(picker).toHaveStyle({ borderColor: '#93c5fd' });
	});

	it('does not apply highlight style when value is empty', () => {
		const { container } = render(
			<FilterInputDatePicker placeholder="Vacío" />
		);
		const picker = container.querySelector('.ant-picker') as HTMLElement;
		expect(picker.style.borderColor).toBe('');
	});

	it('applies disabled state when disabled is true', () => {
		render(
			<FilterInputDatePicker disabled placeholder="Deshabilitado" />
		);
		const input = screen.getByPlaceholderText('Deshabilitado');
		expect(input).toBeDisabled();
	});

	it('calls onChange with formatted date when user enters a date', async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();

		render(
			<FilterInputDatePicker
				onChange={handleChange}
				format="YYYY-MM-DD"
				placeholder="YYYY-MM-DD"
			/>
		);

		const input = screen.getByPlaceholderText('YYYY-MM-DD');
		await user.click(input);
		await user.paste('2026-11-20');
		await user.keyboard('{enter}');

		expect(handleChange).toHaveBeenCalledWith('2026-11-20');
	});

	it('updates internalValue when defaultValue changes in uncontrolled mode', () => {
		const { rerender } = render(
			<FilterInputDatePicker defaultValue="2026-01-01" />
		);
		const input = screen.getByRole('textbox') as HTMLInputElement;
		expect(input.value).toBe('2026-01-01');

		rerender(<FilterInputDatePicker defaultValue="2026-02-02" />);
		expect(input.value).toBe('2026-02-02');
	});
});
