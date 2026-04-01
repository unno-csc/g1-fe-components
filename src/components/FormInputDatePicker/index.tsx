import { DatePicker, InputProps } from 'antd';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { FormLabel } from '@/components/FormLabel';
import { FormLabelError } from '@/components/FormLabelError';
import { memo, useId } from 'react';
import dayjs from 'dayjs';

export interface IInputProps<TFieldValues extends FieldValues> extends Omit<InputProps, 'form' | 'name'> {
	name: Path<TFieldValues>;
	label: string;
	showCaracteres?: boolean;
	control: Control<TFieldValues>;
	placeholder?: string;
	optional?: boolean;
	format?: string;
}

const FormInputDatePickerComponent = <TFieldValues extends FieldValues>({
	name,
	label,
	control,
	placeholder,
	optional = false,
	format = 'YYYY-MM-DD',
}: IInputProps<TFieldValues>) => {
	const id = useId();
	const errId = `${id}-error`;
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => {
				const errorMsg = fieldState.error?.message as string | undefined;
				const parsedValue = field.value
					? dayjs.isDayjs(field.value)
						? field.value
						: dayjs(field.value)
					: null;
				return (
					<div className="flex flex-col gap-1">
						<FormLabel label={label} htmlFor={id} optional={optional} />
						<DatePicker
							id={id}
							value={parsedValue}
							format={{
								format: format,
								type: 'mask',
							}}
							onChange={(value)=> {
								const formattedValue = value ? value.format(format) : '';
								field.onChange(formattedValue);
							}}
							onBlur={field.onBlur}
							ref={field.ref}
							name={field.name}
							status={errorMsg ? 'error' : undefined}
							aria-invalid={!!errorMsg}
							aria-describedby={errorMsg ? errId : undefined}
							placeholder={placeholder}
							
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
