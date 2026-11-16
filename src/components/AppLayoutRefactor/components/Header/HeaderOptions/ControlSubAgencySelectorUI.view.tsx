import { IAgency, IProgram, ISubAgency } from '@/interfaces';
import { DownOutlined, ShopFilled } from '@ant-design/icons';
import { TreeSelect } from '@/components/TreeSelect';
import type { TreeSelectProps } from 'antd';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useAppLayoutStore } from '../../store';
import {
	MOBILE_SELECT_WRAPPER_CLASSNAME,
	MOBILE_TREE_SELECT_CLASSNAME,
	POPUP_STYLES,
	SELECT_WRAPPER_CLASSNAME,
	SELECT_WRAPPER_STYLE,
	TREE_SELECT_CLASSNAME,
	TREE_SELECT_POPUP_CLASSNAME,
} from '@/constants';
import { formatSubAgencyHeaderSelectLabel } from '../utils/headerSelectLabel';

export interface IMultiCompanyTreeNode {
	id: string | number;
	pId: string | number | null;
	value: string;
	title: ReactNode;
	label?: ReactNode;
	isLeaf?: boolean;
	selectable?: boolean;
	children?: IMultiCompanyTreeNode[];
	data?: ISubAgency;
	agencyId?: number;
	switcherIcon?: ReactNode;
}
export type MultiCompanyTreeNode = IMultiCompanyTreeNode;

export interface IControlSubAgencySelectorUIProps {
	loadRootNodes?: () => Promise<IMultiCompanyTreeNode[]>;
	loadChildren?: (node: IMultiCompanyTreeNode) => Promise<IMultiCompanyTreeNode[]>;
	loadingAppLayout?: boolean;
	menuItemsNavigate?: (program: IProgram) => void;
}
export type ControlSubAgencySelectorUIProps = IControlSubAgencySelectorUIProps;

const DEFAULT_SWITCHER_ICON = <DownOutlined className="text-[10px] text-gray-400" />;

const flattenNodes = (
	nodes: IMultiCompanyTreeNode[],
	parentId?: string | number,
	parentTitle?: string,
): IMultiCompanyTreeNode[] =>
	nodes.flatMap(({ children, ...node }) => {
		const nodeTitle = String(node.title ?? '');
		const flatNode: IMultiCompanyTreeNode = {
			...node,
			pId: parentId ?? node.pId,
			selectable: node.isLeaf === true,
			label:
				node.label ??
				(node.isLeaf && parentTitle ? formatSubAgencyHeaderSelectLabel(parentTitle, nodeTitle) : undefined),
		};

		const parentTitleForChildren = node.isLeaf ? parentTitle : nodeTitle;

		return [flatNode, ...(children ? flattenNodes(children, flatNode.id, parentTitleForChildren) : [])];
	});

const mapAgenciesToTreeNodes = (agencies: IAgency[]): IMultiCompanyTreeNode[] =>
	agencies.map(agency => {
		const hasSubAgencies = Boolean(agency.subAgencies && agency.subAgencies.length > 0);
		const syntheticSubAgency: ISubAgency = {
			id: agency.id,
			name: agency.name,
			modules: agency.modules ?? [],
		};
		const subAgencies: ISubAgency[] = hasSubAgencies ? agency.subAgencies! : [syntheticSubAgency];

		return {
			id: `agency-${agency.id}`,
			pId: null,
			value: `agency-${agency.id}`,
			title: agency.name,
			label: agency.name,
			isLeaf: !hasSubAgencies,
			selectable: !hasSubAgencies,
			data: !hasSubAgencies ? syntheticSubAgency : undefined,
			agencyId: agency.id,
			switcherIcon: !hasSubAgencies ? DEFAULT_SWITCHER_ICON : undefined,
			children: hasSubAgencies
				? subAgencies.map(sub => ({
						id: `subagency-${agency.id}-${sub.id}`,
						pId: `agency-${agency.id}`,
						value: `subagency-${agency.id}-${sub.id}`,
						title: sub.name,
						label: formatSubAgencyHeaderSelectLabel(agency.name, sub.name),
						isLeaf: true,
						selectable: true,
						data: sub,
						agencyId: agency.id,
					}))
				: undefined,
		};
	});

