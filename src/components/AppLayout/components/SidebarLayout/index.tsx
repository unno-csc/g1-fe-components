import { Button, Input, Layout } from 'antd';
import { ReactNode, useEffect, useMemo } from 'react';
import { DoubleLeftOutlined, SearchOutlined } from '@ant-design/icons';
import { useAppLayoutFooter } from '@/HOC/AppLayoutFooterContext';
import { Content } from 'antd/es/layout/layout';
import { useSidebarStore } from '@/hooks';
import { MenuOptions } from '../MenuOptions';
import { useMenuDataStore } from '@/store';
import { useViewportStore } from '@/store/viewport.store';
import { filterMenuItems } from '@/helpers/menu/menuDataTransformer';
import { TExtendedMenuItem } from '@/types';
import { findMenuItemByRoute } from '@/helpers/functions';

export interface SidebarLayoutProps {
	children: ReactNode;
	width?: number;
	loadingAppLayout: boolean;
	onClickOptionMenu: (info: { key: string; item: TExtendedMenuItem }) => void;
}

export const SidebarLayout = ({ children, width = 245, loadingAppLayout, onClickOptionMenu }: SidebarLayoutProps) => {
	const { collapsed, searchTerm, openKeys } = useSidebarStore();
	const { setSearchTerm, setCollapsed, setOpenKeys } = useSidebarStore();
	const menuData = useMenuDataStore(state => state.menuData);
	const { footerComponent } = useAppLayoutFooter();
	const currentPath = window.location.pathname;
	const viewportWidth = useViewportStore(state => state.width);
	const isMobile = viewportWidth < 1024;

	useEffect(() => {
		if (isMobile && !collapsed) {
			setCollapsed(true);
		}
	}, [isMobile]);

	const getParentKeys = (menuItems: TExtendedMenuItem[], targetKey: string, parents: string[] = []): string[] | null => {
		for (const item of menuItems) {
			const itemKey = item?.key !== undefined ? String(item.key) : undefined;
			const nextParents = itemKey ? [...parents, itemKey] : parents;

			if (itemKey === targetKey) {
				return parents;
			}

			if ('children' in item && item.children?.length) {
				const found = getParentKeys(item.children as TExtendedMenuItem[], targetKey, nextParents);
				if (found) return found;
			}
		}
		return null;
	};

	const menuDataFiltered = useMemo(() => {
		const searchTermTrim = searchTerm.trim();
		if (searchTermTrim.length === 0) {
			return menuData;
		}
		const filterResult = filterMenuItems(menuData, searchTermTrim);
		return filterResult;
	}, [searchTerm, menuData]);

	const menuDataFilteredForMenu = useMemo(() => {
		if (!menuDataFiltered.length) {
			return [];
		}

		const filterRecursive = (items: TExtendedMenuItem[]): TExtendedMenuItem[] => {
			return items
				.map(item => {
					const hasChildren = 'children' in item && item.children?.length;
					const filteredChildren = hasChildren ? filterRecursive(item.children as TExtendedMenuItem[]) : undefined;
					const path = item.data?.path;
					const isUpdatePath = typeof path === 'string' && path.includes('/update');

					if (isUpdatePath) {
						return null;
					}

					if (hasChildren && (!filteredChildren || filteredChildren.length === 0)) {
						return null;
					}

					if (filteredChildren) {
						return { ...item, children: filteredChildren };
					}

					return item;
				})
				.filter(Boolean) as TExtendedMenuItem[];
		};

		return filterRecursive(menuDataFiltered);
	}, [menuDataFiltered]);

	useEffect(() => {
		if (!menuDataFilteredForMenu.length) {
			setOpenKeys([]);
			return;
		}

		const selectedItem = findMenuItemByRoute(menuDataFilteredForMenu, currentPath);
		if (selectedItem?.key) {
			const parentKeys = getParentKeys(menuDataFilteredForMenu, String(selectedItem.key)) ?? [];
			setOpenKeys(parentKeys);
			return;
		}

		setOpenKeys([]);
	}, [menuDataFilteredForMenu, setOpenKeys, currentPath]);

	return (
		<>
			{isMobile && !collapsed && (
				<div
					className="fixed inset-0 bg-black-100 bg-opacity-50 z-30 lg:hidden"
					onClick={() => setCollapsed(true)}
					aria-label="Close sidebar"
				/>
			)}

			<Layout hasSider className="gap-2 h-full">
				{!collapsed && (
					<div
						className={
							isMobile
								? 'fixed left-2 top-[72px] bottom-2 flex flex-col pt-3 rounded-lg bg-gray-200 z-40 shadow-xl'
								: 'flex flex-col pt-3 rounded-lg bg-gray-200'
						}
						style={{ width: width }}
					>
						<div className="flex items-center justify-center pr-3 pl-3">
							<Input
								placeholder="Buscar en el menú"
								className="rounded-lg text-sm"
								suffix={<SearchOutlined className="text-gray-300" />}
								defaultValue={searchTerm}
								onChange={e => setSearchTerm(e.target.value)}
							/>
						</div>
						<div className="flex-1 overflow-y-auto scrollbar-none h-full max-w-full">
							<MenuOptions
								loadingAppLayout={loadingAppLayout}
								onClickOptionMenu={onClickOptionMenu}
								openKeysMenuOptions={openKeys}
								items={menuDataFilteredForMenu}
								onOpenKeysChange={setOpenKeys}
							/>
						</div>
						<div className="w-full flex justify-end pr-3 pl-3">
							<Button
								type="link"
								onClick={() => setCollapsed(!collapsed)}
								icon={<DoubleLeftOutlined className="text-gray-400" />}
							/>
						</div>
					</div>
				)}
				<Layout className="rounded-lg h-full">
					<Content className="bg-white-100 rounded-lg pt-3 h-full flex flex-col min-h-0 relative">
						<div className="flex-1 overflow-auto min-h-0 p-2">{children}</div>
						{footerComponent && (
							<div className="h-auto w-full lg:z-50 rounded-bl-lg rounded-br-lg p-1">{footerComponent}</div>
						)}
					</Content>
				</Layout>
			</Layout>
		</>
	);
};
