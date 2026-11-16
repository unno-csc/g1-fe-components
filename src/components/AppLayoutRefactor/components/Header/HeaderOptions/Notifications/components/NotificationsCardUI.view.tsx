import { IItemNotification } from '@/interfaces';
import {
	BellOutlined,
	// CalendarOutlined,
	// CheckCircleOutlined,
	// TeamOutlined,
} from '@ant-design/icons';
import { ReactNode } from 'react';
import { ItemNotificationUI } from './ItemNotificationUI.view';
import { Empty } from '@/components/Empty';

// const DEFAULT_ICONS = [
// 	<CheckCircleOutlined key="check" className="text-base" />,
// 	<TeamOutlined key="team" className="text-base" />,
// 	<CalendarOutlined key="calendar" className="text-base" />,
// ];

export interface INotificationCardItem {
	id: string;
	title: string;
	description?: string;
	source?: string;
	time?: string;
	isRead?: boolean;
	icon?: ReactNode;
	onClick?: () => void;
}

export interface NotificationsCardUIProps {
	notifications?: IItemNotification[];
	title?: string;
	sectionLabel?: string;
	seeAllLabel?: string;
	onSeeAll?: () => void;
	emptyMessage?: string;
	className?: string;
}

export const NotificationsCardUI = ({
	notifications = [],
	title = 'Alertas y notificaciones',
	emptyMessage = 'No tienes notificaciones nuevas',
	className = '',
	onSeeAll,
}: NotificationsCardUIProps) => {
	return (
		<div className={`box-border w-[380px] rounded-md bg-white-100 shadow-xl overflow-hidden ${className}`}>
			<div className="flex items-center gap-2.5 bg-primary-700 px-4 py-3.5">
				<BellOutlined className="text-base text-warning" />
				<span className="text-sm font-semibold text-white-100">{title}</span>
			</div>

			<div className="box-border min-w-0 p-1">
				<div className="mb-4 flex items-center justify-between">
					<span className="text-sm font-bold text-blue-600">
						Nuevas
					</span>
					<span
						className='w-2.5 h-2.5 rounded-full bg-blue-600'
					/>
				</div>

				{notifications.length === 0 ? (
					<Empty description={emptyMessage}/>
				) : (
					<div className="flex min-w-0 flex-col gap-0.5 max-h-[40dvh] overflow-y-auto">
						{notifications.map(item => (
							<ItemNotificationUI key={item.key} notification={item} />
						))}
					</div>
				)}
			{notifications.length > 0 && (
				<div className="flex justify-center mt-3">
					<button
						className="text-blue-600 font-semibold text-xs hover:underline bg-transparent border-none cursor-pointer"
						onClick={typeof onSeeAll === 'function' ? onSeeAll : undefined}
					>
						Ver todas las notificaciones
					</button>
				</div>
			)}
			</div>
		</div>
	);
};
