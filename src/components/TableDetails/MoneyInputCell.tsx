import { formatMoneyIfValid } from '@/helpers/functions';
import { InputNumber } from 'antd';

export interface IMoneyInputCellProps {
	value: any;
	onCommit: (value: any) => void;
	disabled?: boolean;
	min?: number;
	max?: number;
	suffix?: string;
	prefix?: string;
	precision?: number;
	/** Max digits for integer part (before decimal point). */
	maxDigits?: number;
	status?: 'error' | 'warning';
}


export const MoneyInputCell = ({
	value,
	onCommit,
	disabled,
	min,
	max,
	precision = 2,
	suffix,
	prefix,
	status,
}: IMoneyInputCellProps) => {
	return (
		<InputNumber
			value={value}
			onChange={(v) => onCommit(v)}
			min={min}
			max={max}
			precision={precision}
			decimalSeparator="."
			disabled={disabled}
			suffix={suffix}
			prefix={prefix}
			status={status}
			controls={false}
			style={{ width: '100%' }}
			formatter={formatMoneyIfValid}
			parser={val => (val ? val.replace(/,/g, '').replace(/[^0-9.-]/g, '') : '')}
		/>
	);
};