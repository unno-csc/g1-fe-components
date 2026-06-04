import { Select as AntSelect, SelectProps } from 'antd';
import { RefCallBack } from 'react-hook-form';

export interface ISelectProps extends SelectProps {
	status?: 'error' | 'warning' | undefined;
	ref?: RefCallBack;
}

export const Select = ({ ref, status, ...rest }: ISelectProps) => {
	const validValues = rest.options?.map(o => o.value);
	let safeValue: SelectProps['value'] | undefined;

	if (Array.isArray(rest.value)) {
		safeValue = rest.value.filter(value => validValues?.includes(value));
	} else if (validValues?.includes(rest.value)) {
		safeValue = rest.value;
	} else {
		safeValue = undefined;
	}
	return <AntSelect {...rest} value={safeValue} ref={ref} status={status} className="w-full rounded-lg" />;
};
