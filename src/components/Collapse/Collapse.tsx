import { Collapse as AntCollapse, CollapseProps } from 'antd';
import { useMemo } from 'react';
import { getCollapseCardStyles } from './Collapse.styles';

export interface ICollapseProps extends CollapseProps {
	variant?: 'default' | 'card';
	showSteps?: boolean;
}

export const Collapse = ({ className, size = 'small', bordered = false, variant = 'default', showSteps = false, items, ...rest }: ICollapseProps) => {
	const variantClass = variant === 'card' ? 'itsa-collapse--card' : '';
	const mergedClassName = ['itsa-collapse--compact', variantClass, className].filter(Boolean).join(' ');
	
	const enhancedItems = useMemo(() => {
		if (variant === 'card' && showSteps && items) {
			const totalSteps = items.length;
			return items.map((item, index) => ({
				...item,
				label: (
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<span>{item.label}</span>
                        <span className="itsa-collapse-step-badge">
							Paso {index + 1} de {totalSteps}
						</span>
					</div>
				),
			}));
		}
		return items;
	}, [variant, showSteps, items]);
	
	return (
		<>
			{variant === 'card' && <style>{getCollapseCardStyles()}</style>}
			<AntCollapse 
				className={mergedClassName} 
				size={size} 
				bordered={bordered} 
				items={enhancedItems} 
				expandIconPosition="end"
				{...rest} 
			/>
		</>
	);
};
