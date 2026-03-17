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
	activeBgColor = '#EA3B48',
	inactiveBgColor,
	className,
	style,
	...rest
}: SwitchCustomProps) => {
	const longestLabel = useMemo(() => {
		const labels = [checkedLabel, uncheckedLabel].filter((label): label is string => Boolean(label));

		return labels.reduce((longest, current) => (current.length > longest.length ? current : longest), '');
	}, [checkedLabel, uncheckedLabel]);

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

	const switchStyle = useMemo(() => {
		if (!longestLabel) {
			return style;
		}

		const dynamicMinWidth = Math.max(44, longestLabel.length * 7 + 52);

		return {
			minWidth: dynamicMinWidth,
			...style,
		} as CSSProperties;
	}, [longestLabel, style]);

	const hasCustomColors = activeBgColor || inactiveBgColor;
	const wrapperClassName = hasCustomColors ? 'itsa-switch-custom' : '';

	return (
		<span className={wrapperClassName} style={wrapperStyle}>
			<AntSwitch
				{...rest}
				className={className}
				style={switchStyle}
				checkedChildren={checkedLabel ? <span style={{ color: '#fff' }}>{checkedLabel}</span> : undefined}
				unCheckedChildren={uncheckedLabel ? <span style={{ color: '#fff' }}>{uncheckedLabel}</span> : undefined}
			/>
		</span>
	);
};