export const ControlSubAgencySelectorUI = ({
	loadChildren,
	loadingAppLayout = false,
	menuItemsNavigate,
}: IControlSubAgencySelectorUIProps) => {
	const { agency, subAgency, selectSubAgency, permissions } = useAppLayoutStore();
	const [treeData, setTreeData] = useState<MultiCompanyTreeNode[]>([]);

	useEffect(() => {
		if (permissions === undefined) return;
		setTreeData(flattenNodes(mapAgenciesToTreeNodes(permissions.agencies)));
	}, [permissions]);

	const findNodeByValue = useCallback((value: string) => treeData.find(node => node.value === value), [treeData]);

	const onLoadData: TreeSelectProps<string>['loadData'] = async treeNode => {
		if (!loadChildren) return;

		const parentNode = findNodeByValue(String(treeNode.value ?? treeNode.key ?? ''));
		if (!parentNode) return;

		const children = await loadChildren(parentNode);
		setTreeData(currentTreeData => {
			const currentValues = new Set(currentTreeData.map(node => node.value));
			const newNodes = flattenNodes(children, parentNode.id, String(parentNode.title ?? '')).filter(
				node => !currentValues.has(node.value),
			);

			return [...currentTreeData, ...newNodes];
		});
	};

	const onSelect = (value: string) => {
		const selectedNode = findNodeByValue(value);
		if (!selectedNode?.data) return;
		selectSubAgency(selectedNode.data.id, selectedNode.agencyId);
		const homeProgram: IProgram = {
			id: 0,
			name: 'Home',
			path: '/home',
			icon: 'home',
			root: true,
			roleId: 0,
		};
		menuItemsNavigate?.(homeProgram);
	};

	const selectedValue = subAgency
		? treeData.find(node => node.data?.id === subAgency.id && node.agencyId === agency?.id)?.value
		: undefined;

	const currentAgencyLabel =
		agency && subAgency
			? agency.name === subAgency.name
				? agency.name
				: `${agency.name} - ${subAgency.name}`
			: (subAgency?.name ?? agency?.name ?? 'Agencia');

	const treeSelectProps = {
		treeDataSimpleMode: true as const,
		treeData,
		loadData: loadChildren ? onLoadData : undefined,
		loading: loadingAppLayout,
		value: selectedValue,
		onSelect,
		size: 'middle' as const,
		popupMatchSelectWidth: false,
		popupClassName: TREE_SELECT_POPUP_CLASSNAME,
		switcherIcon: DEFAULT_SWITCHER_ICON,
		treeDefaultExpandAll: true,
		treeExpandAction: 'click' as const,
		listHeight: 240,
		styles: POPUP_STYLES,
		treeNodeLabelProp: 'label' as const,
	};

	return (
		<>
			<div className={`hidden md:block ${SELECT_WRAPPER_CLASSNAME}`} style={SELECT_WRAPPER_STYLE}>
				<TreeSelect<string>
					{...treeSelectProps}
					placeholder="Seleccione una agencia"
					className={TREE_SELECT_CLASSNAME}
				/>
			</div>

			<div className={MOBILE_SELECT_WRAPPER_CLASSNAME} title={currentAgencyLabel}>
				<span
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center text-sm text-gray-700 transition-colors group-hover:text-warning group-focus-within:text-warning"
				>
					<ShopFilled />
				</span>
				<TreeSelect<string>
					{...treeSelectProps}
					suffixIcon={null}
					placement="bottomRight"
					className={MOBILE_TREE_SELECT_CLASSNAME}
				/>
			</div>
		</>
	);
};
