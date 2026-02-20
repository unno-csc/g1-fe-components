import MenuOptions from '@/components/AppLayoutUno/components/MenuOptions';
import { getAllMenuKeys, transformModuleToMenuData } from '@/helpers';
import { findMenuItemByRoute, getStoredCollapsedSidebar, setStoredCollapsedSidebar } from '@/helpers/functions';
import { filterMenuItems } from '@/helpers/menu/menuDataTransformer';
import { useSidebarStore } from '@/hooks';
import { useAppLayoutStore } from '@/store/appLayout.store';
import { useViewportStore } from '@/store/viewport.store';
import { TExtendedMenuItem, TMenuMode } from '@/types';
import { DoubleLeftOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useAppLayoutFooter } from '../../../../HOC/AppLayoutFooterContext';

export interface SidebarLayoutProps {
	children: ReactNode;
	onClickOptionMenu: (info: { key: string; item: TExtendedMenuItem }) => void;
	width?: number;
	currentPath?: string;
	modeSidebar?: TMenuMode;
	loadingMenu?: boolean;
}
export const SidebarLayout = ({
	children,
	onClickOptionMenu,
	width = 235,
	currentPath = '',
	modeSidebar = 'inline',
	loadingMenu = false,
	}: SidebarLayoutProps) => {
	const [, setStoredCollapsed] = useState(getStoredCollapsedSidebar());
	const { footerComponent } = useAppLayoutFooter();
	const currentModule = useAppLayoutStore(state => state.currentModule);
	const windowWidth = useViewportStore(state => state.width);
	const { collapsed, setCollapsed, searchTerm, setSearchTerm, openKeys, setOpenKeys } = useSidebarStore();

	const menuData = useMemo(() => {
		if (!currentModule) {
			return [];
		}
		const originalMenuData = transformModuleToMenuData(currentModule);

		if (!searchTerm.trim()) {
			return originalMenuData;
		}

		return filterMenuItems(originalMenuData, searchTerm);
	}, [currentModule, searchTerm]);

	useEffect(() => {
		if (searchTerm.length > 0) {
			const allKeys = getAllMenuKeys(menuData);
			setOpenKeys(allKeys);
		} else {
			const getParentKeys = (
				menuItems: TExtendedMenuItem[],
				targetKey: string,
				parents: string[] = [],
			): string[] | null => {
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

			const selectedItem = findMenuItemByRoute(menuData, currentPath || '');
			if (selectedItem?.key) {
				const parentKeys = getParentKeys(menuData, String(selectedItem.key)) ?? [];
				setOpenKeys(parentKeys);
			} else {
				setOpenKeys([]);
			}
		}
	}, [searchTerm, menuData, setOpenKeys, currentPath]);

	// Initialize collapsed from persisted preference on mount
	useEffect(() => {
		setCollapsed(getStoredCollapsedSidebar());
	}, [setCollapsed]);

	useEffect(() => {
		if (windowWidth < 800) {
			setCollapsed(true);
		}
		// Do not auto-open when window becomes large; user controls via buttons
	}, [windowWidth, setCollapsed]);

	const handleCollapseSidebar = () => {
		setCollapsed(true);
		setStoredCollapsedSidebar(true);
		setStoredCollapsed(true);
	};

	return (
		<Layout hasSider className="gap-2 h-full">
			{!collapsed && (
				<div className="flex flex-col pt-3 rounded-lg bg-gray-200" style={{ width: width }}>
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
							items={menuData}
							collapsed={collapsed}
							onClickOptionMenu={onClickOptionMenu}
							currentPath={currentPath || ''}
							mode={modeSidebar}
							openKeys={openKeys}
							onOpenKeysChange={setOpenKeys}
							loading={loadingMenu}
						/>
					</div>
					<div className="w-full flex justify-end pr-3 pl-3">
						<Button
							type="link"
							onClick={handleCollapseSidebar}
							icon={<DoubleLeftOutlined className="text-gray-400" />}
						/>
					</div>
				</div>
			)}
			<Layout className="rounded-lg h-full">
				<Content className="bg-white-100 rounded-lg pt-3 h-full flex flex-col min-h-0 relative">
					<div className="flex-1 overflow-auto min-h-0 p-2">
						{children}
					</div>
					{footerComponent && <div className="h-auto w-full z-50 rounded-bl-lg rounded-br-lg p-1">{footerComponent}</div>}
				</Content>
			</Layout>
		</Layout>
	);
};
