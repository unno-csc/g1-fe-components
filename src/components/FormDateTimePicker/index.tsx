import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { memo, useId } from 'react';
import classNames from 'classnames';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { FormLabel } from '@/components/FormLabel';
import { FormLabelError } from '@/components/FormLabelError';
import { useFormConfig } from '../FormConfigProvider';

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
	showDirtyState?: boolean;
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
	showDirtyState,
	disabledDate,
	disabledTime,
}: IFormDateTimePickerProps<TFieldValues>) => {
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
				const parsedValue = field.value ? dayjs(field.value as string) : null;

				return (
					<div className={classNames("flex flex-col gap-1", { 'dirty-field': isDirtyStateActive && fieldState.isDirty })}>
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
