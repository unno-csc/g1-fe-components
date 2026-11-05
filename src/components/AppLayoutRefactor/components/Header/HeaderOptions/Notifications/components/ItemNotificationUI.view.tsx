import { IItemNotification } from '@/interfaces';
import { BellOutlined, MessageOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const NOTIFICATION_ICON_CLASSNAME =
	'flex shrink-0 items-center text-warning [&_.anticon]:text-warning [&_svg]:h-5 [&_svg]:w-5';

export interface IItemNotificationUIProps {
	notification: IItemNotification;
}

export const ItemNotificationUI = ({ notification }: IItemNotificationUIProps) => {
	return (
		<div className="box-border flex w-full min-w-0 cursor-pointer rounded-md border border-solid border-gray-100 p-2 hover:bg-gray-75">
			<div className="flex min-w-0 w-full flex-row gap-2">
				<div className={`${NOTIFICATION_ICON_CLASSNAME} text-base`}>
					{notification.icon ?? <BellOutlined />}
				</div>
				<div className="flex min-w-0 flex-1 flex-col gap-0.5">
					<div className="flex min-w-0 w-full flex-row items-start justify-between gap-2">
						<span className="min-w-0 flex-1 truncate text-[12px] font-bold text-gray-700">
							{notification.title}
						</span>
						{!notification.isReadDate && (
							<span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
						)}
					</div>
					<span className="line-clamp-2 text-[11px] font-bold text-gray-400">
						{notification.description}
					</span>
				<div className="flex min-w-0 flex-row items-center justify-between gap-0.5">
            <div className="flex min-w-0 flex-row items-center gap-2">
              <span className="truncate text-[11px] font-bold text-gray-500">{notification.entity}</span>
              <span className="h-1 w-1 shrink-0 rounded-full bg-gray-500" />
              <span className="shrink-0 text-[11px] font-bold text-gray-500">{notification.date}</span>
            </div>
            <div>
              <Button type="text" color='blue' size='small' variant='filled' icon={<MessageOutlined />} />
            </div>
        </div>
				</div>
			</div>
		</div>
	);
};
