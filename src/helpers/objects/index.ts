import { ItemType, MenuItemType } from 'antd/es/menu/interface';
import { IMenuItem, IPermissionSubmodule } from '../../interfaces';
import { TExtendedMenuItem, TInputOptions } from '../../types';
import { ICON_MAP } from '../../utils/constants';
import { isEmpty } from '../booleansChecks';
import { toTitleCase } from '../strings';
import { ELocalStorageKeys } from '@/enums';

type Tree = Record<string, any>;

const EMPTY_DEFAULT_INPUT_LABEL = { value: '', label: '' };

export const cleanObject = (obj: any) => {
	if (typeof obj !== 'object' || obj === null) return obj;

	const result: any = Array.isArray(obj) ? [] : {};

	for (const key in obj) {
		const value = obj[key];

		if (typeof value === 'object' && value !== null) {
			const nested = cleanObject(value);
			if (Array.isArray(nested) || !isEmpty(nested)) {
				result[key] = nested;
			}
		} else if (!isEmpty(value)) {
			result[key] = value;
		}
	}

	return result;
};

export const getMappedOptionFromLocal = (
	value: string | null | undefined,
	options: Record<string, string>,
): TInputOptions => {
	return value ? { label: options[value] ?? value, value } : { value: '', label: '' };
};

export const createValueLabelMap = (options: TInputOptions[]) =>
	options.reduce(
		(acc, curr) => {
			acc[curr.value] = curr.label;
			return acc;
		},
		{} as Record<string, string>,
	);

export const getMappedOptionFromAPI = (
	value: string | undefined | null | number,
	options: TInputOptions[],
): TInputOptions => {
	if (!value) return EMPTY_DEFAULT_INPUT_LABEL;

	const map = createValueLabelMap(options);
	const label = map[value];

	return label ? { value, label } : EMPTY_DEFAULT_INPUT_LABEL;
};

export const mapPermissionsToMenuFormat = (subModules: IPermissionSubmodule[]): IMenuItem[] => {
	return subModules.map((module): IMenuItem => {
		const subList: IMenuItem[] = [];

		if (module.groups?.length) {
			const groupItems = module.groups.map(
				(group): IMenuItem => ({
					id: group.id,
					name: group.name,
					icon: ICON_MAP[group.icon as keyof typeof ICON_MAP],
					path: group.path,
					title: toTitleCase(group.name),
					subList: group?.programs
						? group.programs.map(
								(program): IMenuItem => ({
									id: program.id,
									name: program.name,
									title: toTitleCase(program.name),
									icon: ICON_MAP[program.icon as keyof typeof ICON_MAP],
									path: program.path,
									actions: program.actions,
								}),
							)
						: [],
				}),
			);

			subList.push(...groupItems);
		}

		if (module.programs?.length) {
			const directPrograms = module.programs.map(
				(program): IMenuItem => ({
					id: program.id,
					name: program.name,
					title: toTitleCase(program.name),
					icon: ICON_MAP[program.icon as keyof typeof ICON_MAP],
					path: program.path,
					actions: program.actions,
				}),
			);

			subList.push(...directPrograms);
		}

		return {
			id: module.id,
			name: module.name,
			title: toTitleCase(module.name),
			icon: ICON_MAP[module.icon as keyof typeof ICON_MAP],
			path: module.path,
			subList,
		};
	});
};

export const filterMenuTree = (nodes: IMenuItem[], searchTerm: string): IMenuItem[] => {
	const normalize = (text: string) =>
		text
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase();

	const normalizedSearch = normalize(searchTerm);

	return nodes
		.map(node => {
			const newNode: IMenuItem = { ...node };

			if (newNode.subList && Array.isArray(newNode.subList)) {
				newNode.subList = filterMenuTree(newNode.subList, searchTerm);
			}

			const matchesTitle = newNode.title ? normalize(newNode.title).includes(normalizedSearch) : false;

			const hasMatchingChildren = newNode.subList && newNode.subList.length > 0;

			if (matchesTitle || hasMatchingChildren) {
				return newNode;
			}

			return null;
		})
		.filter((node): node is IMenuItem => node !== null);
};

