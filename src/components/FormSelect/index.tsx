import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { FormLabel } from '@/components/FormLabel';
import { FormLabelError } from '@/components/FormLabelError';
import { memo, useId, useMemo } from 'react';
import classNames from 'classnames';
import { SelectProps } from 'antd';
import { Select } from '@/components/Select';
import { useFormConfig } from '@/components/FormConfigProvider';

export interface IFormSelectProps<TFieldValues extends FieldValues> extends Omit<SelectProps, 'form' | 'name'> {
	name: Path<TFieldValues>;
	label: string;
	control: Control<TFieldValues>;
	options: { label: string; value: string | number }[];
	allowClear?: boolean;
	mode?: 'multiple' | 'tags';
	placeholder?: string;
	isLoading?: boolean;
	disabled?: boolean;
	showDirtyState?: boolean;
}

const FormSelectComponent = <TFieldValues extends FieldValues>({
	name,
	label,
	control,
	options,
	allowClear,
	mode,
	placeholder,
	isLoading,
	disabled = false,
	showDirtyState,
}: IFormSelectProps<TFieldValues>) => {
	const id = useId();
	const errId = `${id}-error`;
	const { showDirtyState: contextShowDirtyState } = useFormConfig();
	const isDirtyStateActive = showDirtyState ?? contextShowDirtyState;

	const filterOption = (input: string, option: { label: string; value: string | number }) => {
		return (option.label ?? '').toLowerCase().includes(input.toLowerCase());
	};

	const placeholderUppercase = useMemo(() => {
		if (placeholder && placeholder.trim().length > 0) {
			return placeholder.toUpperCase();
		}
		return 'Seleccionar item';
	}, [placeholder]);

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => {
				const errorMsg = fieldState.error?.message;
				const validValues = options.map(o => o.value);
				const safeValue = validValues.includes(field.value) ? field.value : undefined;
				return (
					<div className={classNames('flex flex-col gap-0.5', { 'dirty-field': isDirtyStateActive && fieldState.isDirty })}>
						<FormLabel label={label} htmlFor={id} />
						<Select
							id={id as string}
							showSearch
							mode={mode}
							allowClear={allowClear}
							value={safeValue}
							onChange={field.onChange}
							onBlur={field.onBlur}
							ref={field.ref}
							status={errorMsg ? 'error' : undefined}
							aria-invalid={!!errorMsg}
							aria-describedby={errorMsg ? errId : undefined}
							options={options}
							placeholder={placeholderUppercase}
							loading={isLoading}
							filterOption={(input, option) => filterOption(input, option as { label: string; value: string | number })}
							disabled={disabled}
						/>
						{errorMsg && <FormLabelError label={errorMsg} id={errId} />}
					</div>
				);
			}}
		/>
	);
};

export const FormSelect = memo(FormSelectComponent) as typeof FormSelectComponent & {
	displayName?: string;
};

FormSelect.displayName = 'FormSelect';
