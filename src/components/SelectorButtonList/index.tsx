import { ButtonAntd } from '../ButtonAntd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { notification } from 'antd';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

type DefaultOptionType = {
	label: string;
	value: string;
};

export interface ISelectorButtonListProps {
	buttons: DefaultOptionType[];
	clickHandler: (value: string) => void;
	size?: SizeType;
	notificationType?: NotificationType;
	showNotification?: boolean;
}

export const SelectorButtonList = ({
	buttons,
	clickHandler,
	size = 'large',
	notificationType = 'success',
	showNotification = true,
}: ISelectorButtonListProps) => {
	const [api, contextHolder] = notification.useNotification();

	const openNotificationWithIcon = (type: NotificationType, description: React.ReactNode) => {
		api[type]({
			message: description,
			description: "Seleccionado correctamente",
		});
	};

	const handleClick = (value: string) => {
		if (showNotification) {
            const label = buttons.find(button => button.value === value)?.label;
			const description = <div><strong className='uppercase'>{label}</strong></div>;
			openNotificationWithIcon(notificationType, description);
		}
		clickHandler(value);
	};

	return (
		<div className="flex flex-col gap-2 bg-gray-25 p-4 rounded-lg">
			{buttons.map(button => (
				<ButtonAntd
					key={button.value}
					className="bg-gray-25 hover:!bg-primary-700 hover:!text-white-100 border-primary-700 hover:!border-primary-700 text-primary-700"
					onClick={() => handleClick(button.value)}
					size={size}
					type="text"
				>
					{button.label}
				</ButtonAntd>
			))}
			{contextHolder}
		</div>
	);
};
