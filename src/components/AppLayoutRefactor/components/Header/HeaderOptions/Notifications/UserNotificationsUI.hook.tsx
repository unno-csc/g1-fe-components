
import { useCallback, useState } from 'react';
import { INotificationsUIProps } from './UserNotificationsUI.controller';
import { IItemNotification } from '@/interfaces';

export interface IUserNotificationsUIHook {
	open: boolean;
	isActiveNotifications: boolean;
	notifications?: IItemNotification[];
	handleOpenChange: (nextOpen: boolean) => void;
	handleClose: () => void;
}

export const useUserNotificationsUI = ({
	notifications = [],
}: INotificationsUIProps): IUserNotificationsUIHook => {
	const [open, setOpen] = useState(false);
	const isActiveNotifications = Boolean(notifications?.length);

	const handleOpenChange = useCallback((nextOpen: boolean) => {
		setOpen(nextOpen);
	}, []);

	const handleClose = useCallback(() => {
		setOpen(false);
	}, []);

	return {
		open,
		isActiveNotifications,
		notifications,
		handleOpenChange,
		handleClose,
	};
};
