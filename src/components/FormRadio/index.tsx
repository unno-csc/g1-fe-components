import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { memo, ReactNode } from 'react';
import classNames from 'classnames';
import { useFormConfig } from '../FormConfigProvider';
import { Radio } from '@/components/Radio/Radio';
import type { IRadioGroupProps } from '@/components/Radio/Radio';
import { FormLabel } from '@/components/FormLabel';
import { FormLabelError } from '@/components/FormLabelError';

export interface IFormRadioProps<TFieldValues extends FieldValues>
	extends Omit<IRadioGroupProps, 'form' | 'name'> {
	name: Path<TFieldValues>;
	label: string;
	control: Control<TFieldValues>;
	children?: ReactNode;
	hideWrapperBorder?: boolean;
	showDirtyState?: boolean;
}

const FormRadioComponent = <TFieldValues extends FieldValues>({
	name,
	label,
	control,
	children,
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
				const mergedRootClassName = classNames(rest.rootClassName, 'itsa-radio--warning');
				const isDirty = Boolean(isDirtyStateActive) && Boolean(fieldState.isDirty);
				const hasError = Boolean(errorMsg);
				const hasLabel = Boolean(label);

				return (
					<div
						className={classNames('flex flex-col gap-1', {
							'p-1 border rounded-[6px] transition-colors duration-300': !hideWrapperBorder,
							'border-gray-200': !hideWrapperBorder && !isDirty,
							'border-[#facc15]': !hideWrapperBorder && isDirty,
						})}
					>
						{hasLabel && label !== undefined && <FormLabel label={label} />}
						<Radio.Group
							{...rest}
							rootClassName={mergedRootClassName}
							variant="default"
							value={field.value}
							onChange={field.onChange}
							onBlur={field.onBlur}
						>
							{children}
						</Radio.Group>
						{hasError && errorMsg !== undefined && <FormLabelError label={errorMsg} />}
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
