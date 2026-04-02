import { DatePicker } from 'antd';
import type { DatePickerProps } from 'antd';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { FormLabel } from '@/components/FormLabel';
import { FormLabelError } from '@/components/FormLabelError';
import { memo, useId } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { EDateMaskFormat } from '@/enums';

dayjs.extend(customParseFormat);

const hasTimeTokens = (format: string) => format.includes('HH') || format.includes('mm') || format.includes('ss');

const getShowTimeConfig = (format: string): DatePickerProps['showTime'] => {
	if (!hasTimeTokens(format)) {
		return false;
	}

	if (format.includes('ss')) {
		return { format: 'HH:mm:ss' };
	}

	return { format: 'HH:mm' };
};

export interface IInputProps<TFieldValues extends FieldValues>
	extends Omit<DatePickerProps, 'value' | 'onChange' | 'defaultValue' | 'format'> {
	name: Path<TFieldValues>;
	label: string;
	showCaracteres?: boolean;
	control: Control<TFieldValues>;
	placeholder?: string;
	optional?: boolean;
	format?: EDateMaskFormat | string;
	disabled?: boolean;
}

const FormInputDatePickerComponent = <TFieldValues extends FieldValues>({
	name,
	label,
	control,
	placeholder,
	optional = false,
	format = EDateMaskFormat.YYYYMMDD,
	disabled = false,
	allowClear = true,
	...rest
}: IInputProps<TFieldValues>) => {
	const id = useId();
	const errId = `${id}-error`;
	const resolvedShowTime = getShowTimeConfig(format);

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => {
				const errorMsg = fieldState.error?.message as string | undefined;
				const dateValue = field.value ? dayjs(field.value, format, true) : null;
				return (
					<div className="flex flex-col gap-0.5">
						<FormLabel label={label} htmlFor={id} optional={optional} />
						<DatePicker
							{...rest}
							id={id}
							format={{
								format,
								type: 'mask',
							}}
							showTime={resolvedShowTime}
							needConfirm={Boolean(resolvedShowTime)}
							value={dateValue?.isValid() ? dateValue : null}
							onChange={(value) => {
								const formattedValue = value ? value.format(format) : null;
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

export const FormInputDatePicker = memo(FormInputDatePickerComponent) as typeof FormInputDatePickerComponent & {
	displayName?: string;
};

FormInputDatePicker.displayName = 'FormInputDatePicker';
