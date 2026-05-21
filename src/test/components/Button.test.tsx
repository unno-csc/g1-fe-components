import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../../components/Button';

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

describe('Button component', () => {
	it('renders label text', () => {
		const { container } = render(<Button label="Click me" />);
		expect(screen.getByText('Click me')).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it('passes props to AntButton', () => {
		const { container } = render(<Button type="primary" label="Primary" />);
		const button = screen.getByRole('button');
		expect(button).toHaveClass('ant-btn-primary');
		expect(container).toMatchSnapshot();
	});

	it('calls onClick handler when clicked', () => {
		const handleClick = vi.fn();
		const { container } = render(<Button onClick={handleClick} label="Click" />);
		const button = screen.getByRole('button');
		fireEvent.click(button);
		expect(handleClick).toHaveBeenCalledTimes(1);
		expect(container).toMatchSnapshot();
	});

	it('renders disabled button', () => {
		const { container } = render(<Button disabled label="Disabled" />);
		const button = screen.getByRole('button');
		expect(button).toBeDisabled();
		expect(container).toMatchSnapshot();
	});
});
