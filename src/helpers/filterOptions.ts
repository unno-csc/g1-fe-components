import type { DefaultOptionType } from 'antd/es/select';

export const filterOptions = (input: string, option?: DefaultOptionType): boolean =>
	String(option?.label ?? '')
		.toLowerCase()
		.includes(input.toLowerCase());
