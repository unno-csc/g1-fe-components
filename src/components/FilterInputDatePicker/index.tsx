import { DatePicker, type DatePickerProps } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { memo, useEffect, useId, useState } from 'react';
import classNames from 'classnames';
import { FormLabel } from '@/components/FormLabel';

export interface IFilterInputDatePickerProps extends Omit<DatePickerProps, 'format' | 'value' | 'onChange' | 'defaultValue'> {
	title?: string;
	label?: string;
	defaultValue?: string;
	value?: string;
	format?: string;
	containerClassName?: string;
	onChange?: (value: string) => void;
}

export type FilterInputDatePickerProps = IFilterInputDatePickerProps;

const FilterInputDatePickerComponent = ({
	title,
	label,
	defaultValue,
	value,
	format = 'YYYY-MM-DD',
	onChange,
	className,
	style,
	id: customId,
	containerClassName,
	picker,
	...rest
}: IFilterInputDatePickerProps) => {
	const generatedId = useId();
	const id = customId ?? generatedId;
	const displayLabel = label ?? title;

	const [internalValue, setInternalValue] = useState<string | undefined>(
		value ?? defaultValue
	);

	const resolvedValue = value ?? internalValue;

	useEffect(() => {
		if (value === undefined && defaultValue !== undefined) {
			setInternalValue(defaultValue);
		}
	}, [defaultValue, value]);

	const handleChange = (date: Dayjs | null) => {
		const formattedValue = date ? date.format(format) : '';

		onChange?.(formattedValue);

		if (value === undefined) {
			setInternalValue(formattedValue);
		}
	};

	const hasValue = !!(resolvedValue && resolvedValue.trim().length > 0);

	const dateValue = resolvedValue && dayjs(resolvedValue, format).isValid() 
		? dayjs(resolvedValue, format) 
		: null;

	const resolvedFormat = picker && picker !== 'date' ? format : { format, type: 'mask' as const };

	const dynamicStyle = hasValue
		? {
				borderColor: '#93c5fd',
				boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.15)',
		  }
		: undefined;

	return (
		<div className={classNames('flex flex-col gap-0.5', containerClassName)}>
			{displayLabel && <FormLabel label={displayLabel} htmlFor={id} />}
			<DatePicker
				{...rest}
				id={id}
				picker={picker}
				className={classNames('w-full rounded-lg max-h-8', className)}
				format={resolvedFormat}
				value={dateValue}
				onChange={handleChange}
				style={{
					transition: 'box-shadow 160ms ease, border-color 160ms ease',
					...dynamicStyle,
					...style,
				}}
			/>
		</div>
	);
};

export const FilterInputDatePicker = memo(FilterInputDatePickerComponent) as typeof FilterInputDatePickerComponent & {
	displayName?: string;
};

FilterInputDatePicker.displayName = 'FilterInputDatePicker';
