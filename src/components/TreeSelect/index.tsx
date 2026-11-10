import { DownOutlined } from '@ant-design/icons';
import { TreeSelect as AntTreeSelect, TreeSelectProps } from 'antd';
import classNames from 'classnames';
import { RefCallBack } from 'react-hook-form';

export interface ITreeSelectProps<ValueType = unknown> extends TreeSelectProps<ValueType> {
	status?: 'error' | 'warning' | undefined;
	ref?: RefCallBack;
}

const collectSelectableValues = (treeData?: TreeSelectProps['treeData']): (string | number)[] => {
	const values: (string | number)[] = [];

	const walk = (nodes?: NonNullable<TreeSelectProps['treeData']>) => {
		nodes?.forEach(node => {
			if (node.selectable !== false) {
				values.push(node.value as string | number);
			}
			if (node.children && node.children.length > 0) {
				walk(node.children);
			}
		});
	};

	walk(treeData);
	return values;
};

export const TreeSelect = <ValueType = unknown>({
	ref,
	status,
	className,
	popupClassName,
	classNames: treeClassNames,
	switcherIcon,
	...rest
}: ITreeSelectProps<ValueType>) => {
	const validValues = rest.treeData ? collectSelectableValues(rest.treeData) : undefined;
	const safeValue =
		validValues && validValues.length > 0
			? validValues.includes(rest.value as string | number)
				? rest.value
				: undefined
			: rest.value;

	const mergedPopupClassName = classNames('itsa-tree-select-dropdown', popupClassName, treeClassNames?.popup?.root);

	return (
		<AntTreeSelect
			switcherIcon={switcherIcon ?? <DownOutlined className="itsa-tree-select-switcher-icon text-[10px] text-gray-400" />}
			{...rest}
			value={safeValue}
			ref={ref}
			status={status}
			classNames={{
				...treeClassNames,
				popup: {
					root: mergedPopupClassName,
				},
			}}
			className={classNames('w-full rounded-lg', className)}
		/>
	);
};
