import { Steps, type StepsProps } from 'antd';
import { getWizardStepsStyles } from './WizardSteps.styles';

export interface IWizardStepsProps {
	current: number;
	items: StepsProps['items'];
	onChange?: (stepIndex: number) => void;
	className?: string;
	type?: 'default' | 'navigation' | 'inline' | 'itsa-panel';
	height?: number;
	arrowWidth?: number;
	withContainer?: boolean;
}

export const WizardSteps = ({ 
	current, 
	items, 
	onChange, 
	className = '', 
	type = 'default',
	height = 48, 
	arrowWidth = 24,
	withContainer = true
}: IWizardStepsProps) => {
	const containerId = `wizard-steps-${Math.random().toString(36).substr(2, 9)}`;
	const isItsaPanel = type === 'itsa-panel';

	const containerStyles = {
		'--wizard-height': `${height}px`,
		'--wizard-arrow-width': `${arrowWidth}px`,
	} as React.CSSProperties;

	if (!isItsaPanel) {
		return (
			<div className={className}>
				<Steps type={type} current={current} items={items} onChange={onChange} />
			</div>
		);
	}

	return (
		<>
			<style>{getWizardStepsStyles(containerId, arrowWidth)}</style>
			<div 
				id={containerId} 
				className={withContainer ? `bg-white p-2 rounded-lg shadow-sm ${className}` : className}
				style={containerStyles}
			>
				<Steps className="wizard-steps" current={current} items={items} onChange={onChange} />
			</div>
		</>
	);
};
