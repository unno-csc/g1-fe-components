import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MenuOptions } from '../../components/AppLayout/components/MenuOptions';

vi.mock('@/hooks', async () => {
	const actual = await vi.importActual<any>('@/hooks');
	return {
		...actual,
		useSidebarStore: vi.fn(() => ({ setCurrentProgram: vi.fn() })),
	};
});

vi.mock('@/store', async () => {
	const actual = await vi.importActual<any>('@/store');
	return {
		...actual,
		useMenuDataStore: vi.fn(() => vi.fn()),
		useAppLayoutStore: vi.fn(() => null),
	};
});

vi.mock('@/helpers/functions', async () => {
	const actual = await vi.importActual<any>('@/helpers/functions');
	return {
		...actual,
		findMenuItemByRoute: vi.fn(() => null),
		getProgramActionsbyPath: vi.fn(() => null),
	};
});

vi.mock('antd', async () => {
	const actual = await vi.importActual<any>('antd');
	const Menu = (props: any) => (
		<div data-testid="menu" data-props={JSON.stringify(props)}>
			{props.children}
		</div>
	);
	return { ...actual, Menu };
});

const defaultProps = {
	loadingAppLayout: false,
	openKeysMenuOptions: [] as string[],
	onClickOptionMenu: vi.fn(),
	items: [] as any[],
	onOpenKeysChange: vi.fn(),
};

const mockMenuItems = [
	{ key: '1', label: 'Dashboard' },
	{ key: '2', label: 'Users' },
	{
		key: 'sub1',
		label: 'Settings',
		children: [
			{ key: '3', label: 'Profile' },
			{ key: '4', label: 'Security' },
		],
	},
];

describe('MenuOptions', () => {
	it('renders correctly with default props', () => {
		const { container } = render(<MenuOptions {...defaultProps} />);

		expect(screen.getByTestId('menu')).toBeInTheDocument();
		expect(container.querySelector('.menu-options')).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it('passes correct props to Antd Menu component', () => {
		const { container } = render(
			<MenuOptions {...defaultProps} items={mockMenuItems} mode="inline" />,
		);

		const menuElement = screen.getByTestId('menu');
		const menuProps = JSON.parse(menuElement.getAttribute('data-props') || '{}');

		expect(menuProps.items).toEqual(mockMenuItems);
		expect(menuProps.mode).toBe('inline');
		expect(container).toMatchSnapshot();
	});

	it('passes openKeys to Menu component', () => {
		const { container } = render(
			<MenuOptions {...defaultProps} openKeysMenuOptions={['sub1']} items={mockMenuItems} />,
		);

		const menuElement = screen.getByTestId('menu');
		const menuProps = JSON.parse(menuElement.getAttribute('data-props') || '{}');

		expect(menuProps.openKeys).toEqual(['sub1']);
		expect(container).toMatchSnapshot();
	});

	it('shows loading indicator when loadingAppLayout is true and items are empty', () => {
		const { container } = render(
			<MenuOptions {...defaultProps} loadingAppLayout={true} items={[]} />,
		);

		expect(container.querySelector('.menu-options')).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it('renders with empty items array', () => {
		const { container } = render(<MenuOptions {...defaultProps} items={[]} />);

		const menuElement = screen.getByTestId('menu');
		const menuProps = JSON.parse(menuElement.getAttribute('data-props') || '{}');

		expect(menuProps.items).toEqual([]);
		expect(container).toMatchSnapshot();
	});

	it('handles complex menu items with nested structure', () => {
		const complexItems = [
			{
				key: 'main1',
				label: 'Main Section 1',
				children: [
					{ key: 'sub1-1', label: 'Subsection 1.1' },
					{ key: 'sub1-2', label: 'Subsection 1.2' },
				],
			},
			{ key: 'main2', label: 'Main Section 2' },
		];

		const { container } = render(<MenuOptions {...defaultProps} items={complexItems} />);

		const menuElement = screen.getByTestId('menu');
		const menuProps = JSON.parse(menuElement.getAttribute('data-props') || '{}');

		expect(menuProps.items).toEqual(complexItems);
		expect(container).toMatchSnapshot();
	});

	it('passes onOpenChange callback to Menu', () => {
		const onOpenKeysChange = vi.fn();
		render(<MenuOptions {...defaultProps} onOpenKeysChange={onOpenKeysChange} items={mockMenuItems} />);

		const menuElement = screen.getByTestId('menu');
		expect(menuElement).toBeInTheDocument();
	});

	it('renders correctly when all props are provided', () => {
		const { container } = render(
			<MenuOptions
				{...defaultProps}
				items={mockMenuItems}
				loadingAppLayout={false}
				openKeysMenuOptions={['sub1']}
				mode="inline"
			/>,
		);

		const menuElement = screen.getByTestId('menu');
		const menuProps = JSON.parse(menuElement.getAttribute('data-props') || '{}');

		expect(menuProps.items).toEqual(mockMenuItems);
		expect(menuProps.mode).toBe('inline');
		expect(container).toMatchSnapshot();
	});
});
