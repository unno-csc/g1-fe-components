
import { useUserNotificationsUI } from './UserNotificationsUI.hook';
import { UserNotificationsUIView } from './UserNotificationsUI.view';
import { IItemNotification } from '@/interfaces';



export interface INotificationsUIProps {
	notifications?: IItemNotification[];
}

export const NotificationsUI = ({ notifications }: INotificationsUIProps) => {
	const hook = useUserNotificationsUI({ notifications });

	return (
		<UserNotificationsUIView {...hook} />
	);
};
