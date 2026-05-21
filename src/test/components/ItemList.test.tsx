import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ItemList } from '../../components/ItemList';

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

describe('ItemList component', () => {
    const baseProps = {
        title: 'Title',
        description: 'Description',
        time: '10:00',
    };

    it('renders title, description and time', () => {
        const { container } = render(<ItemList {...baseProps} />);
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(screen.getByText('10:00')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('renders delete button and calls onDelete', async () => {
        const onDelete = vi.fn();
        render(<ItemList {...baseProps} onDelete={onDelete} />);
        const btn = screen.getByRole('button');
        await userEvent.click(btn);
        expect(onDelete).toHaveBeenCalled();
    });
});


