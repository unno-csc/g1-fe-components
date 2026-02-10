import { Switch as AntSwitch, SwitchProps } from 'antd';
import { CSSProperties, useMemo } from 'react';

export interface SwitchCustomProps extends SwitchProps {
	checkedLabel?: string;
	uncheckedLabel?: string;
	activeBgColor?: string;
	inactiveBgColor?: string;
}

export const Switch = ({
	checkedLabel,
	uncheckedLabel,
	activeBgColor = '#000000',
	inactiveBgColor,
	className,
	style,
	...rest
}: SwitchCustomProps) => {
	const wrapperStyle = useMemo(() => {
		const styles: Record<string, string> = {};
		if (activeBgColor) {
			styles['--switch-active-bg'] = activeBgColor;
		}
		if (inactiveBgColor) {
			styles['--switch-inactive-bg'] = inactiveBgColor;
		}
		return styles as CSSProperties;
	}, [activeBgColor, inactiveBgColor]);

	const hasCustomColors = activeBgColor || inactiveBgColor;
	const wrapperClassName = hasCustomColors ? 'itsa-switch-custom' : '';

	return (
		<span className={wrapperClassName} style={wrapperStyle}>
			<AntSwitch
				{...rest}
				className={className}
				style={style}
				checkedChildren={checkedLabel}
				unCheckedChildren={uncheckedLabel}
			/>
		</span>
	);
};
