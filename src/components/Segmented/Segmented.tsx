import classNames from 'classnames';
import { Segmented as AntSegmented, type SegmentedProps } from 'antd';
import { getSegmentedStyles } from './Segmented.styles';

export type TSegmentedVariant = 'default' | 'brand';

export interface ISegmentedProps extends SegmentedProps {
	className?: string;
	variant?: TSegmentedVariant;
}

export const Segmented = ({
	className,
	variant = 'default',
	size = 'middle',
	...rest
}: ISegmentedProps) => {
	const variantClass = variant === 'brand' ? 'itsa-segmented--brand' : 'itsa-segmented--default';
	const sizeClass = size === 'small' ? 'itsa-segmented--sm' : size === 'large' ? 'itsa-segmented--lg' : 'itsa-segmented--md';

	const mergedClassName = classNames(
		'itsa-segmented',
		variantClass,
		sizeClass,
		className
	);

	return (
		<>
			<style>{getSegmentedStyles()}</style>
			<AntSegmented className={mergedClassName} size={size} {...rest} />
		</>
	);
};
