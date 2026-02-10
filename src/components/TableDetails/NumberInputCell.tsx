import { useEffect, useState } from 'react';
import { InputNumber } from 'antd';

export interface INumberInputCellProps {
	value: any;
	onCommit: (value: any) => void;
	disabled?: boolean;
	min?: number;
	max?: number;
	suffix?: string;
	prefix?: string;
	precision?: number;
	maxDigits?: number;
	status?: 'error' | 'warning';
}

export const NumberInputCell = ({
	value,
	onCommit,
	disabled,
	min,
	max,
	suffix,
	prefix,
	precision,
	maxDigits,
	status,
}: INumberInputCellProps) => {
	const [innerValue, setInnerValue] = useState(value);

	useEffect(() => {
		setInnerValue(value);
	}, [value]);

	const handleChange = (val: string | number | null) => {
		if (maxDigits !== undefined && val !== null && val !== undefined) {
			const digits = `${val}`.replace(/\D/g, '');
			if (digits.length > maxDigits) return;
		}

		setInnerValue(val);
	};

	return (
		<InputNumber
			value={innerValue}
			onChange={handleChange}
			onBlur={() => onCommit(innerValue)}
			style={{ width: '100%' }}
			min={min}
			max={max}
			suffix={suffix}
			disabled={disabled}
			prefix={prefix}
			precision={precision}
			status={status}
		/>
	);
};

