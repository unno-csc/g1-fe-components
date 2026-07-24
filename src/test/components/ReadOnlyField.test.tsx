import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ReadOnlyField } from '../../components/ReadOnlyField';

describe('ReadOnlyField component', () => {
	it('renders the label and value', () => {
		render(<ReadOnlyField label="Proveedor" value="Global Parts Trading LLC" />);

		expect(screen.getByText('Proveedor')).toBeInTheDocument();
		expect(screen.getByText('Global Parts Trading LLC')).toBeInTheDocument();
	});

	it('renders the default placeholder when the value is empty', () => {
		render(<ReadOnlyField label="Referencia" value="" />);

		expect(screen.getByText('-')).toBeInTheDocument();
	});

	it('renders a custom placeholder when the value is null', () => {
		render(<ReadOnlyField label="Referencia" value={null} placeholder="Sin referencia" />);

		expect(screen.getByText('Sin referencia')).toBeInTheDocument();
	});

	it('applies visual variant classes', () => {
		render(<ReadOnlyField label="Total" value="$ 1,240.50" emphasize dashed className="custom-field" />);

		const wrapper = screen.getByText('Total').parentElement?.parentElement;
		const valueContainer = screen.getByText('$ 1,240.50').parentElement;

		expect(wrapper).toHaveClass('border-dashed');
		expect(wrapper).toHaveClass('custom-field');
		expect(valueContainer).toHaveClass('font-semibold');
		expect(valueContainer).toHaveClass('text-gray-900');
	});
});
