import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { AppLayout } from '../../components/AppLayout';

// Mock localStorage
const localStorageMock = (() => {
	let store: Record<string, string> = {};
	return {
		getItem: vi.fn((key: string) => store[key] || null),
		setItem: vi.fn((key: string, value: string) => {
			store[key] = value;
		}),
		removeItem: vi.fn((key: string) => {
			delete store[key];
		}),
		clear: vi.fn(() => {
			store = {};
		}),
	};
})();

Object.defineProperty(window, 'localStorage', {
	value: localStorageMock,
});

let mockCurrentModule: any = undefined;
const mockSetMenuData = vi.fn();
const mockSetCollapsed = vi.fn();

vi.mock('../../store/appLayout.store', () => ({
	useAppLayoutStore: vi.fn((selector?: any) =>
		selector ? selector({ currentModule: mockCurrentModule }) : undefined,
	),
}));

vi.mock('../../store/menu.store', () => ({
	useMenuDataStore: vi.fn((selector?: any) =>
		selector ? selector({ setMenuData: mockSetMenuData }) : undefined,
	),
}));

vi.mock('../../store', async () => {
	const actual = await vi.importActual<any>('../../store');
	return {
		...actual,
		useAppLayoutStore: vi.fn((selector?: any) =>
			selector ? selector({ currentModule: mockCurrentModule }) : undefined,
		),
		useMenuDataStore: vi.fn((selector?: any) =>
			selector ? selector({ setMenuData: mockSetMenuData }) : undefined,
		),
	};
});

vi.mock('../../hooks', async () => {
	const actual = await vi.importActual<any>('../../hooks');
	return {
		...actual,
		useSidebarStore: vi.fn(() => ({ setCollapsed: mockSetCollapsed })),
		useViewportSize: vi.fn(),
		useControlActions: vi.fn(() => ({
			setCurrentPath: vi.fn(),
			programId: undefined,
			fnApiValidatePermissionAction: vi.fn().mockResolvedValue(true),
		})),
	};
});

vi.mock('../../helpers', async () => {
	const actual = await vi.importActual<any>('../../helpers');
	return {
		...actual,
		transformModuleToMenuData: vi.fn(() => []),
	};
});

let capturedSidebarProps: any;

vi.mock('../../components/AppLayout/components/HeaderLayout', () => ({
	HeaderLayout: (props: any) => (
		<div data-testid="header-layout" data-props={JSON.stringify({
			loadingAppLayout: props.loadingAppLayout,
			notifications: props.notifications,
			userActions: props.userActions,
		})}>
			Header Content
		</div>
	),
}));

vi.mock('../../components/AppLayout/components/SidebarLayout', () => ({
	SidebarLayout: (props: any) => {
		capturedSidebarProps = props;
		return (
			<div data-testid="sidebar-layout">
				{props.children}
			</div>
		);
	},
}));

describe('AppLayout', () => {
	const mockNavigateApp = vi.fn();
	const mockOnClickOptionMenu = vi.fn();

	const defaultProps = {
		loadingAppLayout: false,
		navigateApp: mockNavigateApp,
		onClickOptionMenu: mockOnClickOptionMenu,
		children: <div data-testid="test-content">Test Content</div>,
	};

	beforeEach(() => {
		vi.clearAllMocks();
		localStorageMock.clear();
		mockCurrentModule = undefined;
		capturedSidebarProps = undefined;
	});

	it('should render correctly with basic props', () => {
		const { container } = render(<AppLayout {...defaultProps} />);

		expect(screen.getByTestId('test-content')).toBeInTheDocument();
		expect(screen.getByTestId('header-layout')).toBeInTheDocument();
		expect(screen.getByTestId('sidebar-layout')).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it('should pass loadingAppLayout to HeaderLayout', () => {
		render(<AppLayout {...defaultProps} loadingAppLayout={true} />);

		const header = screen.getByTestId('header-layout');
		const headerProps = JSON.parse(header.getAttribute('data-props') || '{}');
		expect(headerProps.loadingAppLayout).toBe(true);
	});

	it('should pass notifications and userActions to HeaderLayout', () => {
		const notifications = { items: [{ key: 'n1', label: 'Notif' }] };
		const userActions = { items: [{ key: 'u1', label: 'Perfil' }] };

		render(<AppLayout {...defaultProps} notifications={notifications} userActions={userActions} />);

		const header = screen.getByTestId('header-layout');
		const headerProps = JSON.parse(header.getAttribute('data-props') || '{}');
		expect(headerProps.notifications).toEqual(notifications);
		expect(headerProps.userActions).toEqual(userActions);
	});

	it('should use default empty menus when optional props are not provided', () => {
		render(<AppLayout {...defaultProps} />);

		const header = screen.getByTestId('header-layout');
		const headerProps = JSON.parse(header.getAttribute('data-props') || '{}');
		expect(headerProps.notifications).toEqual({ items: [] });
		expect(headerProps.userActions).toEqual({ items: [] });
	});

	it('should pass loadingAppLayout and onClickOptionMenu to SidebarLayout', () => {
		render(<AppLayout {...defaultProps} />);

		expect(capturedSidebarProps).toBeDefined();
		expect(capturedSidebarProps.loadingAppLayout).toBe(false);
		expect(capturedSidebarProps.onClickOptionMenu).toBe(mockOnClickOptionMenu);
	});

	it('should render children inside SidebarLayout', () => {
		render(<AppLayout {...defaultProps} />);

		expect(screen.getByTestId('test-content')).toBeInTheDocument();
	});

	it('should render layout wrapper with correct classes', () => {
		const { container } = render(<AppLayout {...defaultProps} />);

		expect(container.querySelector('.flex.h-\\[100dvh\\].w-full.overflow-hidden')).toBeInTheDocument();
	});
});
