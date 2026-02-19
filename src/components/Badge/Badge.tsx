import { Badge as AntBadge, BadgeProps } from 'antd';

export const Badge = ({ color = '#FACC15', ...rest }: BadgeProps) => {
	return <AntBadge color={color} {...rest} />;
};
