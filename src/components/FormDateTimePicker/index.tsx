import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { memo, useId } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { FormLabel } from '@/components/FormLabel';
import { FormLabelError } from '@/components/FormLabelError';

interface IDisabledTimes {
	disabledHours?: () => number[];
	disabledMinutes?: (hour: number) => number[];
	disabledSeconds?: (hour: number, minute: number) => number[];
}

export interface IFormDateTimePickerProps<TFieldValues extends FieldValues> {
	name: Path<TFieldValues>;
	control: Control<TFieldValues>;
	label: string;
	placeholder?: string;
	optional?: boolean;
	disabled?: boolean;
	minuteStep?: number;
	disabledDate?: (current: Dayjs) => boolean;
	disabledTime?: (current: Dayjs | null) => IDisabledTimes;
}

const FormDateTimePickerComponent = <TFieldValues extends FieldValues>({
	name,
	control,
	label,
	placeholder,
	optional = false,
	disabled = false,
	minuteStep = 15,
	disabledDate,
	disabledTime,
}: IFormDateTimePickerProps<TFieldValues>) => {
	const id = useId();
	const errId = `${id}-error`;

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => {
				const errorMsg = fieldState.error?.message as string | undefined;
				const parsedValue = field.value ? dayjs(field.value as string) : null;

				return (
					<div className="flex flex-col gap-1">
						<FormLabel label={label} htmlFor={id} optional={optional} />
						<DatePicker
							id={id}
							showTime={{ format: 'HH:mm', minuteStep: minuteStep as 1 }}
							format="DD/MM/YYYY HH:mm"
							placeholder={placeholder}
							style={{ width: '100%' }}
							value={parsedValue?.isValid() ? parsedValue : null}
							disabledDate={disabledDate}
							disabledTime={disabledTime}
							showNow={false}
							disabled={disabled}
							status={errorMsg ? 'error' : undefined}
							aria-invalid={!!errorMsg}
							aria-describedby={errorMsg ? errId : undefined}
							onChange={(date) => field.onChange(date ? date.toISOString() : '')}
							onBlur={field.onBlur}
							ref={field.ref}
						/>
						{errorMsg && <FormLabelError label={errorMsg} id={errId} />}
					</div>
				);
			}}
		/>
	);
};

export const FormDateTimePicker = memo(FormDateTimePickerComponent) as typeof FormDateTimePickerComponent & {
	displayName?: string;
};

FormDateTimePicker.displayName = 'FormDateTimePicker';
