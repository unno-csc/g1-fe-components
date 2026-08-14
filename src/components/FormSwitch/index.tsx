import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { memo } from 'react';
import classNames from 'classnames';
import { Switch } from '@/components/Switch/Switch';
import type { SwitchCustomProps } from '@/components/Switch/Switch';
import { FormLabelError } from '@/index';
import { useFormConfig } from '../FormConfigProvider';

export interface IFormSwitchProps<TFieldValues extends FieldValues>
	extends Omit<SwitchCustomProps, 'checked' | 'onChange'> {
	name: Path<TFieldValues>;
	control: Control<TFieldValues>;
	checkedLabel?: string;
	uncheckedLabel?: string;
	label?: string;
	hideWrapperBorder?: boolean;
	showDirtyState?: boolean;
	onChange?: (checked: boolean) => void;
	className?: string;
	classNameBorder?: string;
	contentClassName?: string;
}

const FormSwitchComponent = <TFieldValues extends FieldValues>({
	name,
	control,
	checkedLabel,
	uncheckedLabel,
	label,
	hideWrapperBorder = false,
	showDirtyState,
	onChange,
	className,
	classNameBorder,
	contentClassName,
	...rest
}: IFormSwitchProps<TFieldValues>) => {
	const { showDirtyState: contextShowDirtyState } = useFormConfig();
	const isDirtyStateActive = showDirtyState ?? contextShowDirtyState;

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => {
				const errorMsg = fieldState.error?.message as string | undefined;
				return (
					<div className={classNames('flex flex-col gap-1 w-full', className)}>
						<div
							className={classNames(
								'flex items-center gap-2',
								{
									'w-full h-full justify-center p-1 border rounded-[6px] transition-colors duration-300':
										!hideWrapperBorder,
									'border-gray-200': !hideWrapperBorder && !(isDirtyStateActive && fieldState.isDirty),
									'border-[#facc15]': !hideWrapperBorder && isDirtyStateActive && fieldState.isDirty,
								},
								classNameBorder,
								contentClassName
							)}
							onBlur={field.onBlur}
						>
							<Switch
								{...rest}
								checked={field.value}
								onChange={checked => {
									field.onChange(checked);
									if (onChange) {
										onChange(checked);
									}
								}}
								checkedLabel={checkedLabel}
								uncheckedLabel={uncheckedLabel}
							/>
							{label && <label className="text-sm font-medium">{label}</label>}
						</div>
						{errorMsg && <FormLabelError label={errorMsg} />}
					</div>
				);
			}}
		/>
	);
};

export const FormSwitch = memo(FormSwitchComponent) as typeof FormSwitchComponent & {
	displayName?: string;
};

FormSwitch.displayName = 'FormSwitch';
