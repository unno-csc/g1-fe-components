import { Drawer } from "@/components/Drawer/Drawer";
import { useAppLayoutFooter } from "@/hooks";
import { ReactNode, useState } from "react";
import { useSidebarLayoutStore } from "../store";
import { DoubleLeftOutlined, HomeOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { sidebarStyles } from "./styles";
import { MenuItems } from "./components/MenuItems";
import { IProgram } from "@/interfaces";

export interface ISidebarLayoutProps {
	loadingAppLayout: boolean;
	children: ReactNode;
	menuItemsNavigate: (program: IProgram) => void;
	width?: number;
}
export type SidebarLayoutProps = ISidebarLayoutProps;

export const SidebarLayout = ({ children, menuItemsNavigate, width = 266 }: ISidebarLayoutProps) => {
	const { footerComponent } = useAppLayoutFooter();
	const { open, setOpen } = useSidebarLayoutStore();
	const [openKeysMenuOptions, setOpenKeysMenuOptions] = useState<string[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const drawerTopOffset = 'calc(4rem + 0.2rem)';

	const closeDrawer = () => {
		setOpen(false);
	};

	const navigateToHome = () => {
		closeDrawer();
		const homeProgram: IProgram = {
			id: 0,
			name: 'Home',
			path: '/home',
			icon: 'home',
			root: true,
			roleId: 0,
		};
		menuItemsNavigate(homeProgram);
	};

	const titleDrawer = () => {
		return (
			<div className="flex-1 border-0 border-solid border-b border-b-gray-150 pb-1">
				<Button
					icon={<HomeOutlined className="text-sm text-warning" />}
					type="text"
					size="small"
					className="flex items-center gap-1.5 px-2 h-7 rounded hover:bg-white-100/50 transition-colors"
					onClick={navigateToHome}
				>
					<strong className="text-xs font-semibold text-gray-700 hover:text-warning transition-colors">
						Inicio
					</strong>
				</Button>
			</div>
		);
	};

	const footerDrawer = () => {
		return (
			<div className="flex flex-row justify-end">
				<Button
					icon={<DoubleLeftOutlined className="text-sm text-gray-400 hover:text-gray-600" />}
					type="text"
					size="small"
					className="h-7 w-7 p-0 flex items-center justify-center rounded hover:bg-white-100/50 transition-colors"
					onClick={closeDrawer}
				/>
			</div>
		);
	};

	return (
		<div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden pl-1 pr-1">
			<Drawer
				title={titleDrawer()}
				footer={footerDrawer()}
				placement="left"
				onClose={() => setOpen(false)}
				open={open}
				key="left"
				width={width}
				rootStyle={{
					top: drawerTopOffset,
					height: `calc(100dvh - ${drawerTopOffset})`,
				}}
				closable={false}
				styles={sidebarStyles}
			>
				<div className="flex flex-1 min-h-0 flex-col gap-2">
					<Input
						type="text"
						placeholder="Buscar en el menú"
						allowClear
						size="small"
						className="h-8 rounded-lg text-xs border-gray-150 bg-white-100 hover:border-warning focus:border-warning shadow-none"
						value={searchTerm}
						onChange={event => setSearchTerm(event.target.value)}
						suffix={<SearchOutlined className="text-xs text-gray-400" />}
					/>
					<MenuItems
						openKeysMenuOptions={openKeysMenuOptions}
						onOpenKeysChange={setOpenKeysMenuOptions}
						searchTerm={searchTerm}
						menuItemsNavigate={menuItemsNavigate}
					/>
				</div>
			</Drawer>
			<div className="min-h-0 min-w-0 max-w-full flex-1 overflow-auto rounded-lg bg-white-100 p-2">
				{children}
			</div>
			{footerComponent !== undefined && (
				<div className="h-auto w-full shrink-0 lg:z-50 rounded-bl-lg rounded-br-lg p-1">{footerComponent}</div>
			)}
		</div>
	);
};