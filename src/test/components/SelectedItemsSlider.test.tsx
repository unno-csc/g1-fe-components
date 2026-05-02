import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SelectedItemsSlider, type ISelectedSliderItem } from '../../components/SelectedItemsSlider';

const items: ISelectedSliderItem[] = [
	{
		id: 1,
		eyebrow: 'RUC 1790012345001',
		title: 'Global Parts Trading LLC',
		badgeLabel: 'INTERNACIONAL',
		badgeVariant: 'info',
	},
	{
		id: 2,
		eyebrow: 'RUC 0991234567001',
		title: 'Suministros Industriales Andinos S.A.',
		badgeLabel: 'NACIONAL',
		badgeVariant: 'success',
	},
	{
		id: 3,
		eyebrow: 'RUC 1790098765001',
		title: 'Pacific Import Export Group',
		badgeLabel: 'INTERNACIONAL',
		badgeVariant: 'info',
	},
];

describe('SelectedItemsSlider component', () => {
	it('renders the first selected item', () => {
		render(<SelectedItemsSlider items={items} />);

		expect(screen.queryByText('Elementos seleccionados (3)')).not.toBeInTheDocument();
		expect(screen.getByText('Global Parts Trading LLC')).toBeInTheDocument();
		expect(screen.queryByText('Suministros Industriales Andinos S.A.')).not.toBeInTheDocument();
		expect(screen.getByText('INTERNACIONAL')).toBeInTheDocument();
		expect(screen.getByText('1 / 3')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Elemento anterior' })).toBeEnabled();
		expect(screen.getByRole('button', { name: 'Elemento siguiente' })).toBeEnabled();
	});

	it('navigates between items with arrows', () => {
		render(<SelectedItemsSlider items={items} />);

		fireEvent.click(screen.getByRole('button', { name: 'Elemento siguiente' }));

		expect(screen.queryByText('Global Parts Trading LLC')).not.toBeInTheDocument();
		expect(screen.getByText('Suministros Industriales Andinos S.A.')).toBeInTheDocument();
		expect(screen.getByText('NACIONAL')).toBeInTheDocument();
		expect(screen.getByText('2 / 3')).toBeInTheDocument();

		fireEvent.click(screen.getByRole('button', { name: 'Elemento anterior' }));

		expect(screen.getByText('Global Parts Trading LLC')).toBeInTheDocument();
		expect(screen.getByText('1 / 3')).toBeInTheDocument();
	});

	it('loops from the first item to the last item with previous arrow', () => {
		render(<SelectedItemsSlider items={items} />);

		fireEvent.click(screen.getByRole('button', { name: 'Elemento anterior' }));

		expect(screen.getByText('Pacific Import Export Group')).toBeInTheDocument();
		expect(screen.getByText('3 / 3')).toBeInTheDocument();
	});

	it('navigates with keyboard arrows', () => {
		render(<SelectedItemsSlider items={items} />);

		fireEvent.keyDown(screen.getByRole('region', { name: 'Elementos seleccionados' }), {
			key: 'ArrowRight',
		});

		expect(screen.getByText('Suministros Industriales Andinos S.A.')).toBeInTheDocument();
		expect(screen.getByText('2 / 3')).toBeInTheDocument();
	});

	it('can render only the card slider without header', () => {
		render(<SelectedItemsSlider items={items} />);

		expect(screen.queryByText('Elementos seleccionados (3)')).not.toBeInTheDocument();
		expect(screen.getByText('Global Parts Trading LLC')).toBeInTheDocument();
	});

	it('can render header when requested', () => {
		render(<SelectedItemsSlider items={items} showHeader title="Proveedores seleccionados" />);

		expect(screen.getByText('Proveedores seleccionados (3)')).toBeInTheDocument();
	});

	it('calls remove item callback with selected item', () => {
		const onRemoveItem = vi.fn();
		const firstItem = items[0];

		if (firstItem === undefined) {
			throw new Error('Missing item fixture');
		}

		render(<SelectedItemsSlider items={items} onRemoveItem={onRemoveItem} />);

		fireEvent.click(screen.getByRole('button', { name: 'Quitar elemento Global Parts Trading LLC' }));

		expect(onRemoveItem).toHaveBeenCalledWith(firstItem);
	});

	it('renders custom card content without removing the delete action', () => {
		render(
			<SelectedItemsSlider
				items={items}
				onRemoveItem={vi.fn()}
				renderItem={item => <strong>Custom content for {item.title}</strong>}
			/>,
		);

		expect(screen.getByText('Custom content for Global Parts Trading LLC')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Quitar elemento Global Parts Trading LLC' })).toBeEnabled();
	});

	it('renders empty state', () => {
		render(
			<SelectedItemsSlider
				items={[]}
				title="Proveedores seleccionados"
				emptyMessage="No hay proveedores seleccionados"
			/>,
		);

		expect(screen.queryByText('Proveedores seleccionados (0)')).not.toBeInTheDocument();
		expect(screen.getByText('No hay proveedores seleccionados')).toBeInTheDocument();
	});
});
