import { getProgramActionsbyPath } from '@/helpers/functions';
import { IActions } from '@/interfaces';
import { useAppLayoutStore } from '@/store';
import { createContext, ReactNode, useEffect, useState } from 'react';

export interface ControlActionsContextType {
	setCurrentPath: (path: string) => void;
	actions?: IActions;
	programId?: number;
	fnApiValidatePermissionAction: (actionTypeId: number, programId: number, agencyId: number) => Promise<boolean>;
}

export interface ControlActionsProviderProps {
	children: ReactNode;
	fnApiValidatePermissionAction: (actionTypeId: number, programId: number, agencyId: number) => Promise<boolean>;
}

export const ControlActionsContext = createContext<ControlActionsContextType | undefined>(undefined);

export const ControlActionsProvider = ({ children, fnApiValidatePermissionAction }: ControlActionsProviderProps) => {
	// Inicializar currentPath desde la URL del navegador si está disponible
	const getInitialPath = (): string => {
		if (typeof window !== 'undefined') {
			return window.location.pathname;
		}
		return '';
	};
	
	const [currentPath, setCurrentPath] = useState<string>(getInitialPath());
	const currentModule = useAppLayoutStore(state => state.module);
	const [actions, setActions] = useState<IActions>();
	const [programId, setProgramId] = useState<number>();

	// Efecto para detectar cambios de ruta (incluyendo navegación con React Router)
	useEffect(() => {
		if (typeof window === 'undefined') return;
		
		const checkPathChange = () => {
			const newPath = window.location.pathname;
			setCurrentPath(prevPath => {
				if (prevPath !== newPath) {
					return newPath;
				}
				return prevPath;
			});
		};

		// Escuchar eventos nativos del navegador
		const handlePopState = () => {
			checkPathChange();
		};
		
		const handleHashChange = () => {
			checkPathChange();
		};

		window.addEventListener('popstate', handlePopState);
		window.addEventListener('hashchange', handleHashChange);

		// Verificar cambios de ruta periódicamente para detectar navegación con React Router
		// React Router no dispara popstate/hashchange cuando se navega programáticamente
		const intervalId = setInterval(checkPathChange, 150);

		return () => {
			window.removeEventListener('popstate', handlePopState);
			window.removeEventListener('hashchange', handleHashChange);
			clearInterval(intervalId);
		};
	}, []);

	useEffect(() => {
		if (currentModule) {
			const programActions = getProgramActionsbyPath(currentPath, currentModule);
			if (programActions) {
				setActions(programActions.actions);
				setProgramId(programActions.program.id);
			} else {
				// Limpiar actions y programId cuando no hay programActions para la ruta actual
				setActions(undefined);
				setProgramId(undefined);
			}
		}
	}, [currentPath, currentModule]);

	return (
		<ControlActionsContext.Provider value={{ setCurrentPath, actions, programId, fnApiValidatePermissionAction }}>
			{children}
		</ControlActionsContext.Provider>
	);
};
