import React from 'react';
import { ISubmodule } from '@/interfaces';
import { IModule } from '@/interfaces';
import { TExtendedMenuItem } from '@/types';
import { getIconByName } from '@/helpers/icons';
import { generateUuid } from '../functions';

export const getIcon = (icon: string | null, className?: string, style?: React.CSSProperties): React.ReactNode => {
	return getIconByName(icon, { className, style, size: 16 });
};

export const transformModuleToMenuData = (module: IModule | null): TExtendedMenuItem[] => {
	if (!module) {
		return [];
	}

	const menuData: TExtendedMenuItem[] = [];

	menuData.push({
		key: generateUuid(),
		label: 'INICIO',
		icon: getIcon('HomeIcon'),
		data: {
			path: '/home',
			pathPadre: 'home',
			icon: 'HomeIcon',
			type: 'program',
			parentModule: 'home',
			parentSubmodule: 'home',
		},
	});

	// Procesar submodules
	module.submodules.forEach((submodule: ISubmodule) => {
		const submoduleChildren: TExtendedMenuItem[] = [];

		// Agregar grupos al submodule
		if (submodule.groups && submodule.groups.length > 0) {
			submodule.groups.forEach(group => {
				const groupChildren: TExtendedMenuItem[] = [];

				// Agregar programas del grupo
				if (group.programs && group.programs.length > 0) {
					group.programs.forEach(program => {
						groupChildren.push({
							key: generateUuid(),
							label: program.name,
							icon: getIcon(program.icon ?? null),
							data: {
								path: program.path ?? null,
								pathPadre: program.pathPadre ?? null,
								url: program.url ?? null,
								icon: getIcon(program.icon ?? null),
								actions: program.actions,
								type: 'program',
								parentGroup: group.name,
								parentSubmodule: submodule.name,
								parentModule: module.name,
							},
						});
					});
				}

				submoduleChildren.push({
					key: generateUuid(),
					label: group.name,
					icon: getIcon('MenuIcon'),
					children: groupChildren,
					data: {
						path: null,
						pathPadre: 'group',
						url: null,
						icon: getIcon('MenuIcon'),
						type: 'group',
						parentSubmodule: submodule.name,
						parentModule: module.name,
					},
				});
			});
		}

		// Agregar programas directos del submodule (que no están en grupos)
		if (submodule.programs && submodule.programs.length > 0) {
			submodule.programs.forEach(program => {
				submoduleChildren.push({
					key: generateUuid(),
					label: program.name,
					icon: getIcon(program.icon ?? null),
					data: {
						path: program.path ?? null,
						pathPadre: program.pathPadre ?? null,
						url: program.url ?? null,
						icon: getIcon(program.icon ?? null),
						actions: program.actions,
						type: 'program',
						parentSubmodule: submodule.name,
						parentModule: module.name,
					},
				});
			});
		}

		// Solo agregar el submodule si tiene contenido
		if (submoduleChildren.length > 0) {
			menuData.push({
				key: generateUuid(),
				label: submodule.name,
				icon: getIcon('MenuIcon'),
				children: submoduleChildren,
				data: {
					path: null,
					pathPadre: 'submodule',
					url: null,
					icon: getIcon('MenuIcon'),
					type: 'submodule',
					parentModule: module.name,
					parentSubmodule: submodule.name,
				},
			});
		}
	});

	return menuData;
};

/**
 * Función para filtrar items del menú por término de búsqueda
 */
export const filterMenuItems = (menuData: TExtendedMenuItem[], searchTerm: string): TExtendedMenuItem[] => {
	const searchUpper = searchTerm.toUpperCase();

	const filterRecursive = (items: TExtendedMenuItem[]): TExtendedMenuItem[] => {
		return items
			.map(item => {
				// Type guard para verificar si es SubMenuType (tiene children)
				const isSubMenu = 'children' in item;
				const filteredChildren =
					isSubMenu && item.children ? filterRecursive(item.children as TExtendedMenuItem[]) : undefined;

				// Si el item coincide con la búsqueda o tiene hijos que coinciden
				const matchesSearch =
					('label' in item && item.label?.toString().toUpperCase().includes(searchUpper)) ||
					(filteredChildren && filteredChildren.length > 0);

				if (matchesSearch) {
					return {
						...item,
						children: filteredChildren,
					};
				}
				return null;
			})
			.filter(Boolean) as TExtendedMenuItem[];
	};

	return filterRecursive(menuData);
};

/**
 * Función para obtener información de un item del menú seleccionado
 */
export const getMenuItemInfo = (item: TExtendedMenuItem) => {
	return {
		key: item.key,
		label: 'label' in item ? item.label : undefined,
		data: item.data,
		isLeaf: !('children' in item) || !item.children || item.children.length === 0,
	};
};
