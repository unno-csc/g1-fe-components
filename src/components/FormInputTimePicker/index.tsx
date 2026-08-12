import { TimePicker, InputProps } from 'antd';
import dayjs from 'dayjs';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { FormLabel } from '@/components/FormLabel';
import { FormLabelError } from '@/components/FormLabelError';
import { memo, useId } from 'react';
import classNames from 'classnames';
import { useFormConfig } from '../FormConfigProvider';

export interface IInputProps<TFieldValues extends FieldValues> extends Omit<InputProps, 'form' | 'name'> {
	name: Path<TFieldValues>;
	label: string;
	showCaracteres?: boolean;
	control: Control<TFieldValues>;
	placeholder?: string;
	optional?: boolean;
	disabled?: boolean;
	showDirtyState?: boolean;
}

const FormInputTimePickerComponent = <TFieldValues extends FieldValues>({
	name,
	label,
	control,
	placeholder,
	optional = false,
	allowClear = true,
	disabled = false,
	showDirtyState,
}: IInputProps<TFieldValues>) => {
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
				return (
					<div className={classNames("flex flex-col gap-1", { 'dirty-field': isDirtyStateActive && fieldState.isDirty })}>
						<FormLabel label={label} htmlFor={id} optional={optional} />
						<TimePicker
							id={id}
							format={{
								format: 'HH:mm',
								type: 'mask',
							}}
							needConfirm
							value={field.value == null ? null : dayjs(field.value as string, 'HH:mm')}
							onChange={(value, timeString) => {
								if (!value) {
									field.onChange(null);
									return;
								}
								field.onChange(timeString || value.format('HH:mm'));
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

export const FormInputTimePicker = memo(FormInputTimePickerComponent) as typeof FormInputTimePickerComponent & {
	displayName?: string;
};

FormInputTimePicker.displayName = 'FormInputTimePicker';
