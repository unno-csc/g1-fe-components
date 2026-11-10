import { MenuProps } from 'antd';
import { NotificationsUI } from './Notifications/UserNotificationsUI.controller';
import { IItemNotification, IProgram } from '@/interfaces';
import { useEnvironment } from '@/hooks/useEnvironment';
import { ControlSidebarUI } from './ControlSidebar.view';
import { ControlMultiCompanySelectorUI } from './ControlMultiCompanySelectorUI.view';
import { ControlBusinessLineSelectorUI } from './ControlBusinessLineSelectorUI.view';
import { ControlSubAgencySelectorUI } from './ControlSubAgencySelectorUI.view';
import { ControlUserInformationUI } from './ControlUserInformationUI.view';
import { DefaultOptionType } from 'antd/es/select';

export interface IHeaderOptionsProps {
	loadingAppLayout: boolean;
	optionsCompany: DefaultOptionType[];
	userActions: MenuProps;
	onCloseSession: () => void;
	notifications?: IItemNotification[];
	menuItemsNavigate: (program: IProgram) => void;
}

export const HeaderOptions = ({ userActions, notifications, loadingAppLayout, optionsCompany, onCloseSession, menuItemsNavigate }: IHeaderOptionsProps) => {
	const environment = useEnvironment();
	return (
		<div className="flex pl-2 pr-2 h-full min-h-0 min-w-0 flex-row items-center justify-between">
			<ControlSidebarUI environment={environment} />
			<ControlMultiCompanySelectorUI optionsCompany={optionsCompany} loadingAppLayout={loadingAppLayout} />
			<div className="flex min-w-0 flex-row gap-1">
				<div className="flex min-w-0 flex-row gap-1">
					<ControlBusinessLineSelectorUI loadingAppLayout={loadingAppLayout} menuItemsNavigate={menuItemsNavigate} />
					<ControlSubAgencySelectorUI loadingAppLayout={loadingAppLayout} menuItemsNavigate={menuItemsNavigate} />
				</div>
				<div className="flex min-w-0 shrink flex-row items-center gap-0.5">
					<ControlUserInformationUI userActions={userActions} onCloseSession={onCloseSession} />
					<NotificationsUI notifications={notifications} />
				</div>
			</div>
		</div>
	);
};
