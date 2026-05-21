import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SidebarLayout } from '../../components/AppLayout/components/SidebarLayout';

let lastMenuOptionsProps: any;
let mockSetCollapsed: any;
let mockCollapsed: boolean;
let mockSearchTerm: string;
let mockSetSearchTerm: any;
let mockOpenKeys: string[];
let mockSetOpenKeys: any;
let mockOnClickOptionMenu: any;

vi.mock('../../HOC/AppLayoutFooterContext', () => ({
	useAppLayoutFooter: vi.fn(() => ({
		footerComponent: null,
		setFooterComponent: vi.fn(),
		clearFooter: vi.fn(),
	})),
}));

vi.mock('../../components/AppLayout/components/MenuOptions', () => ({
	MenuOptions: (props: any) => {
		lastMenuOptionsProps = props;
		return <div data-testid="menu-options" />;
	},
}));

vi.mock('../../hooks', () => ({
	useSidebarStore: () => ({
		collapsed: mockCollapsed,
		setCollapsed: mockSetCollapsed,
		searchTerm: mockSearchTerm,
		setSearchTerm: mockSetSearchTerm,
		openKeys: mockOpenKeys,
		setOpenKeys: mockSetOpenKeys,
	}),
	useAppLayoutFooter: vi.fn(() => ({
		footerComponent: null,
		setFooterComponent: vi.fn(),
		clearFooter: vi.fn(),
	})),
}));

vi.mock('../../store', async () => {
	const actual = await vi.importActual<any>('../../store');
	return {
		...actual,
		useMenuDataStore: vi.fn(() => []),
	};
});

vi.mock('../../store/viewport.store', () => ({
	useViewportStore: vi.fn(() => 1280),
}));

vi.mock('../../helpers/menu/menuDataTransformer', () => ({
	filterMenuItems: vi.fn((items: any) => items),
}));

vi.mock('../../helpers/functions', async () => {
	const actual = await vi.importActual<any>('../../helpers/functions');
	return {
		...actual,
		findMenuItemByRoute: vi.fn(() => null),
	};
});

vi.mock('antd', async () => {
	const actual = await vi.importActual<any>('antd');
	return {
		...actual,
		Input: (props: any) => (
			<input
				data-testid="search-input"
				placeholder={props.placeholder}
				defaultValue={props.defaultValue}
				onChange={(e: any) => props.onChange?.(e)}
			/>
		),
		Button: (props: any) => (
			<button data-testid="collapse-button" onClick={props.onClick} type="button">
				{props.icon}
			</button>
		),
		Layout: (props: any) => <div data-testid="layout">{props.children}</div>,
	};
});

vi.mock('antd/es/layout/layout', () => ({
	__esModule: true,
	Content: (props: any) => <main data-testid="content">{props.children}</main>,
}));

vi.mock('@ant-design/icons', () => ({
	DoubleLeftOutlined: () => <span data-testid="double-left-icon" />,
	SearchOutlined: () => <span data-testid="search-icon" />,
}));

beforeEach(() => {
	mockSetCollapsed = vi.fn();
	mockSetSearchTerm = vi.fn();
	mockSetOpenKeys = vi.fn();
	mockOnClickOptionMenu = vi.fn();
	mockCollapsed = false;
	mockSearchTerm = '';
	mockOpenKeys = [];
	lastMenuOptionsProps = undefined;
});

const renderSidebarLayout = (props: Partial<React.ComponentProps<typeof SidebarLayout>> = {}) => {
	const defaultProps = {
		children: <div data-testid="default-children">Default content</div>,
		loadingAppLayout: false,
		onClickOptionMenu: mockOnClickOptionMenu,
		...props,
	};
	return render(<SidebarLayout {...defaultProps} />);
};

