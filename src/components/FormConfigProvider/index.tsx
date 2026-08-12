import { createContext, useContext, ReactNode } from 'react';

export interface IFormConfigContextProps {
	showDirtyState?: boolean;
}

const FormConfigContext = createContext<IFormConfigContextProps>({
	showDirtyState: false,
});

export const useFormConfig = () => useContext(FormConfigContext);

export interface IFormConfigProviderProps extends IFormConfigContextProps {
	children: ReactNode;
}

export const FormConfigProvider = ({ children, showDirtyState = false }: IFormConfigProviderProps) => {
	return (
		<FormConfigContext.Provider value={{ showDirtyState }}>
			{children}
		</FormConfigContext.Provider>
	);
};
