import { TreeSelect as AntTreeSelect, TreeSelectProps } from 'antd';
import { RefCallBack } from 'react-hook-form';

export interface ITreeSelectProps extends TreeSelectProps {
	status?: 'error' | 'warning' | undefined;
	ref?: RefCallBack;
}

const collectSelectableValues = (treeData?: TreeSelectProps['treeData']): (string | number)[] => {
	const values: (string | number)[] = [];

	const walk = (nodes?: NonNullable<TreeSelectProps['treeData']>) => {
		nodes?.forEach(node => {
			if (node.children && node.children.length > 0) {
				walk(node.children);
			} else if (node.selectable !== false) {
				values.push(node.value as string | number);
			}
		});
	};

	walk(treeData);
	return values;
};

export const TreeSelect = ({ ref, status, ...rest }: ITreeSelectProps) => {
	const validValues = collectSelectableValues(rest.treeData);
	const safeValue = validValues.includes(rest.value as string | number) ? rest.value : undefined;

	return (
		<AntTreeSelect
			{...rest}
			value={safeValue}
			ref={ref}
			status={status}
			className="w-full rounded-lg"
		/>
	);
};
