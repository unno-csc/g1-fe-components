import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ButtonWithIcon } from '../../components/ButtonWithIcon';

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

describe('ButtonWithIcon component', () => {
	it('renders label text', () => {
		const { container } = render(<ButtonWithIcon label="Click me" />);
		expect(screen.getByText('Click me')).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it('renders with an icon', () => {
		const { container } = render(<ButtonWithIcon label="With Icon" icon={<span data-testid="test-icon">🔥</span>} />);
		expect(screen.getByTestId('test-icon')).toBeInTheDocument();
		expect(screen.getByText('With Icon')).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it('passes props to AntButton', () => {
		const { container } = render(<ButtonWithIcon type="primary" label="Primary" />);
		const button = screen.getByRole('button');
		expect(button).toHaveClass('ant-btn-primary');
		expect(container).toMatchSnapshot();
	});

	it('renders danger type with correct classes', () => {
		const { container } = render(<ButtonWithIcon type="danger" label="Danger" />);
		const button = screen.getByRole('button');
		expect(button).toHaveClass('itsa-btn--danger');
		expect(container).toMatchSnapshot();
	});

	it('calls onClick handler when clicked', () => {
		const handleClick = vi.fn();
		const { container } = render(<ButtonWithIcon onClick={handleClick} label="Click" />);
		const button = screen.getByRole('button');
		fireEvent.click(button);
		expect(handleClick).toHaveBeenCalledTimes(1);
		expect(container).toMatchSnapshot();
	});

	it('renders disabled button', () => {
		const { container } = render(<ButtonWithIcon disabled label="Disabled" />);
		const button = screen.getByRole('button');
		expect(button).toBeDisabled();
		expect(container).toMatchSnapshot();
	});
});
