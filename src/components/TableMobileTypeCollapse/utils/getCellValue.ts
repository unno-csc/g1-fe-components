import { TStrictColumnType } from '@/types';
import type { ReactNode } from 'react';

export const getCellValue = <T extends object>(
	column: TStrictColumnType<T>,
	record: T,
	rowIndex: number,
): ReactNode => {
	const dataIndex = column.dataIndex ?? column.key;
	const value =
		typeof dataIndex === 'string' || typeof dataIndex === 'number'
			? (record[dataIndex as keyof T] as ReactNode)
			: undefined;

	if (column.render) {
		return column.render(value, record, rowIndex) as ReactNode;
	}

	return value ?? null;
};
