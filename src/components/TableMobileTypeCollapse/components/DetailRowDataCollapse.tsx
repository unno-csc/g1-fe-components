import { getCellValue } from '@/components/TableMobileTypeCollapse/utils/getCellValue';
import { TStrictTableColumnsType } from '@/types';
import type { ReactNode } from 'react';

const DEFAULT_SKIP_LEADING_COLUMNS = 2;

export interface IDetailRowDataCollapseProps<T extends object> {
	columns: TStrictTableColumnsType<T>;
	row: T;
	rowIndex: number;
	/** Columnas ya visibles en el encabezado del collapse (por defecto 2). */
	skipLeadingColumns?: number;
}

const isEmptyValue = (value: ReactNode): boolean => {
	if (value == null || value === false) return true;
	if (typeof value === 'string') return value.trim().length === 0;
	return false;
};

const formatDisplayValue = (value: ReactNode): ReactNode => {
	if (isEmptyValue(value)) {
		return <span className="text-gray-400">—</span>;
	}
	return value;
};

const shouldIncludeDetailColumn = <T extends object>(column: TStrictTableColumnsType<T>[number]) => {
	if (column.key === 'actions' && column.render == null) return false;
	return column.title != null && String(column.title).trim() !== '';
};

export const DetailRowDataCollapse = <T extends object>({
	columns,
	row,
	rowIndex,
	skipLeadingColumns = DEFAULT_SKIP_LEADING_COLUMNS,
}: IDetailRowDataCollapseProps<T>) => {
	const detailColumns = columns.slice(skipLeadingColumns).filter(column => shouldIncludeDetailColumn(column));

	if (detailColumns.length === 0) {
		return <p className="m-0 px-1 py-0.5 text-xs text-gray-400">Sin datos adicionales</p>;
	}

	return (
		<dl className="m-0 flex flex-col divide-y divide-gray-200 bg-white-100">
			{detailColumns.map(column => {
				const label = column.title as ReactNode;
				const value = formatDisplayValue(getCellValue(column, row, rowIndex));

				return (
					<div key={String(column.key)} className="flex flex-col gap-0 bg-white-100 px-2 py-1.5">
						<dt className="m-0 text-[10px] font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
						<dd className="m-0 text-xs leading-snug text-gray-900 break-words">{value}</dd>
					</div>
				);
			})}
		</dl>
	);
};
