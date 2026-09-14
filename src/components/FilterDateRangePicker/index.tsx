import { DatePicker } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

const { RangePicker } = DatePicker;

const RANGE_SEPARATOR = ';';

export interface FilterDateRangePickerProps
	extends Omit<RangePickerProps, 'format' | 'value' | 'onChange' | 'defaultValue'> {
	title?: string;
	defaultValue?: string;
	value?: string;
	format?: string;
	onChange?: (value: string) => void;
}

/**
 * FilterDateRangePicker - Componente de filtro para selección de rango de fechas
 *
 * Igual que FilterInputDatePicker pero para rangos. El valor se serializa como un
 * único string "inicio;fin" (separado por ';'), listo para usarse como query param.
 *
 * @component
 * @example
 * ```tsx
 * <FilterDateRangePicker
 *   title="Fecha de creación"
 *   value={range}
 *   onChange={setRange} // "2026-01-01;2026-01-31"
 * />
 * ```
 */
export const FilterDateRangePicker = ({
	title,
	defaultValue,
	value,
	format = 'YYYY-MM-DD',
	onChange,
	...rest
}: FilterDateRangePickerProps) => {
	const [internalValue, setInternalValue] = useState<string | undefined>(value ?? defaultValue);

	const resolvedValue = value ?? internalValue;

	useEffect(() => {
		if (defaultValue) {
			setInternalValue(defaultValue);
		}
	}, [defaultValue]);

	const handleChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
		const [start, end] = dates ?? [];
		const formattedValue = start && end ? `${start.format(format)}${RANGE_SEPARATOR}${end.format(format)}` : '';

		if (onChange) {
			onChange(formattedValue);
		}

		if (typeof value === 'undefined') {
			setInternalValue(formattedValue);
		}
	};

	const hasValue = resolvedValue && resolvedValue.trim().length > 0;

	const [startStr, endStr] = (resolvedValue ?? '').split(RANGE_SEPARATOR);
	const startValue = startStr && dayjs(startStr, format).isValid() ? dayjs(startStr, format) : null;
	const endValue = endStr && dayjs(endStr, format).isValid() ? dayjs(endStr, format) : null;
	const rangeValue: [Dayjs, Dayjs] | null = startValue && endValue ? [startValue, endValue] : null;

	return (
		<div className="flex flex-col gap-0">
			<small className="font-bold pl-1">{title}</small>
			<RangePicker
				{...rest}
				className="w-full"
				format={{
					format: format,
					type: 'mask',
				}}
				value={rangeValue}
				onChange={handleChange}
				style={{
					height: '27px',
					lineHeight: '18px',
					fontSize: '13px',
					transition: 'box-shadow 160ms ease, border-color 160ms ease',
					boxShadow: hasValue ? '0 0 0 2px rgba(59, 130, 246, 0.15)' : undefined,
					borderColor: hasValue ? '#93c5fd' : undefined,
				}}
			/>
		</div>
	);
};
