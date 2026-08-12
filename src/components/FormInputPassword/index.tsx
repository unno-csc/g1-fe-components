import { InputProps } from 'antd';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { FormLabel } from '@/components/FormLabel';
import { FormLabelError } from '@/components/FormLabelError';
import { memo, useId } from 'react';
import classNames from 'classnames';
import { EInput } from '@/enums';
import { InputPassword } from '../InputPassword';
import { useFormConfig } from '../FormConfigProvider';

export interface IInputProps<TFieldValues extends FieldValues> extends Omit<InputProps, 'form' | 'name'> {
	name: Path<TFieldValues>;
	label: string;
	showCaracteres?: boolean;
	control: Control<TFieldValues>;
	placeholder?: string;
	disabled?: boolean;
	showDirtyState?: boolean;
}

const FormInputPasswordComponent = <TFieldValues extends FieldValues>({
	name,
	label,
	control,
	placeholder,
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
						<FormLabel label={label} htmlFor={id} />
						<InputPassword
							id={id as string}
							type={EInput.text}
							value={(field.value as string | undefined) ?? ''}
							onChange={field.onChange}
							onBlur={field.onBlur}
							ref={field.ref}
							name={field.name}
							status={errorMsg ? 'error' : undefined}
							aria-invalid={!!errorMsg}
							aria-describedby={errorMsg ? errId : undefined}
							placeholder={placeholder}
							disabled={disabled}
						/>
						{errorMsg && <FormLabelError label={errorMsg} id={errId} />}
					</div>
				);
			}}
		/>
	);
};

export const FormInputPassword = memo(FormInputPasswordComponent) as typeof FormInputPasswordComponent & {
	displayName?: string;
};

FormInputPassword.displayName = 'FormInputPassword';
