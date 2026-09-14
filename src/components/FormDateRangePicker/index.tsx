import { DatePicker } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { FormLabel } from '@/components/FormLabel';
import { FormLabelError } from '@/components/FormLabelError';
import { memo, useId } from 'react';
import classNames from 'classnames';
import dayjs, { Dayjs } from 'dayjs';
import { EDateMaskFormat } from '@/enums';
import { useFormConfig } from '../FormConfigProvider';

const { RangePicker } = DatePicker;

const RANGE_SEPARATOR = ';';

export interface IFormDateRangePickerProps<TFieldValues extends FieldValues>
	extends Omit<RangePickerProps, 'value' | 'onChange' | 'defaultValue' | 'format'> {
	name: Path<TFieldValues>;
	label: string;
	control: Control<TFieldValues>;
	placeholder?: [string, string];
	optional?: boolean;
	format?: EDateMaskFormat | string;
	disabled?: boolean;
	disabledDate?: (current: Dayjs) => boolean;
	showDirtyState?: boolean;
}

/**
 * FormDateRangePicker - Selector de rango de fechas integrado con react-hook-form
 *
 * El valor del campo se guarda como un único string "inicio;fin" (separado por ';'),
 * listo para enviarse tal cual al backend como query param o payload.
 */
const FormDateRangePickerComponent = <TFieldValues extends FieldValues>({
	name,
	label,
	control,
	placeholder,
	optional = false,
	format = EDateMaskFormat.YYYYMMDD,
	disabled = false,
	allowClear = true,
	showDirtyState,
	...rest
}: IFormDateRangePickerProps<TFieldValues>) => {
	const { showDirtyState: contextShowDirtyState } = useFormConfig();
	const isDirtyStateActive = showDirtyState ?? contextShowDirtyState;

	const id = useId();
	const errId = `${id}-error`;

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => {
				const errorMsg = fieldState.error?.message as string | undefined;

				const [startStr, endStr] = ((field.value as string) ?? '').split(RANGE_SEPARATOR);
				const startValue = startStr && dayjs(startStr, format, true).isValid() ? dayjs(startStr, format, true) : null;
				const endValue = endStr && dayjs(endStr, format, true).isValid() ? dayjs(endStr, format, true) : null;
				const rangeValue: [Dayjs, Dayjs] | null = startValue && endValue ? [startValue, endValue] : null;

				return (
					<div className={classNames('flex flex-col gap-0.5', { 'dirty-field': isDirtyStateActive && fieldState.isDirty })}>
						<FormLabel label={label} htmlFor={id} optional={optional} />
						<RangePicker
							{...rest}
							id={id}
							format={{
								format,
								type: 'mask',
							}}
							value={rangeValue}
							onChange={(dates) => {
								const [start, end] = dates ?? [];
								const formattedValue = start && end ? `${start.format(format)}${RANGE_SEPARATOR}${end.format(format)}` : '';
								field.onChange(formattedValue);
							}}
							onBlur={field.onBlur}
							ref={field.ref}
							name={field.name}
							status={errorMsg ? 'error' : undefined}
							aria-invalid={!!errorMsg}
							aria-describedby={errorMsg ? errId : undefined}
							placeholder={placeholder}
							allowClear={allowClear}
							disabled={disabled}
						/>
						{errorMsg && <FormLabelError label={errorMsg} id={errId} />}
					</div>
				);
			}}
		/>
	);
};

export const FormDateRangePicker = memo(FormDateRangePickerComponent) as typeof FormDateRangePickerComponent & {
	displayName?: string;
};

FormDateRangePicker.displayName = 'FormDateRangePicker';
