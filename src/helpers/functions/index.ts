import { ELocalStorageKeys } from '@/enums';
import { EOptionsFilterStatus, EActionType } from '@/enums';
import { IActions, IModule, IProgramActions } from '@/interfaces';
import { TNotificationProps } from '@/types';
import { notification } from 'antd';
import { dataFromLocalStorage } from '../objects';

export const openNotificationWithIcon = ({ type, message, description }: TNotificationProps) => {
	notification[type]({
		message,
		description,
	});
};

export const normalizeStatus = (status?: string | boolean | number): EOptionsFilterStatus => {
	if (status === undefined || status === null || status === '') return 2;

	if (status === true || status === 'true' || status === 1 || status === '1') return 1;

	if (status === false || status === 'false' || status === 0 || status === '0') return 0;

	return 2;
};

export const getStoredCollapsedSidebar = () => {
	const closeSidebar = dataFromLocalStorage(ELocalStorageKeys.collapsedSidebar);
	return closeSidebar === 'true' ? true : false;
};

export const setStoredCollapsedSidebar = (collapsed: boolean) => {
	localStorage.setItem(ELocalStorageKeys.collapsedSidebar, String(collapsed));
};
export const getProgramActionsbyPath = (path: string, module: IModule): IProgramActions | undefined => {
	if (!path || !module?.submodules?.length) {
		// console.log('getProgramActionsbyPath: early return - path:', path, 'submodules:', module?.submodules?.length);
		return undefined;
	}
	// Normaliza paths para comparar por segmentos y evitar coincidencias parciales (role vs roles)
	const extractPathname = (input: string): string => {
		if (!input) return '';
		let cleaned: string = input.trim();
		// elimina protocolo y host si vienen en la URL
		cleaned = cleaned.replace(/^[a-zA-Z]+:\/\/[^/]+/, '');
		// toma solo el path sin query/hash sin usar indexación insegura
		const qIndex = cleaned.indexOf('?');
		const hIndex = cleaned.indexOf('#');
		let endIndex = cleaned.length;
		if (qIndex !== -1 && hIndex !== -1) endIndex = Math.min(qIndex, hIndex);
		else if (qIndex !== -1) endIndex = qIndex;
		else if (hIndex !== -1) endIndex = hIndex;
		const withoutQuery: string = cleaned.substring(0, endIndex);
		// normaliza slashes de inicio/fin
		let pathname: string = withoutQuery;
		if (pathname.startsWith('/')) pathname = pathname.slice(1);
		if (pathname.length > 1 && pathname.endsWith('/')) pathname = pathname.slice(0, -1);
		return pathname;
	};

	const matchesPath = (programUrlOrPath: string, targetPath: string): boolean => {
		const programPath = extractPathname(programUrlOrPath);
		const targetPathname = extractPathname(targetPath);
		if (!programPath || !targetPathname) return false;
		// Coincidencia exacta
		if (programPath === targetPathname) return true;
		// El path buscado debe comenzar con el path del programa + '/'
		// Ejemplo: programa tiene "spares/customers-management" y buscamos "spares/customers-management/create"
		return targetPathname.startsWith(programPath + '/');
	};

	const targetPath: string = path;
	// const normalizedTarget = extractPathname(targetPath);

	const submodules = module.submodules ?? [];
	
	for (const submodule of submodules) {
		
		// 1) Buscar en programs del submódulo
		const programs = submodule.programs;
		if (programs && programs.length > 0) {
			for (const program of programs) {
				const url = program.url ? program.url : undefined;
				const programPath = program.path ? program.path : undefined;
				
				// Buscar tanto en url como en path
				const urlMatch = url && typeof url === 'string' && url.length > 0 && matchesPath(url, targetPath);
				const pathMatch = programPath && typeof programPath === 'string' && programPath.length > 0 && matchesPath(programPath, targetPath);
				
				if (urlMatch || pathMatch) {
					if (program.actions) {
						return { actions: program.actions, program: program };
					} 
					// else {
					// 	console.log('getProgramActionsbyPath: programa encontrado pero sin actions');
					// }
				} 
				// else {
				// 	// Log detallado cuando no hay match para debugging
				// 	if (url) {
				// 		const urlNormalized = extractPathname(url);
				// 		const targetNormalized = extractPathname(targetPath);
				// 		console.log(`getProgramActionsbyPath: NO match URL - programa: "${urlNormalized}" vs buscado: "${targetNormalized}"`);
				// 	}
				// 	if (programPath) {
				// 		const pathNormalized = extractPathname(programPath);
				// 		const targetNormalized = extractPathname(targetPath);
				// 		console.log(`getProgramActionsbyPath: NO match PATH - programa: "${pathNormalized}" vs buscado: "${targetNormalized}"`);
				// 	}
				// }
			}
		}

		// 2) Buscar en groups -> programs
		const groups = submodule.groups;
		if (groups && groups.length > 0) {
			for (const group of groups) {
				const groupPrograms = group.programs;
				if (groupPrograms && groupPrograms.length > 0) {
					
					for (const program of groupPrograms) {
						const url = program.url ? program.url : undefined;
						const programPath = program.path ? program.path : undefined;
						
						// Buscar tanto en url como en path
						const urlMatch = url && typeof url === 'string' && url.length > 0 && matchesPath(url, targetPath);
						const pathMatch = programPath && typeof programPath === 'string' && programPath.length > 0 && matchesPath(programPath, targetPath);
						
						if (urlMatch || pathMatch) {
							
							if (program.actions) {
								return { actions: program.actions, program: program };
							} 
							// else {
							// 	console.log('getProgramActionsbyPath: programa encontrado pero sin actions');
							// }
						} 
						// else {
						// 	// Log detallado cuando no hay match para debugging
						// 	if (url) {
						// 		const urlNormalized = extractPathname(url);
						// 		const targetNormalized = extractPathname(targetPath);
						// 		console.log(`getProgramActionsbyPath: NO match URL (grupo) - programa: "${urlNormalized}" vs buscado: "${targetNormalized}"`);
						// 	}
						// 	if (programPath) {
						// 		const pathNormalized = extractPathname(programPath);
						// 		const targetNormalized = extractPathname(targetPath);
						// 		console.log(`getProgramActionsbyPath: NO match PATH (grupo) - programa: "${pathNormalized}" vs buscado: "${targetNormalized}"`);
						// 	}
						// }
					}
				}
			}
		}
	}
	return undefined;
};

export const disabledActionButton = (actionExecute?: EActionType, actions?: IActions) => {
	if (!actionExecute) return false;
	if (!actions) return true;
	if (actions.allActions === true) {
		return false;
	}
	if (actions.create === true && actionExecute === EActionType.create) {
		return false;
	}
	if (actions.read === true && actionExecute === EActionType.read) {
		return false;
	}
	if (actions.update === true && actionExecute === EActionType.update) {
		return false;
	}
	if (actions.delete === true && actionExecute === EActionType.delete) {
		return false;
	}
	return true;
};

export const uppercaseStrings = <T>(obj: T): T => {
	if (obj === null || obj === undefined) return obj;
	if (typeof obj === 'string') {
		return obj.toUpperCase() as unknown as T;
	}
	if (Array.isArray(obj)) {
		return obj.map(item => uppercaseStrings(item)) as unknown as T;
	}
	if (typeof obj === 'object') {
		const result: any = {};
		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				result[key] = uppercaseStrings((obj as any)[key]);
			}
		}
		return result as T;
	}
	return obj;
};


