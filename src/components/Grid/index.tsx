import { Grid as AntGrid } from 'antd';

export type TBreakpoint = 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';

export interface IScreenMap {
	xs?: boolean;
	sm?: boolean;
	md?: boolean;
	lg?: boolean;
	xl?: boolean;
	xxl?: boolean;
}

export type TScreenMap = IScreenMap;

export const useBreakpoint = AntGrid.useBreakpoint;

export const Grid = {
	useBreakpoint: AntGrid.useBreakpoint,
};
