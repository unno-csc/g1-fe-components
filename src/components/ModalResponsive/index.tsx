import { Modal, Grid } from 'antd';
import { ReactNode } from 'react';
import { ButtonAntd } from '../ButtonAntd';
import { CloseOutlined } from '@ant-design/icons';

export interface HeaderButton {
	icon: ReactNode;
	onClick: () => void;
}

export interface IModalResponsiveProps {
	title: string;
	open: boolean;
	onOk: () => void;
	onCancel: () => void;
	footer: ReactNode;
	content: ReactNode;
	height?: string;
	hideScroll?: boolean;
	width?: string;
	afterClose?: () => void;
	closable?: boolean;
	extraHeaderButtons?: HeaderButton[];
}

export const ModalResponsive = ({
	title,
	open,
	onOk,
	onCancel,
	footer,
	content,
	height,
	hideScroll = true,
	width,
	afterClose,
	closable = true,
	extraHeaderButtons,
}: IModalResponsiveProps) => {
	const screens = Grid.useBreakpoint();
	const computedWidth = screens.xxl
		? '40%'
		: screens.xl
			? '50%'
			: screens.lg
				? '60%'
				: screens.md
					? '70%'
					: screens.sm
						? '80%'
						: '90%';

	const hasExtraButtons = extraHeaderButtons && extraHeaderButtons.length > 0;

	return (
		<Modal
			title={
				<div className="flex items-center justify-between md: w-full mt-[-11px] md:mt-[-13px]">
					<span>{title}</span>
					{hasExtraButtons && (
						<div className="flex items-center self-start gap-0">
							{extraHeaderButtons.map((button, index) => (
								<ButtonAntd
									key={index}
									type="text"
									size="small"
									className="py-4 text-gray-400"
									onClick={button.onClick}
								>
									{button.icon}
								</ButtonAntd>
							))}
							<ButtonAntd
								type="text"
								size="small"
								className="py-4 text-gray-400"
								onClick={onCancel}
							>
								<CloseOutlined />
							</ButtonAntd>
						</div>
					)}
				</div>
			}
			centered
			open={open}
			onOk={onOk}
			onCancel={onCancel}
			destroyOnHidden
			width={width || computedWidth}
			styles={{ 
				body: { height, maxHeight: height, overflowY: hideScroll ? 'hidden' : 'auto' },
				content: { padding: screens.md ? '24px' : '22px 12px 22px 12px' }
			}}
			footer={footer}
			afterClose={afterClose}
			closable={hasExtraButtons ? false : closable}
			maskClosable={closable}
			keyboard={closable}
		>
			<div className="pt-2">{content}</div>
		</Modal>
	);
};
