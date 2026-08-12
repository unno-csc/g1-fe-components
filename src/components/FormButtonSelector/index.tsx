import { useModalResponsive } from '@/hooks';
import { useMemo } from 'react';
import classNames from 'classnames';
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { ReactNode } from 'react';
import { FormLabel } from '../FormLabel';
import { FormLabelError } from '../FormLabelError';
import { Controller, FieldValues, Path } from 'react-hook-form';
import { Control } from 'react-hook-form';
import { useFormConfig } from '../FormConfigProvider';

export interface IFormButtonSelectorValue {
	value: number;
	label: string;
}
export interface IFormButtonSelectorProps<TFieldValues extends FieldValues> {
	title: string;
	name: Path<TFieldValues>;
	placeholder?: string;
	children: ReactNode;
	control: Control<TFieldValues>;
	closable?: boolean;
	disabled?: boolean;
	value?: IFormButtonSelectorValue;
	showDirtyState?: boolean;
}

export const FormButtonSelector = <TFieldValues extends FieldValues>({
	title,
	value,
	placeholder = 'Seleccionar',
	children,
	control,
	name,
	closable = false,
	disabled = false,
	showDirtyState,
}: IFormButtonSelectorProps<TFieldValues>) => {
	const { showDirtyState: contextShowDirtyState } = useFormConfig();
	const isDirtyStateActive = showDirtyState ?? contextShowDirtyState;

	const { openModal } = useModalResponsive();

	const handleOpenModal = () => {
		openModal({
			title: 'Selector',
			content: children,
			height: 'auto',
		});
	};

	const normalizedValue = useMemo(() => {
		if (value) {
			return value.label;
		}
		return placeholder;
	}, [value]);
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => {
				const errorMsg = fieldState.error?.message as string | undefined;
				return (
					<div className="flex flex-col gap-1">
						<FormLabel label={title} />
						<div className={classNames({ 'flex items-center': closable, 'dirty-field': isDirtyStateActive && fieldState.isDirty })}>
							<Button
								variant="outlined"
								color={errorMsg ? 'danger' : undefined}
								block={!closable}
								onClick={handleOpenModal}
								className={`${value?.label ? 'flex justify-start' : 'flex justify-start text-gray-400'} ${closable ? `${value?.label ? 'flex-1 rounded-r-none' : 'flex-1'}` : ''} hover:!text-primary-600 hover:!border-primary-600 transition-colors`}
								disabled={disabled}
							>
								{normalizedValue}
							</Button>
							{closable && value?.label && (
								<Button
									onClick={() => field.onChange({ value: 0, label: '' })}
									type="default"
									aria-label="Limpiar selección"
									icon={<CloseOutlined />}
									className="rounded-l-none border-l-0 hover:!text-primary-600 hover:!border-primary-600 transition-colors"
								/>
							)}
						</div>
						{errorMsg && <FormLabelError label={errorMsg} />}
					</div>
				);
			}}
		/>
	);
};
