import { ITableColumnAction, TStrictColumnType, TStrictTableColumnsType } from '@/types';
import type { ReactNode } from 'react';

const BORDER = '1px solid #e5e7eb';
const COLUMN_WIDTH_PERCENT = 30;

export interface ITableMobileCell {
	label: string;
	value: ReactNode;
}

export interface ITableMobileRow {
	id: string | number;
	cells: ITableMobileCell[];
}

export interface ITableMobileProps<T extends object> {
	emptyContent?: ReactNode;
	columnActions?: ITableColumnAction<T>[];
	columns: TStrictTableColumnsType<T>;
	data: T[];
}

const getCellValue = <T extends object>(
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

export const TableMobile = <T extends object>({ emptyContent, columns, data }: ITableMobileProps<T>) => {
	if (data.length === 0) {
		return emptyContent ?? null;
	}

	const tableWidthPercent = columns.length * COLUMN_WIDTH_PERCENT;
	const columnWidthOnTablePercent = 100 / columns.length;

	return (
		<div className="w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain rounded-xl border border-gray-200">
			<table
				className="table-fixed border-separate border-spacing-0"
				style={{ width: `${tableWidthPercent}%` }}
			>
				<colgroup>
					{columns.map(column => (
						<col key={String(column.key)} style={{ width: `${columnWidthOnTablePercent}%` }} />
					))}
				</colgroup>
				<thead>
					<tr>
						{columns.map((column, colIndex) => (
							<th
								key={String(column.key)}
								className="bg-gray-100 p-0 align-middle text-center text-xs font-normal text-gray-900"
								style={{
									borderBottom: BORDER,
									borderRight: colIndex === columns.length - 1 ? 'none' : BORDER,
								}}
							>
								<div className="break-words px-1 py-1 flex items-center justify-center">
									<strong className="text-[9px] leading-tight">{column.title as string}</strong>
								</div>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map((row, rowIndex) => (
						<tr key={rowIndex}>
							{columns.map((column, colIndex) => (
								<td
									key={String(column.key)}
									className="bg-white-100 p-1 align-middle text-xs text-gray-800 text-center"
									style={{
										borderRight: colIndex === columns.length - 1 ? 'none' : BORDER,
										borderBottom: rowIndex === data.length - 1 ? 'none' : BORDER,
									}}
								>
									<div className="break-words px-0.5">{getCellValue(column, row, rowIndex)}</div>
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
