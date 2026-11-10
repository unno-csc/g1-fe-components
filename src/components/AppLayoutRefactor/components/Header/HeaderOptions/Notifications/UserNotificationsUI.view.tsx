import { ActiveNotificationIcon, NotificationIcon } from '@/assets/icons';
import { Button, Popover } from 'antd';
import { NotificationsCardUI } from './components/NotificationsCardUI.view';
import { IUserNotificationsUIHook } from './UserNotificationsUI.hook';

export const UserNotificationsUIView = ({
	open,
	isActiveNotifications,
	notifications,
	handleOpenChange,
	handleClose,
}: IUserNotificationsUIHook) => {
	return (
		<Popover
			content={
				<NotificationsCardUI
					notifications={notifications}
					onSeeAll={handleClose}
				/>
			}
			trigger="click"
			placement="bottomRight"
			arrow={false}
			open={open}
			onOpenChange={handleOpenChange}
			styles={{ body: { padding: 0 } }}
			destroyOnHidden
		>
			<Button
				type="text"
				disabled={!isActiveNotifications}
				icon={
					isActiveNotifications ? (
						<ActiveNotificationIcon className="h-6 w-6" />
					) : (
						<NotificationIcon className="h-6 w-6 text-white-100" />
					)
				}
			/>
		</Popover>
	);
};
