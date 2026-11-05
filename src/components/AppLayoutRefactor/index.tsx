import { Layout } from 'antd';
import { HeaderLayout } from './components/Header';
import { SidebarLayout } from './components/Sidebar';
import { DefaultOptionType } from 'antd/es/select';
import { ReactNode } from 'react';
import { useAppLayoutSelectionPersistence } from './components/store';
import { IProgram } from '@/interfaces';
import { MenuProps } from 'antd';

export {
	useAppLayoutStore,
	useAppLayoutSelectionPersistence,
	useSidebarLayoutStore,
	resolveCompany,
	resolvePermissionSelection,
} from './components/store';
export type {
	StoredAppLayoutSelection,
	ResolvedPermissionSelection,
	AppLayoutStore,
	SidebarLayoutStore,
} from './components/store';

export interface AppLayoutProps {
	optionsCompany: DefaultOptionType[];
	loadingAppLayout: boolean;
	onCloseSession: () => void;
	children: ReactNode;
	menuItemsNavigate: (program: IProgram) => void;
	userActions: MenuProps;
}

export const AppLayout = ({
	optionsCompany,
	loadingAppLayout,
	children,
	menuItemsNavigate,
	onCloseSession,
	userActions,
}: AppLayoutProps) => {
	useAppLayoutSelectionPersistence(optionsCompany, loadingAppLayout);
	return (
		<div className="flex h-[100dvh] w-full min-w-0 overflow-hidden">
			<Layout className="h-full min-h-0 w-full min-w-0 md:p-0.5 gap-0.5 md:gap-2">
				<HeaderLayout
					optionsCompany={optionsCompany}
					loadingAppLayout={loadingAppLayout}
					onCloseSession={onCloseSession}
					menuItemsNavigate={menuItemsNavigate}
					userActions={userActions}
				/>
				<SidebarLayout loadingAppLayout={loadingAppLayout} menuItemsNavigate={menuItemsNavigate}>
					{children}
				</SidebarLayout>
			</Layout>
		</div>
	);
};