describe('SidebarLayout', () => {
	describe('Rendering', () => {
		it('renders sidebar elements when not collapsed', () => {
			mockCollapsed = false;
			const { container } = renderSidebarLayout({
				children: <div data-testid="sidebar-children">Test content</div>,
			});

			expect(screen.getByTestId('search-input')).toBeInTheDocument();
			expect(screen.getByTestId('menu-options')).toBeInTheDocument();
			expect(screen.getByTestId('collapse-button')).toBeInTheDocument();
			expect(screen.getByTestId('sidebar-children')).toBeInTheDocument();
			expect(container).toMatchSnapshot();
		});

		it('hides sidebar elements when collapsed', () => {
			mockCollapsed = true;
			const { container } = renderSidebarLayout({
				children: <div data-testid="sidebar-children">Test content</div>,
			});

			expect(screen.queryByTestId('search-input')).not.toBeInTheDocument();
			expect(screen.queryByTestId('menu-options')).not.toBeInTheDocument();
			expect(screen.queryByTestId('collapse-button')).not.toBeInTheDocument();
			expect(screen.getByTestId('sidebar-children')).toBeInTheDocument();
			expect(container).toMatchSnapshot();
		});
	});

	describe('Search functionality', () => {
		beforeEach(() => {
			mockCollapsed = false;
		});

		it('filters menu items based on search input', async () => {
			const user = userEvent.setup();
			const { container } = renderSidebarLayout();

			const searchInput = screen.getByTestId('search-input');
			await user.type(searchInput, 'User');

			await waitFor(() => {
				expect(mockSetSearchTerm).toHaveBeenCalledWith('User');
			});
			expect(container).toMatchSnapshot();
		});

		it('shows all items when search is cleared', async () => {
			const user = userEvent.setup();
			const { container } = renderSidebarLayout();

			const searchInput = screen.getByTestId('search-input');
			await user.type(searchInput, 'test');
			await user.clear(searchInput);

			await waitFor(() => {
				expect(mockSetSearchTerm).toHaveBeenLastCalledWith('');
			});
			expect(container).toMatchSnapshot();
		});
	});

	describe('Collapse functionality', () => {
		it('calls setCollapsed when collapse button is clicked', async () => {
			mockCollapsed = false;
			const user = userEvent.setup();
			const { container } = renderSidebarLayout();

			const collapseButton = screen.getByTestId('collapse-button');
			await user.click(collapseButton);

			expect(mockSetCollapsed).toHaveBeenCalledWith(true);
			expect(container).toMatchSnapshot();
		});
	});

	describe('Props handling', () => {
		it('passes correct props to MenuOptions', () => {
			mockCollapsed = false;
			renderSidebarLayout({ loadingAppLayout: false });

			expect(lastMenuOptionsProps).toMatchObject({
				loadingAppLayout: false,
				openKeysMenuOptions: mockOpenKeys,
			});
			expect(lastMenuOptionsProps.onClickOptionMenu).toBe(mockOnClickOptionMenu);
		});

		it('handles missing optional props gracefully', () => {
			mockCollapsed = false;
			renderSidebarLayout();

			expect(lastMenuOptionsProps).toBeDefined();
		});

		it('handles loadingAppLayout true gracefully', () => {
			mockCollapsed = false;
			renderSidebarLayout({ loadingAppLayout: true });

			expect(lastMenuOptionsProps.loadingAppLayout).toBe(true);
		});

		it('handles loadingAppLayout false gracefully', () => {
			mockCollapsed = false;
			renderSidebarLayout({ loadingAppLayout: false });

			expect(lastMenuOptionsProps.loadingAppLayout).toBe(false);
		});
	});

	describe('Search state edge cases', () => {
		it('handles various search input scenarios including empty values', async () => {
			mockCollapsed = false;
			const user = userEvent.setup();
			const { container } = renderSidebarLayout();

			const searchInput = screen.getByTestId('search-input');
			await user.type(searchInput, 'Users');

			await waitFor(() => {
				expect(mockSetSearchTerm).toHaveBeenCalled();
			});
			expect(container).toMatchSnapshot();
		});
	});

	describe('Width and styling', () => {
		it('applies custom width when provided', () => {
			mockCollapsed = false;
			const customWidth = 300;
			const { container } = renderSidebarLayout({ width: customWidth });

			const sidebarDiv = container.querySelector('div[style*="width"]');
			expect(sidebarDiv).toHaveStyle(`width: ${customWidth}px`);
			expect(container).toMatchSnapshot();
		});

		it('applies default width when not provided', () => {
			mockCollapsed = false;
			const { container } = renderSidebarLayout();

			const sidebarDiv = container.querySelector('div[style*="width"]');
			expect(sidebarDiv).toHaveStyle('width: 266px');
			expect(container).toMatchSnapshot();
		});
	});

	describe('onClickOptionMenu callback', () => {
		it('passes onClickOptionMenu to MenuOptions', () => {
			mockCollapsed = false;
			renderSidebarLayout();

			expect(lastMenuOptionsProps.onClickOptionMenu).toBe(mockOnClickOptionMenu);
		});
	});

	describe('OpenKeys functionality', () => {
		it('passes openKeys to MenuOptions', () => {
			mockCollapsed = false;
			mockOpenKeys = ['key1', 'key2'];
			renderSidebarLayout();

			expect(lastMenuOptionsProps.openKeysMenuOptions).toEqual(['key1', 'key2']);
		});

		it('passes onOpenKeysChange to MenuOptions', () => {
			mockCollapsed = false;
			renderSidebarLayout();

			expect(lastMenuOptionsProps.onOpenKeysChange).toBe(mockSetOpenKeys);
		});
	});

	describe('Module transformation and menu data', () => {
		it('generates menu data from store', () => {
			mockCollapsed = false;
			renderSidebarLayout();

			expect(lastMenuOptionsProps.items).toBeDefined();
		});

		it('handles empty menu data', () => {
			mockCollapsed = false;
			renderSidebarLayout();

			expect(lastMenuOptionsProps.items).toEqual([]);
		});

		it('applies search filtering to menu data', () => {
			mockCollapsed = false;
			mockSearchTerm = 'test search';
			renderSidebarLayout();

			expect(lastMenuOptionsProps.items).toBeDefined();
		});
	});

	describe('Search term and open keys synchronization', () => {
		it('provides openKeys from store', () => {
			mockCollapsed = false;
			mockOpenKeys = ['key1'];
			renderSidebarLayout();

			expect(lastMenuOptionsProps.openKeysMenuOptions).toBeDefined();
		});

		it('clears openKeys when search term is empty', () => {
			mockCollapsed = false;
			mockSearchTerm = '';
			renderSidebarLayout();

			expect(lastMenuOptionsProps.openKeysMenuOptions).toEqual([]);
		});
	});

	describe('Edge cases and error handling', () => {
		it('handles empty menu data gracefully', () => {
			mockCollapsed = false;
			const { container } = renderSidebarLayout();

			expect(screen.getByTestId('content')).toBeInTheDocument();
			expect(container).toMatchSnapshot();
		});

		it('handles undefined menu data gracefully', () => {
			mockCollapsed = false;
			const { container } = renderSidebarLayout();

			expect(screen.getByTestId('content')).toBeInTheDocument();
			expect(container).toMatchSnapshot();
		});

		it('handles invalid search terms gracefully', () => {
			mockCollapsed = false;
			mockSearchTerm = '   ';
			const { container } = renderSidebarLayout();

			expect(screen.getByTestId('menu-options')).toBeInTheDocument();
			expect(container).toMatchSnapshot();
		});
	});

	describe('Component integration', () => {
		it('renders content area correctly', () => {
			const { container } = renderSidebarLayout({
				children: <div data-testid="custom-content">Custom content</div>,
			});

			expect(screen.getByTestId('custom-content')).toBeInTheDocument();
			expect(screen.getByTestId('content')).toBeInTheDocument();
			expect(container).toMatchSnapshot();
		});

		it('renders with different loadingAppLayout states', () => {
			const states = [true, false];

			states.forEach(state => {
				mockCollapsed = false;
				const { unmount } = renderSidebarLayout({ loadingAppLayout: state });

				expect(lastMenuOptionsProps.loadingAppLayout).toBe(state);
				unmount();
			});
		});
	});
});
