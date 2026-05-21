import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { FilterSearchContainer } from '../../components/FilterSearchContainer/FilterSearchContainer';

vi.mock('@/hooks', async () => {
	const actual = await vi.importActual<any>('@/hooks');
	return {
		...actual,
		useControlActions: vi.fn(() => ({
			setCurrentPath: vi.fn(),
			programId: undefined,
			fnApiValidatePermissionAction: vi.fn().mockResolvedValue(true),
		})),
	};
});

vi.mock('@/helpers', () => ({
	clearURLParams: vi.fn(),
}));

import { clearURLParams } from '@/helpers';

describe('FilterSearchContainer', () => {
	it('renders children and buttons', () => {
		const { container } = render(
			<FilterSearchContainer handleSubmit={vi.fn()} reset={vi.fn()}>
				<div>Child content</div>
			</FilterSearchContainer>,
		);

		expect(screen.getByText('Child content')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /limpiar filtros/i })).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it('calls handleSubmit on form submit', () => {
		const handleSubmit = vi.fn(e => e.preventDefault());
		const { container } = render(
			<FilterSearchContainer handleSubmit={handleSubmit} reset={vi.fn()}>
				<div />
			</FilterSearchContainer>,
		);

		const form = container.querySelector('form');
		expect(form).not.toBeNull();

		if (form) {
			fireEvent.submit(form);
		}

		expect(handleSubmit).toHaveBeenCalled();
	});

	it('calls reset and clearURLParams on Clear Filters button click', () => {
		const reset = vi.fn();
		render(
			<FilterSearchContainer handleSubmit={vi.fn()} reset={reset}>
				<div />
			</FilterSearchContainer>,
		);

		fireEvent.click(screen.getByRole('button', { name: /limpiar filtros/i }));
		expect(reset).toHaveBeenCalled();
		expect(clearURLParams).toHaveBeenCalled();
	});
});
