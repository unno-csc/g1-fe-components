import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DropdownCustomLabel } from '../../components/DropdownCustomLabel';

describe('DropdownCustomLabel component', () => {
    const options = { items: [
        { key: 'a', label: 'Opción A' },
        { key: 'b', label: 'Opción B' },
    ]};

    it('shows empty label when no items', () => {
        const { container } = render(
            <DropdownCustomLabel emptyLabel="Sin opciones" onChange={vi.fn()} options={{ items: [] }} />,
        );
        expect(container).toHaveTextContent('Sin opciones');
    });

    it('updates label when selecting an item', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        render(<DropdownCustomLabel emptyLabel="Sin opciones" options={options} onChange={onChange} />);

        // Right button has aria-label set
        const trigger = await screen.findByLabelText('Abrir opciones');
        await user.click(trigger);

        // Use getAllByText because the item appears both in button label and dropdown menu
        const items = await screen.findAllByText('Opción B');
        // Click the menu item (last one, inside the dropdown)
        await user.click(items[items.length - 1]);

        expect(onChange).toHaveBeenCalledWith('b');
        expect(screen.getAllByText('Opción B').length).toBeGreaterThan(0);
    });
});


