import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { memo } from 'react';
import { Radio } from '@/components/Radio/Radio';
import type { RadioGroupProps } from 'antd';
import { FormLabelError } from '@/index';

export interface IFormRadioProps<TFieldValues extends FieldValues> extends Omit<RadioGroupProps, 'form' | 'name'> {
	name: Path<TFieldValues>;
	label: string;
	control: Control<TFieldValues>;
}

const FormRadioComponent = <TFieldValues extends FieldValues>({
	name,
	label,
	control,
	...rest
}: IFormRadioProps<TFieldValues>) => {
	return (
			<Controller
				name={name}
				control={control}
				render={({ field, fieldState }) => {
					const errorMsg = fieldState.error?.message as string | undefined;
					const mergedRootClassName = [rest.rootClassName, 'itsa-radio--warning'].filter(Boolean).join(' ');
					return (
						<div className="flex flex-col gap-1">
							<Radio
								{...rest}
								rootClassName={mergedRootClassName}
								variant="default"
								label={label}
								value={field.value}
								onChange={field.onChange}
								onBlur={field.onBlur}
							/>
							{errorMsg && <FormLabelError label={errorMsg} />}
						</div>
					);
				}}
			/>
		);
};

export const FormRadio = memo(FormRadioComponent) as typeof FormRadioComponent & {
	displayName?: string;
};

FormRadio.displayName = 'FormRadio';
