import { InputProps } from 'antd';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { FormLabel } from '@/components/FormLabel';
import { FormLabelError } from '@/components/FormLabelError';
import { Input } from '@/components/Input/Input';
import { memo, useId, useMemo } from 'react';
import { EInput } from '@/enums';
import { TTextTransform } from '@/types';

export interface IInputProps<TFieldValues extends FieldValues> extends Omit<InputProps, 'form' | 'name'> {
	name: Path<TFieldValues>;
	label: string;
	control: Control<TFieldValues>;
	showCaracteres?: boolean;
	placeholder?: string;
	errorIdentificationExists?: string;
	autoComplete?: string;
	disabled?: boolean;
	textTransform?: TTextTransform;
}

const FormInputComponent = <TFieldValues extends FieldValues>({
	name,
	label,
	showCaracteres,
	control,
	placeholder,
	errorIdentificationExists,
	autoComplete = 'off',
	disabled = false,
	textTransform = 'uppercase',
}: IInputProps<TFieldValues>) => {
	const id = useId();
	const errId = `${id}-error`;

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => {
				const errorMsg = fieldState.error?.message as string | undefined;
				const validatMsg = useMemo(() => {
					if (errorMsg) {
						return errorMsg;
					}
					if (errorIdentificationExists) {
						return errorIdentificationExists;
					}
					return undefined;
				}, [errorMsg, errorIdentificationExists]);

				const normalizedValueUppercase = useMemo(() => {
					if (field.value === undefined || field.value === null) {
						return undefined;
					}
					if (textTransform === 'none') {
						return field.value;
					}
					if (textTransform === 'lowercase') {
						return field.value.toLowerCase();
					}
					return field.value.toUpperCase();
				}, [field.value]);

				return (
					<div className="flex flex-col gap-1">
						<FormLabel label={label} htmlFor={id} />
						<Input
							id={id as string}
							type={EInput.text}
							value={normalizedValueUppercase ?? ''}
							onChange={field.onChange}
							onBlur={field.onBlur}
							ref={field.ref}
							name={field.name}
							status={validatMsg ? 'error' : undefined}
							aria-invalid={!!validatMsg}
							aria-describedby={validatMsg ? errId : undefined}
							showCountCharacters={showCaracteres}
							placeholder={placeholder}
							autoComplete={autoComplete}
							disabled={disabled}
							style={{ textTransform: textTransform }}
						/>
						{(validatMsg || errorIdentificationExists) && <FormLabelError label={validatMsg ?? ''} id={errId} />}
					</div>
				);
			}}
		/>
	);
};

export const FormInput = memo(FormInputComponent) as typeof FormInputComponent & {
	displayName?: string;
};

FormInput.displayName = 'FormInput';
