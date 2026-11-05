import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import {
	HeaderLayout,
	type HeaderLayoutProps,
} from '../../components/AppLayoutRefactor/components/Header';
import type { HeaderOptionsProps } from '../../components/AppLayoutRefactor/components/Header/HeaderOptions';

let mockEnvironment = 'PRODUCCION';
let capturedHeaderOptionsProps: HeaderOptionsProps | undefined;

vi.mock('../../hooks/useEnvironment', () => ({
	useEnvironment: () => mockEnvironment,
}));

vi.mock('../../components/AppLayoutRefactor/components/Header/HeaderOptions', () => ({
	HeaderOptions: (props: HeaderOptionsProps) => {
		capturedHeaderOptionsProps = props;
		return (
			<div
				data-testid="header-options"
				data-loading={String(props.loadingAppLayout)}
			>
				HeaderOptions Mock
			</div>
		);
	},
}));

describe('HeaderLayout', () => {
	const mockOnCloseSession = vi.fn();
	const mockMenuItemsNavigate = vi.fn();

	const defaultProps: HeaderLayoutProps = {
		optionsCompany: [{ label: 'Empresa 1', value: '1' }],
		loadingAppLayout: false,
		onCloseSession: mockOnCloseSession,
		menuItemsNavigate: mockMenuItemsNavigate,
		userActions: {
			items: [
				{ key: 'u1', label: 'Perfil' },
				{ key: 'u2', label: 'Cerrar sesión' },
			],
		},
	};

	beforeEach(() => {
		vi.clearAllMocks();
		mockEnvironment = 'PRODUCCION';
		capturedHeaderOptionsProps = undefined;
	});

	it('should render correctly in PRODUCCION environment without watermark', () => {
		const { container } = render(<HeaderLayout {...defaultProps} />);

		expect(screen.getByTestId('header-options')).toBeInTheDocument();
		expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it('should render environment watermark when environment is DESARROLLO', () => {
		mockEnvironment = 'DESARROLLO';
		const { container } = render(<HeaderLayout {...defaultProps} />);

		expect(screen.getByTestId('header-options')).toBeInTheDocument();
		expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it('should forward all props to HeaderOptions', () => {
		render(<HeaderLayout {...defaultProps} loadingAppLayout={true} />);

		expect(capturedHeaderOptionsProps).toBeDefined();
		expect(capturedHeaderOptionsProps?.loadingAppLayout).toBe(true);
		expect(capturedHeaderOptionsProps?.optionsCompany).toEqual(defaultProps.optionsCompany);
		expect(capturedHeaderOptionsProps?.onCloseSession).toBe(mockOnCloseSession);
		expect(capturedHeaderOptionsProps?.menuItemsNavigate).toBe(mockMenuItemsNavigate);
		expect(capturedHeaderOptionsProps?.userActions).toEqual(defaultProps.userActions);
	});
});
