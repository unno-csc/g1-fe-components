// TODO: waiting for final designs

import type { RadioGroupProps } from 'antd';
import { Radio as AntRadio } from 'antd';

export interface IRadioProps extends RadioGroupProps {
	label?: string;
	variant?: 'default' | undefined;
}
export const Radio = ({ label, ...rest }: IRadioProps) => {
	const { variant, className, rootClassName, ...props } = rest;
	const mergedRootClassName = [
		'motor1-radio',
		rootClassName,
		variant === 'default' ? 'itsa-radio--default' : undefined,
	]
		.filter(Boolean)
		.join(' ');

	return (
		<div>
			{label && <p>{label}</p>}
			<AntRadio.Group
				{...props}
				className={className}
				rootClassName={mergedRootClassName}
			/>
		</div>
	);
};
