import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { memo } from 'react';
import { Checkbox } from '@/components/Checkbox/Checkbox';
import { CheckboxProps } from 'antd';
import { FormLabelError } from '@/index';

export interface IInputProps<TFieldValues extends FieldValues> extends Omit<CheckboxProps, 'form' | 'onChange' | 'name'> {
	name: Path<TFieldValues>;
	label: string;
	control: Control<TFieldValues>;
	onChange?: () => void;
}

const FormCheckBoxComponent = <TFieldValues extends FieldValues>({
	name,
	label,
	control,
	onChange,
	...rest
}: IInputProps<TFieldValues>) => {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => {
				const errorMsg = fieldState.error?.message as string | undefined;
				const mergedRootClassName = [rest.rootClassName, 'itsa-checkbox--warning'].filter(Boolean).join(' ');
				return (
					<div className="flex flex-col gap-1">
						<Checkbox
							{...rest}
							rootClassName={mergedRootClassName}
								variant="default"
								checked={field.value}
								onChange={e => {
									const newValue = e.target.checked;
									field.onChange(newValue);
									onChange?.();
								}}
								onBlur={field.onBlur}
							>
							{label}
						</Checkbox>
						{errorMsg && <FormLabelError label={errorMsg} />}
					</div>
				);
			}}
		/>
	);
};

export const FormCheckBox = memo(FormCheckBoxComponent) as typeof FormCheckBoxComponent & {
	displayName?: string;
};

FormCheckBox.displayName = 'FormCheckBox';
