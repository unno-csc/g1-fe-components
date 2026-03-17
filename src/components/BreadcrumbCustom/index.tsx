import { Button as ButtonAntd } from 'antd';
import { LeftOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useUserLocalConfig } from '@/hooks/useUserLocalConfig';

export interface IBreadcrumbCustomProps {
	title: string;
	description: string;
	action: () => void;
	actionButtonDocumentation?: () => void;
}
export const BreadcrumbCustom = ({ title, description, action, actionButtonDocumentation }: IBreadcrumbCustomProps) => {
	const { showHelpButton } = useUserLocalConfig();
	return (
		<div className="flex flex-row items-center gap-2">
			<ButtonAntd onClick={action} type="text" icon={<LeftOutlined className="font-bold" style={{ fontSize: '20px' }} />} />
			<div className="flex flex-row items-center gap-2">
				<h4 className="font-bold text-lg text-black-100">{title}</h4>
				<span className="text-black-100">|</span>
				<small className="text-sm text-black-100">{description}</small>
			</div>
			{actionButtonDocumentation && showHelpButton && (
				<ButtonAntd onClick={actionButtonDocumentation} type="text" size='small' >
					<div className='p-2'>
						<QuestionCircleOutlined className="font-bold text-primary-700" style={{ fontSize: '16px' }} />
					</div>
				</ButtonAntd>
					
			)}
		</div>
	);
};
