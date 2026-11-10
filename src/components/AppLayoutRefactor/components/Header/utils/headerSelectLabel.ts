import { createElement } from 'react';
import type { SelectProps } from 'antd';

export const COMPANY_SELECT_LABEL_MAX_LENGTH = 12;
export const MODULE_SELECT_LABEL_MAX_LENGTH = 9;

export const truncateHeaderSelectLabel = (text: string, maxLength: number): string => {
	if (text.length <= maxLength) return text;
	return `${text.slice(0, maxLength)}...`;
};

export const formatSubAgencyHeaderSelectLabel = (agencyName?: string, subAgencyName?: string): string => {
	if (!agencyName || !subAgencyName) return subAgencyName ?? agencyName ?? '';
	return `${agencyName} - ${subAgencyName}`;
};

export const renderTruncatedHeaderSelectLabel: NonNullable<SelectProps['labelRender']> = ({ label }) => {
	const text = String(label ?? '');
	return createElement(
		'span',
		{
			title: text,
			className: 'block max-w-full truncate',
			style: {
				display: 'block',
				maxWidth: '100%',
				overflow: 'hidden',
				textOverflow: 'ellipsis',
				whiteSpace: 'nowrap',
			},
		},
		text,
	);
};
