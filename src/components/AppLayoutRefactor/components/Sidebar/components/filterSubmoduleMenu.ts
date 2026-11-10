import { ISubmodule } from '@/interfaces';
import { ItemType, MenuItemType } from 'antd/es/menu/interface';

const matchesSearch = (text: string, searchTerm: string) =>
	text.toUpperCase().includes(searchTerm.toUpperCase());

export const filterSubmodule = (submodule: ISubmodule, searchTerm: string): ISubmodule | null => {
	const normalizedSearch = searchTerm.trim();
	if (!normalizedSearch) return submodule;

	const nameMatches = matchesSearch(submodule.name, normalizedSearch);

	const filteredGroups = (submodule.groups ?? [])
		.map(group => filterSubmodule(group, normalizedSearch))
		.filter((group): group is ISubmodule => group !== null);

	const filteredPrograms = (submodule.programs ?? [])
		.filter((program): program is NonNullable<typeof program> => Boolean(program && program.root !== false))
		.filter(program => matchesSearch(program.name, normalizedSearch));

	if (nameMatches) {
		return {
			...submodule,
			groups: submodule.groups ?? [],
			programs: (submodule.programs ?? []).filter((program): program is NonNullable<typeof program> => Boolean(program && program.root !== false)),
		};
	}

	if (filteredGroups.length > 0 || filteredPrograms.length > 0) {
		return {
			...submodule,
			groups: filteredGroups,
			programs: filteredPrograms,
		};
	}

	return null;
};

export const collectSubmenuKeys = (items: ItemType<MenuItemType>[]): string[] => {
	const keys: string[] = [];

	const walk = (menuItems: ItemType<MenuItemType>[]) => {
		menuItems.forEach(item => {
			if (!item || !('key' in item)) return;

			if ('children' in item && item.children && item.children.length > 0) {
				keys.push(String(item.key));
				walk(item.children as ItemType<MenuItemType>[]);
			}
		});
	};

	walk(items);
	return keys;
};
