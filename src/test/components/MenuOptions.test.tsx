import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import {
	MenuItems,
	type MenuItemsProps,
} from '../../components/AppLayoutRefactor/components/Sidebar/components/MenuItems';
import type { IModule } from '../../interfaces';

interface IMenuMockProps {
	items?: unknown[];
	mode?: string;
	openKeys?: string[];
	selectedKeys?: string[];
	onClick?: (info: { key: string }) => void;
}

let mockModule: IModule | undefined = undefined;
let capturedMenuProps: IMenuMockProps | undefined;

vi.mock('../../components/AppLayoutRefactor/components/store', () => ({
	useAppLayoutStore: () => ({
		module: mockModule,
	}),
}));

vi.mock('antd', async () => {
	const actual = await vi.importActual<Record<string, unknown>>('antd');
	const Menu = (props: IMenuMockProps) => {
		capturedMenuProps = props;
		return (
			<div
				data-testid="menu"
				data-props={JSON.stringify({
					itemsCount: props.items?.length ?? 0,
					mode: props.mode,
					openKeys: props.openKeys,
					selectedKeys: props.selectedKeys,
				})}
				onClick={() => props.onClick?.({ key: 'program-100' })}
			/>
		);
	};
	return { ...actual, Menu };
});

describe('MenuItems', () => {
	const mockOnOpenKeysChange = vi.fn();
	const mockMenuItemsNavigate = vi.fn();

	const defaultProps: MenuItemsProps = {
		openKeysMenuOptions: [],
		onOpenKeysChange: mockOnOpenKeysChange,
		menuItemsNavigate: mockMenuItemsNavigate,
	};

	const sampleModule: IModule = {
		id: 1,
		name: 'Módulo Vehículos',
		icon: 'car',
		entorno: 'FO',
		submodules: [
			{
				id: 10,
				name: 'Mantenimientos',
				icon: 'cog',
				programs: [
					{
						id: 100,
						name: 'Catálogo',
						path: '/catalogo',
						icon: 'folder',
						root: true,
						roleId: 1,
					},
				],
			},
		],
	};

	beforeEach(() => {
		vi.clearAllMocks();
		mockModule = undefined;
		capturedMenuProps = undefined;
	});

	it('renders empty menu when module is undefined', () => {
		const { container } = render(<MenuItems {...defaultProps} />);

		expect(screen.getByTestId('menu')).toBeInTheDocument();
		expect(capturedMenuProps?.items).toEqual([]);
		expect(container).toMatchSnapshot();
	});

	it('renders menu items from current module', () => {
		mockModule = sampleModule;
		const { container } = render(
			<MenuItems {...defaultProps} openKeysMenuOptions={['submodule-10']} />,
		);

		expect(capturedMenuProps?.items).toHaveLength(1);
		expect(capturedMenuProps?.openKeys).toEqual(['submodule-10']);
		expect(container).toMatchSnapshot();
	});

	it('calls menuItemsNavigate when a program item is clicked', () => {
		mockModule = sampleModule;
		render(<MenuItems {...defaultProps} />);

		fireEvent.click(screen.getByTestId('menu'));

		expect(mockMenuItemsNavigate).toHaveBeenCalledWith(
			sampleModule.submodules[0].programs?.[0],
		);
	});

	it('expands matching submenu keys when searchTerm is provided', () => {
		mockModule = sampleModule;
		render(<MenuItems {...defaultProps} searchTerm="Catálogo" />);

		expect(mockOnOpenKeysChange).toHaveBeenCalledWith(['submodule-10']);
	});

	it('filters out non-root programs (root: false) from the menu', () => {
		mockModule = {
			...sampleModule,
			submodules: [
				{
					...sampleModule.submodules[0],
					programs: [
						{
							id: 100,
							name: 'Catálogo',
							path: '/catalogo',
							icon: 'folder',
							root: true,
							roleId: 1,
						},
						{
							id: 101,
							name: 'Crear Catálogo',
							path: '/catalogo/create',
							icon: 'plus',
							root: false,
							roleId: 1,
						},
					],
				},
			],
		};
		render(<MenuItems {...defaultProps} />);

		const item = capturedMenuProps?.items?.[0] as { children?: unknown[] } | undefined;
		expect(item?.children).toHaveLength(1);
	});
});
