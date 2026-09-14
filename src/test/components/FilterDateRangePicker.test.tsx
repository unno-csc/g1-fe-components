import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FilterDateRangePicker } from '../../components/FilterDateRangePicker';

describe('FilterDateRangePicker component', () => {
	it('renders with title and two date inputs', () => {
		render(<FilterDateRangePicker title="Fecha de creación" />);

		expect(screen.getByText('Fecha de creación')).toBeInTheDocument();
		expect(screen.getAllByRole('textbox')).toHaveLength(2);
	});

	it('displays initial value split by ";" into start and end inputs', () => {
		render(<FilterDateRangePicker value="2026-01-01;2026-01-31" />);

		const [startInput, endInput] = screen.getAllByRole('textbox') as HTMLInputElement[];
		expect(startInput.value).toBe('2026-01-01');
		expect(endInput.value).toBe('2026-01-31');
	});

	it('respects a custom format when displaying the initial value', () => {
		render(<FilterDateRangePicker value="01/01/2026;31/01/2026" format="DD/MM/YYYY" />);

		const [startInput, endInput] = screen.getAllByRole('textbox') as HTMLInputElement[];
		expect(startInput.value).toBe('01/01/2026');
		expect(endInput.value).toBe('31/01/2026');
	});

	it('calls onChange with dates joined by ";" when a full range is selected', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<FilterDateRangePicker onChange={onChange} />);

		const [startInput, endInput] = screen.getAllByRole('textbox');
		await user.click(startInput);
		await user.paste('2026-01-01');
		await user.keyboard('{enter}');
		await user.click(endInput);
		await user.paste('2026-01-31');
		await user.keyboard('{enter}');

		expect(onChange).toHaveBeenCalledWith('2026-01-01;2026-01-31');
	});

	it('does not call onChange with a value when the range is incomplete', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<FilterDateRangePicker onChange={onChange} />);

		const [startInput] = screen.getAllByRole('textbox');
		await user.click(startInput);
		await user.paste('2026-01-01');
		await user.keyboard('{enter}');

		expect(onChange).not.toHaveBeenCalledWith(expect.stringContaining(';'));
	});

	it('renders as uncontrolled when value is not provided', () => {
		render(<FilterDateRangePicker defaultValue="2026-01-01;2026-01-31" />);

		const [startInput, endInput] = screen.getAllByRole('textbox') as HTMLInputElement[];
		expect(startInput.value).toBe('2026-01-01');
		expect(endInput.value).toBe('2026-01-31');
	});
});
