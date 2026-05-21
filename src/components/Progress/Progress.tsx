import { Progress as AntProgress, ProgressProps } from 'antd';

export const Progress = ({ className, ...rest }: ProgressProps) => {
	return <AntProgress className={`motor1-progress${className ? ` ${className}` : ''}`} {...rest} />;
};
