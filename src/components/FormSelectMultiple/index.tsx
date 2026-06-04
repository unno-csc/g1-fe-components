import { memo, useId, useMemo } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { SelectProps } from 'antd';
import { FormLabel } from '@/components/FormLabel';
import { FormLabelError } from '@/components/FormLabelError';
import { Select } from '@/components/Select';

type TMultipleSelectOption = { label: string; value: string | number };

export interface IFormSelectMultipleProps<TFieldValues extends FieldValues>
	extends Omit<SelectProps, 'form' | 'name' | 'mode' | 'value' | 'defaultValue' | 'onChange' | 'status'> {
	name: Path<TFieldValues>;
	label: string;
	control: Control<TFieldValues>;
	options: TMultipleSelectOption[];
	allowClear?: boolean;
	placeholder?: string;
	isLoading?: boolean;
	disabled?: boolean;
}

const FormSelectMultipleComponent = <TFieldValues extends FieldValues>({
	name,
	label,
	control,
	options,
	allowClear,
	placeholder,
	isLoading,
	disabled = false,
	...selectProps
}: IFormSelectMultipleProps<TFieldValues>) => {
	const id = useId();
	const errId = `${id}-error`;

	const filterOption = (input: string, option: TMultipleSelectOption) => {
		return (option.label ?? '').toLowerCase().includes(input.toLowerCase());
	};

	const placeholderUppercase = useMemo(() => {
		if (placeholder && placeholder.trim().length > 0) {
			return placeholder.toUpperCase();
		}

		return 'SELECCIONAR ELEMENTOS';
	}, [placeholder]);

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => {
				const errorMsg = fieldState.error?.message;
				const validValues = new Set(options.map(option => option.value));
				const safeValue: Array<string | number> = Array.isArray(field.value)
					? field.value.filter((value: string | number) => validValues.has(value))
					: [];
				const hasError = typeof errorMsg === 'string' && errorMsg.length > 0;
				const selectStatus = hasError ? 'error' : undefined;

				return (
					<div className="flex flex-col gap-0.5">
						<FormLabel label={label} htmlFor={id} />
						<Select
							id={id}
							showSearch
							mode="multiple"
							allowClear={allowClear}
							value={safeValue}
							onChange={field.onChange}
							onBlur={field.onBlur}
							ref={field.ref}
							aria-invalid={!!errorMsg}
							aria-describedby={errorMsg ? errId : undefined}
							options={options}
							placeholder={placeholderUppercase}
							loading={isLoading}
							filterOption={(input, option) => filterOption(input, option as TMultipleSelectOption)}
							disabled={disabled}
							maxTagCount="responsive"
							status={selectStatus}
							{...selectProps}
						/>
						{errorMsg && <FormLabelError label={errorMsg} id={errId} />}
					</div>
				);
			}}
		/>
	);
};

export const FormSelectMultiple = memo(FormSelectMultipleComponent) as typeof FormSelectMultipleComponent & {
	displayName?: string;
};

FormSelectMultiple.displayName = 'FormSelectMultiple';