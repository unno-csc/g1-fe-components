import { TExtendedMenuItem, TMenuMode } from '@/types';
import { Menu, MenuProps } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import React from 'react';

export interface MenuOptionsProps {
	collapsed: boolean;
	currentPath: string;
	onClickOptionMenu: (info: { key: string; item: TExtendedMenuItem }) => void;
	items?: TExtendedMenuItem[];
	mode?: TMenuMode;
	openKeys?: string[];
	loading?: boolean;
	onOpenKeysChange?: (openKeys: string[]) => void;
}

const MenuOptions: React.FC<MenuOptionsProps> = ({
	collapsed,
	currentPath = '',
	onClickOptionMenu,
	items = [],
	mode = 'inline',
	openKeys = [],
	onOpenKeysChange,
	loading = false,
}) => {
	const handleMenuClick: MenuProps['onClick'] = info => {
		const findMenuItem = (menuItems: TExtendedMenuItem[], key: string): TExtendedMenuItem | null => {
			for (const item of menuItems) {
				if (item.key === key) {
					return item;
				}
				if ('children' in item && item.children) {
					const found = findMenuItem(item.children as TExtendedMenuItem[], key);
					if (found) return found;
				}
			}
			return null;
		};

		const clickedItem = findMenuItem(items, info.key);
		if (clickedItem && onClickOptionMenu) {
			onClickOptionMenu({ key: info.key, item: clickedItem });
		}
	};

	return (
		<div className="menu-options">
			{loading ? (
				<div className="flex flex-col items-center justify-center h-full pt-10 gap-2">
					<SyncOutlined spin className='text-gray-400' />
					<small className='text-gray-400'>Cargando menú</small>
				</div>
			) : (
				<Menu
					mode={mode}
					inlineCollapsed={collapsed}
					items={items}
					className="overflow-auto scrollbar-none border-none min-w-full"
					selectedKeys={currentPath ? [currentPath] : []}
					openKeys={openKeys}
					onOpenChange={onOpenKeysChange}
					onClick={handleMenuClick}
				/>
			)}
		</div>
	);
};

export default MenuOptions;
