import React from 'react';
import * as Icons from '@/assets/icons';
import { AppstoreOutlined } from '@ant-design/icons';

export type IconName = keyof typeof Icons;

export interface IGetIconOptions {
	className?: string;
	style?: React.CSSProperties;
	/**
	 * Tamaño del icono. Acepta número (px) o cualquier valor CSS válido (por ejemplo, '1.25rem').
	 */
	size?: number | string;
}
export type GetIconOptions = IGetIconOptions;

export const getIconByName = (name: string | null | undefined, options: IGetIconOptions = {}) => {
	const { className, style, size } = options;
	const iconsMap = Icons as unknown as Record<string, React.ComponentType<any>>;
	const IconComponent = name ? iconsMap[name] : undefined;

	const normalizeSize = (value?: number | string) => {
		if (value === undefined || value === null) return undefined;
		return typeof value === 'number' ? `${value}px` : value;
	};

	const wrapperStyle: React.CSSProperties = {
		lineHeight: 1,
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontSize: normalizeSize(size),
		...style,
	};

	return (
		<span className={className} style={wrapperStyle}>
			{IconComponent ? <IconComponent /> : <AppstoreOutlined />}
		</span>
	);
};

export const resolveIconComponent = (name: string | null | undefined): React.ComponentType<any> | null => {
	const iconsMap = Icons as unknown as Record<string, React.ComponentType<any>>;
	return name ? iconsMap[name] ?? null : null;
};



