import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	SidebarLayout,
	type SidebarLayoutProps,
} from '../../components/AppLayoutRefactor/components/Sidebar';
import type { MenuItemsProps } from '../../components/AppLayoutRefactor/components/Sidebar/components/MenuItems';

interface IDrawerMockProps {
	title?: ReactNode;
	footer?: ReactNode;
	open?: boolean;
	onClose?: () => void;
	children?: ReactNode;
}

interface IInputMockProps {
	placeholder?: string;
	value?: string;
	onChange?: (event: { target: { value: string } }) => void;
}

interface IButtonMockProps {
	icon?: ReactNode;
	onClick?: () => void;
	children?: ReactNode;
}

let lastMenuItemsProps: MenuItemsProps | undefined;
let mockOpen = true;
const mockSetOpen = vi.fn();
let mockFooterComponent: ReactNode = undefined;

vi.mock('../../hooks', () => ({
	useAppLayoutFooter: () => ({
		footerComponent: mockFooterComponent,
		setFooterComponent: vi.fn(),
		clearFooter: vi.fn(),
	}),
}));

vi.mock('../../components/AppLayoutRefactor/components/store', () => ({
	useSidebarLayoutStore: () => ({
		open: mockOpen,
		setOpen: mockSetOpen,
	}),
}));

vi.mock('../../components/Drawer/Drawer', () => ({
	Drawer: (props: IDrawerMockProps) => (
		<div data-testid="drawer" data-open={String(props.open)}>
			<div data-testid="drawer-title">{props.title}</div>
			<div data-testid="drawer-body">{props.children}</div>
			<div data-testid="drawer-footer">{props.footer}</div>
		</div>
	),
}));

vi.mock(
	'../../components/AppLayoutRefactor/components/Sidebar/components/MenuItems',
	() => ({
		MenuItems: (props: MenuItemsProps) => {
			lastMenuItemsProps = props;
			return <div data-testid="menu-items" data-search={props.searchTerm} />;
		},
	}),
);

vi.mock('antd', async () => {
	const actual = await vi.importActual<Record<string, unknown>>('antd');
	return {
		...actual,
		Input: (props: IInputMockProps) => (
			<input
				data-testid="search-input"
				placeholder={props.placeholder}
				value={props.value}
				onChange={e => props.onChange?.({ target: { value: e.target.value } })}
			/>
		),
		Button: (props: IButtonMockProps) => (
			<button data-testid="antd-button" onClick={props.onClick} type="button">
				{props.icon}
				{props.children}
			</button>
		),
	};
});

describe('SidebarLayout', () => {
	const mockMenuItemsNavigate = vi.fn();

	const renderSidebarLayout = (props: Partial<SidebarLayoutProps> = {}) => {
		const defaultProps: SidebarLayoutProps = {
			loadingAppLayout: false,
			menuItemsNavigate: mockMenuItemsNavigate,
			children: <div data-testid="default-children">Default content</div>,
			...props,
		};
		return render(<SidebarLayout {...defaultProps} />);
	};

	beforeEach(() => {
		vi.clearAllMocks();
		mockOpen = true;
		mockFooterComponent = undefined;
		lastMenuItemsProps = undefined;
	});

	it('renders sidebar drawer and children correctly', () => {
		const { container } = renderSidebarLayout({
			children: <div data-testid="sidebar-children">Test content</div>,
		});

		expect(screen.getByTestId('drawer')).toBeInTheDocument();
		expect(screen.getByTestId('search-input')).toBeInTheDocument();
		expect(screen.getByTestId('menu-items')).toBeInTheDocument();
		expect(screen.getByTestId('sidebar-children')).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it('updates searchTerm and passes it to MenuItems when typing in search input', () => {
		renderSidebarLayout();

		const searchInput = screen.getByTestId('search-input');
		fireEvent.change(searchInput, { target: { value: 'Vehículos' } });

		expect(lastMenuItemsProps?.searchTerm).toBe('Vehículos');
	});

	it('navigates to Home and closes drawer when Inicio button is clicked', () => {
		renderSidebarLayout();

		const buttons = screen.getAllByTestId('antd-button');
		const homeButton = buttons[0];
		fireEvent.click(homeButton);

		expect(mockSetOpen).toHaveBeenCalledWith(false);
		expect(mockMenuItemsNavigate).toHaveBeenCalledWith({
			id: 0,
			name: 'Home',
			path: '/home',
			icon: 'home',
			root: true,
			roleId: 0,
		});
	});

	it('closes drawer when collapse footer button is clicked', () => {
		renderSidebarLayout();

		const buttons = screen.getAllByTestId('antd-button');
		const collapseButton = buttons[1];
		fireEvent.click(collapseButton);

		expect(mockSetOpen).toHaveBeenCalledWith(false);
	});

	it('renders footerComponent when provided by AppLayoutFooterContext', () => {
		mockFooterComponent = <div data-testid="custom-footer">Footer Content</div>;
		renderSidebarLayout();

		expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
	});
});
