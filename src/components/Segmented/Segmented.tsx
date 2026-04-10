import { Segmented as AntSegmented, SegmentedProps } from 'antd';
import { getSegmentedStyles } from './Segmented.styles';

export interface ISegmentedProps extends SegmentedProps {
	className?: string;
}

export const Segmented = ({ className = '', ...rest }: ISegmentedProps) => {
	const mergedClassName = ['itsa-segmented', className].filter(Boolean).join(' ');

	return (
		<>
			<style>{getSegmentedStyles()}</style>
			<AntSegmented className={mergedClassName} {...rest} />
		</>
	);
};
