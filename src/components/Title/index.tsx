import { Typography } from 'antd';
import { BaseType } from 'antd/es/typography/Base';
import { CSSProperties, ReactNode } from 'react';

const { Title: AntTitle } = Typography;

export interface ITitle {
    title: string | ReactNode;
	level: 1 | 2 | 3 | 4 | 5;
	className?: string;
	type?: BaseType;
	style?: CSSProperties;
	noMargin?: boolean;
}

export const Title = ({ title, level, className, type, style, noMargin = true }: ITitle) => {
	const mergedStyle = noMargin ? { marginBottom: 0, ...style } : style;
	if (level === 1) {
		return (
			<AntTitle level={1} className={className} type={type} style={mergedStyle}>
				{title}
			</AntTitle>
		);
	}
	if (level === 2) {
		return (
			<AntTitle level={2} className={className} type={type} style={mergedStyle}>
				{title}
			</AntTitle>
		);
	}
	if (level === 3) {
		return (
			<AntTitle level={3} className={className} type={type} style={mergedStyle}>
				{title}
			</AntTitle>
		);
	}
    if (level === 4) {
		return (
            <AntTitle level={4} className={className} type={type} style={mergedStyle}>
				{title}
			</AntTitle>
		);
	}
    if (level === 5) {
		return (
            <AntTitle level={5} className={className} type={type} style={mergedStyle}>
				{title}
			</AntTitle>
		);
	}
	return (
		<AntTitle level={1} className={className} type={type} style={mergedStyle}>
			{title}
		</AntTitle>
	);
};
