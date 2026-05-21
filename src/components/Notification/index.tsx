import { memo, useState } from 'react';
import { Alert } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import classNames from 'classnames';

export type TNotificationType = 'info' | 'warning' | 'error' | 'success';

export interface INotificationProps {
	type?: TNotificationType;
	title?: string;
	description: string;
	closable?: boolean;
	onClose?: () => void;
	width?: string | number;
	showIcon?: boolean;
	className?: string;
	testId?: string;
}

const NotificationComponent = ({
	type = 'info',
	title,
	description,
	closable = false,
	onClose,
	width = '100%',
	showIcon = true,
	className,
	testId,
}: INotificationProps) => {
	const [visible, setVisible] = useState(true);

	const handleClose = () => {
		setVisible(false);
		onClose?.();
	};

	if (!visible) {
		return null;
	}

	const getIcon = () => {
		switch (type) {
			case 'success':
				return <CheckCircleOutlined />;
			case 'warning':
				return <ExclamationCircleOutlined />;
			case 'error':
				return <CloseCircleOutlined />;
			case 'info':
			default:
				return <InfoCircleOutlined />;
		}
	};

	const notificationClasses = classNames(
		'mb-4',
		'animate-slideInRight',
		'itsa-notification',
		`itsa-notification--${type}`,
		className
	);

	const widthStyle = typeof width === 'number' ? `${width}px` : width;

	return (
		<div
			className={notificationClasses}
			style={{ width: widthStyle }}
			data-testid={testId}
		>
			<Alert
				message={title ? <span className="font-bold">{title}</span> : undefined}
				description={description}
				type={type}
				closable={closable}
				onClose={handleClose}
				showIcon={showIcon}
				icon={showIcon ? getIcon() : undefined}
				className="w-full"
			/>
		</div>
	);
};

export const Notification = memo(NotificationComponent);
Notification.displayName = 'Notification';
