import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { memo } from 'react';
import classNames from 'classnames';
import { useFormConfig } from '../FormConfigProvider';
import { Radio } from '@/components/Radio/Radio';
import type { RadioGroupProps } from 'antd';
import { FormLabelError } from '@/index';

export interface IFormRadioProps<TFieldValues extends FieldValues> extends Omit<RadioGroupProps, 'form' | 'name'> {
	name: Path<TFieldValues>;
	label: string;
	control: Control<TFieldValues>;
	hideWrapperBorder?: boolean;
	showDirtyState?: boolean;
}

const FormRadioComponent = <TFieldValues extends FieldValues>({
	name,
	label,
	control,
	hideWrapperBorder = false,
	showDirtyState,
	...rest
}: IFormRadioProps<TFieldValues>) => {
	const { showDirtyState: contextShowDirtyState } = useFormConfig();
	const isDirtyStateActive = showDirtyState ?? contextShowDirtyState;

	return (
			<Controller
				name={name}
				control={control}
				render={({ field, fieldState }) => {
					const errorMsg = fieldState.error?.message as string | undefined;
					const mergedRootClassName = [rest.rootClassName, 'itsa-radio--warning'].filter(Boolean).join(' ');
					return (
						<div className={classNames("flex flex-col gap-1", {
							'p-1 border rounded-[6px] transition-colors duration-300': !hideWrapperBorder,
							'border-gray-200': !hideWrapperBorder && !(isDirtyStateActive && fieldState.isDirty),
							'border-[#facc15]': !hideWrapperBorder && (isDirtyStateActive && fieldState.isDirty)
						})}>
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
