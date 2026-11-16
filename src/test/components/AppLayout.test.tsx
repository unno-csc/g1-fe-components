import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { AppLayout, type AppLayoutProps } from '../../components/AppLayoutRefactor';
import type { HeaderLayoutProps } from '../../components/AppLayoutRefactor/components/Header';
import type { SidebarLayoutProps } from '../../components/AppLayoutRefactor/components/Sidebar';

const mockUseAppLayoutSelectionPersistence = vi.fn();

vi.mock('../../components/AppLayoutRefactor/components/store', () => ({
	useAppLayoutSelectionPersistence: (...args: unknown[]) =>
		mockUseAppLayoutSelectionPersistence(...args),
	useAppLayoutStore: vi.fn(),
	useSidebarLayoutStore: vi.fn(),
	resolveCompany: vi.fn(),
	resolvePermissionSelection: vi.fn(),
}));

let capturedHeaderProps: HeaderLayoutProps | undefined;
let capturedSidebarProps: SidebarLayoutProps | undefined;

vi.mock('../../components/AppLayoutRefactor/components/Header', () => ({
	HeaderLayout: (props: HeaderLayoutProps) => {
		capturedHeaderProps = props;
		return (
			<div
				data-testid="header-layout"
				data-props={JSON.stringify({
					loadingAppLayout: props.loadingAppLayout,
					optionsCompany: props.optionsCompany,
					userActions: props.userActions,
				})}
			>
				Header Content
			</div>
		);
	},
}));

vi.mock('../../components/AppLayoutRefactor/components/Sidebar', () => ({
	SidebarLayout: (props: SidebarLayoutProps) => {
		capturedSidebarProps = props;
		return <div data-testid="sidebar-layout">{props.children}</div>;
	},
}));

describe('AppLayout', () => {
	const mockMenuItemsNavigate = vi.fn();
	const mockOnCloseSession = vi.fn();

	const defaultProps: AppLayoutProps = {
		optionsCompany: [{ label: 'Empresa 1', value: '1' }],
		loadingAppLayout: false,
		onCloseSession: mockOnCloseSession,
		menuItemsNavigate: mockMenuItemsNavigate,
		userActions: { items: [] },
		children: <div data-testid="test-content">Test Content</div>,
	};

	beforeEach(() => {
		vi.clearAllMocks();
		capturedHeaderProps = undefined;
		capturedSidebarProps = undefined;
	});

	it('should render correctly with basic props', () => {
		const { container } = render(<AppLayout {...defaultProps} />);

		expect(screen.getByTestId('test-content')).toBeInTheDocument();
		expect(screen.getByTestId('header-layout')).toBeInTheDocument();
		expect(screen.getByTestId('sidebar-layout')).toBeInTheDocument();
		expect(mockUseAppLayoutSelectionPersistence).toHaveBeenCalledWith(
			defaultProps.optionsCompany,
			false,
		);
		expect(container).toMatchSnapshot();
	});

	it('should pass loadingAppLayout to HeaderLayout', () => {
		render(<AppLayout {...defaultProps} loadingAppLayout={true} />);

		expect(capturedHeaderProps?.loadingAppLayout).toBe(true);
	});

	it('should pass optionsCompany and userActions to HeaderLayout', () => {
		const userActions = { items: [{ key: 'u1', label: 'Perfil' }] };

		render(<AppLayout {...defaultProps} userActions={userActions} />);

		expect(capturedHeaderProps?.userActions).toEqual(userActions);
		expect(capturedHeaderProps?.optionsCompany).toEqual(defaultProps.optionsCompany);
		expect(capturedHeaderProps?.onCloseSession).toBe(mockOnCloseSession);
		expect(capturedHeaderProps?.menuItemsNavigate).toBe(mockMenuItemsNavigate);
	});

	it('should pass loadingAppLayout and menuItemsNavigate to SidebarLayout', () => {
		render(<AppLayout {...defaultProps} />);

		expect(capturedSidebarProps).toBeDefined();
		expect(capturedSidebarProps?.loadingAppLayout).toBe(false);
		expect(capturedSidebarProps?.menuItemsNavigate).toBe(mockMenuItemsNavigate);
	});

	it('should render children inside SidebarLayout', () => {
		render(<AppLayout {...defaultProps} />);

		expect(screen.getByTestId('test-content')).toBeInTheDocument();
	});

	it('should render layout wrapper with correct classes', () => {
		const { container } = render(<AppLayout {...defaultProps} />);

		expect(
			container.querySelector('.flex.h-\\[100dvh\\].w-full.min-w-0.overflow-hidden'),
		).toBeInTheDocument();
	});
});
