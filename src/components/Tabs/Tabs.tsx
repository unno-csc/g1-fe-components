import { Tabs as AntTabs, TabsProps } from 'antd';

export const Tabs = ({ className, ...rest }: TabsProps) => {
	return <AntTabs className={`motor1-tabs${className ? ` ${className}` : ''}`} {...rest} />;
};
