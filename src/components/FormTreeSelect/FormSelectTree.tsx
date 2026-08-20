import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { FormLabel } from '@/components/FormLabel';
import { FormLabelError } from '@/components/FormLabelError';
import { memo, useId, useMemo } from 'react';
import { TreeSelectProps } from 'antd';
import { TreeSelect } from '@/components/TreeSelect';

export interface IFormSelectTreeOption {
	label: string;
	value: string | number;
	children?: IFormSelectTreeOption[];
}

export interface IFormSelectTreeProps<TFieldValues extends FieldValues>
	extends Omit<TreeSelectProps, 'form' | 'name' | 'treeData'> {
	name: Path<TFieldValues>;
	label: string;
	control: Control<TFieldValues>;
	options: IFormSelectTreeOption[];
	allowClear?: boolean;
	placeholder?: string;
	isLoading?: boolean;
	disabled?: boolean;
}

const mapOptionsToTreeData = (options: IFormSelectTreeOption[]): TreeSelectProps['treeData'] => {
	return options.map(option => {
		const hasChildren = (option.children?.length ?? 0) > 0;

		return {
			title: option.label,
			value: option.value,
			selectable: !hasChildren,
			children: hasChildren ? mapOptionsToTreeData(option.children!) : undefined,
		};
	});
};

const collectLeafValues = (options: IFormSelectTreeOption[]): (string | number)[] => {
	const values: (string | number)[] = [];

	const walk = (nodes: IFormSelectTreeOption[]) => {
		nodes.forEach(node => {
			if ((node.children?.length ?? 0) > 0) {
				walk(node.children!);
			} else {
				values.push(node.value);
			}
		});
	};

	walk(options);
	return values;
};

const FormSelectTreeComponent = <TFieldValues extends FieldValues>({
	name,
	label,
	control,
	options,
	allowClear,
	placeholder,
	isLoading,
	disabled = false,
}: IFormSelectTreeProps<TFieldValues>) => {
	const id = useId();
	const errId = `${id}-error`;

	const treeData = useMemo(() => mapOptionsToTreeData(options), [options]);
	const leafValues = useMemo(() => collectLeafValues(options), [options]);

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
				const safeValue = leafValues.includes(field.value) ? field.value : undefined;

				return (
					<div className="flex flex-col">
						<FormLabel label={label} htmlFor={id} />
						<TreeSelect
							id={id as string}
							showSearch
							treeDefaultExpandAll
							treeNodeFilterProp="title"
							allowClear={allowClear}
							value={safeValue}
							onChange={field.onChange}
							onBlur={field.onBlur}
							ref={field.ref}
							status={errorMsg ? 'error' : undefined}
							aria-invalid={!!errorMsg}
							aria-describedby={errorMsg ? errId : undefined}
							treeData={treeData}
							placeholder={placeholderUppercase}
							loading={isLoading}
							disabled={disabled}
						/>
						{errorMsg && <FormLabelError label={errorMsg} id={errId} />}
					</div>
				);
			}}
		/>
	);
};

export const FormSelectTree = memo(FormSelectTreeComponent) as typeof FormSelectTreeComponent & {
	displayName?: string;
};

FormSelectTree.displayName = 'FormSelectTree';