export const generateFilteredMenu = (
	subModules: IPermissionSubmodule[] | undefined,
	searchTerm: string,
): IMenuItem[] => {
	if (!subModules) return [];

	const mappedMenu = mapPermissionsToMenuFormat(subModules);

	if (searchTerm.trim() !== '') {
		return filterMenuTree(mappedMenu, searchTerm);
	}

	return mappedMenu;
};

export const hasAllRequiredFields = (values: Record<string, any>, requiredFields: string[]): boolean => {
	return requiredFields.every(field => {
		const value = values[field];

		if (value === null || value === undefined) return false;

		if (typeof value === 'string' && value.trim() === '') return false;

		if (Array.isArray(value) && value.length === 0) return false;

		return true;
	});
};

export const findLastChild = (tree: Tree, nodeId: string): any => {
	return tree?.[nodeId] ? findLastChild(tree[nodeId], nodeId) : tree;
};

export const getNestedValue = <T, U = undefined>(obj: T, path: string | string[], defaultValue?: U): U | any => {
	const keys = Array.isArray(path) ? path : path.split('.');
	let result: any = obj;

	for (const key of keys) {
		if (result && Object.prototype.hasOwnProperty.call(result, key)) {
			result = result[key];
		} else {
			return defaultValue;
		}
	}

	return result;
};

export const filterMenuSidebar = (items: MenuItemType[], query: string): MenuItemType[] => {
	const norm = (s: string) =>
		s
			.toLowerCase()
			.normalize('NFD')
			.replace(/\p{Diacritic}/gu, '');

	const getText = (n: React.ReactNode) => (typeof n === 'string' || typeof n === 'number' ? String(n) : '');

	const q = norm(query.trim());

	if (!q) {
		return items;
	}

	// New object functions from here
	const filterNode = (node: ItemType<MenuItemType>): ItemType<MenuItemType> | null => {
		if (!node) {
			return null;
		}

		const nodeLabel = (node as any).label;
		const nodeLabelUppercase = (nodeLabel ?? '').toUpperCase();
		const selfMatch = norm(getText(nodeLabelUppercase)).includes(q) || nodeLabelUppercase.includes(q.toUpperCase());
		const nodeChildren = (node as any).children;

		if (nodeChildren && Array.isArray(nodeChildren) && nodeChildren.length > 0) {
			const filteredChildren = nodeChildren
				.map((child: ItemType<MenuItemType>) => filterNode(child))
				.filter((child: ItemType<MenuItemType> | null) => child !== null) as ItemType<MenuItemType>[];

			if (filteredChildren.length > 0 || selfMatch) {
				return {
					...node,
					...(filteredChildren.length > 0 && { children: filteredChildren }),
				} as ItemType<MenuItemType>;
			}
			return null;
		} else {
			return selfMatch ? node : null;
		}
	};
	return items.map(item => filterNode(item)).filter((item): item is MenuItemType => item !== null);
};

export const getAllMenuKeys = (items: TExtendedMenuItem[]): string[] => {
	const keys: string[] = [];

	const extractKeys = (menuItems: TExtendedMenuItem[]) => {
		menuItems.forEach(item => {
			if (item?.key) {
				keys.push(String(item.key));
			}
			// Type assertion for children property since MenuItemType might have children
			const itemWithChildren = item as MenuItemType & { children?: MenuItemType[] };
			if (itemWithChildren?.children && Array.isArray(itemWithChildren.children)) {
				extractKeys(itemWithChildren.children);
			}
		});
	};

	extractKeys(items);
	return keys;
};

export const dataFromLocalStorage = (key: ELocalStorageKeys) => {
	try {
		const item = localStorage.getItem(key);
		return item ? item : null;
	} catch (e) {
		console.error(`Error leyendo localStorage[${key}]:`, e);
		return null;
	}
};

export const getValidateStatus = (msg?: string) => (msg ? 'error' : undefined);

export const cleanObj = <T extends Record<string, any>>(obj: T): Partial<T> => {
	return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined && v !== '')) as Partial<T>;
};	
