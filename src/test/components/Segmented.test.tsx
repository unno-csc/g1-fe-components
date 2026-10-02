import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Segmented } from '../../components/Segmented';

describe('Segmented component', () => {
	const defaultOptions = [
		{ label: 'Todos', value: 'all' },
		{ label: 'Con Garantia', value: 'warranty' },
		{ label: 'Sin Garantia', value: 'no_warranty' },
	];

	it('renders correctly with default options and selected value', () => {
		const { container } = render(
			<Segmented options={defaultOptions} value="all" />
		);

		expect(screen.getByText('Todos')).toBeInTheDocument();
		expect(screen.getByText('Con Garantia')).toBeInTheDocument();
		expect(screen.getByText('Sin Garantia')).toBeInTheDocument();

		const rootElement = container.querySelector('.itsa-segmented');
		expect(rootElement).toBeInTheDocument();
		expect(rootElement).toHaveClass('itsa-segmented--default');

		expect(container).toMatchSnapshot();
	});

	it('triggers onChange when another option is clicked', () => {
		const handleChange = vi.fn();
		render(
			<Segmented
				options={defaultOptions}
				value="all"
				onChange={handleChange}
			/>
		);

		const warrantyOption = screen.getByText('Con Garantia');
		fireEvent.click(warrantyOption);

		expect(handleChange).toHaveBeenCalledTimes(1);
		expect(handleChange).toHaveBeenCalledWith('warranty');
	});

	it('renders with brand variant class', () => {
		const { container } = render(
			<Segmented
				variant="brand"
				options={defaultOptions}
				value="all"
			/>
		);

		const rootElement = container.querySelector('.itsa-segmented');
		expect(rootElement).toHaveClass('itsa-segmented--brand');
		expect(container).toMatchSnapshot();
	});

	it('supports custom size prop', () => {
		const { container: containerSmall } = render(
			<Segmented size="small" options={defaultOptions} value="all" />
		);
		expect(containerSmall.querySelector('.ant-segmented-sm')).toBeInTheDocument();

		const { container: containerLarge } = render(
			<Segmented size="large" options={defaultOptions} value="all" />
		);
		expect(containerLarge.querySelector('.ant-segmented-lg')).toBeInTheDocument();
	});

	it('merges custom className properly', () => {
		const { container } = render(
			<Segmented
				className="my-custom-segmented"
				options={defaultOptions}
				value="all"
			/>
		);

		const rootElement = container.querySelector('.itsa-segmented');
		expect(rootElement).toHaveClass('my-custom-segmented');
	});

	it('disables interaction when disabled prop is true', () => {
		const handleChange = vi.fn();
		const { container } = render(
			<Segmented
				disabled
				options={defaultOptions}
				value="all"
				onChange={handleChange}
			/>
		);

		const rootElement = container.querySelector('.ant-segmented-disabled');
		expect(rootElement).toBeInTheDocument();

		const warrantyOption = screen.getByText('Con Garantia');
		fireEvent.click(warrantyOption);

		expect(handleChange).not.toHaveBeenCalled();
		expect(container).toMatchSnapshot();
	});
});
