import { ReactNode, useCallback, useMemo } from 'react';
import { Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Select } from '@/components/Select';
import { Button } from '../Button';
import { DeleteOutlined } from '@ant-design/icons';
import { ITableDetailsColumn } from '@/interfaces';
import { MoneyInputCell, NumberInputCell, TextInputCell } from './Cells';
import { GetRowKey } from 'antd/es/table/interface';

export interface ITableDetailsProps<T extends object> {
	columns: ITableDetailsColumn<T>[];
	data: T[];
	onDelete: (value: any, record: T, index: number) => void;
	onChangeData?: (params: { record: T; dataIndex: keyof T | string | number; value: any }, index: number) => void;
	rowKey?: string | keyof T | GetRowKey<T>;
	scroll?: {
		x?: string | number | true | undefined;
		y?: string | number | undefined;
	} & {
		scrollToFirstRowOnChange?: boolean | undefined;
	};
	disabledColumnActions?: boolean;
	footer?: ReactNode;
	showHeader?: boolean;
	showActions?: boolean;
	/** Alto fijo del cuerpo de la tabla (ej: 400, '400px', '50vh'). Se aplica con o sin datos. */
	height?: number | string;
	loading?: boolean;
}

export const TableDetails = <T extends object>({
	rowKey,
	columns,
	data,
	onDelete,
	onChangeData,
	scroll,
	disabledColumnActions = false,
	footer,
	showHeader = true,
	showActions = true,
	height,
	loading = false,
}: ITableDetailsProps<T>) => {
	const handleChangeData = useCallback(
		(record: T, dataIndex: keyof T | string | number, value: any, index: number) => {
			const updatedRecord = {
				...record,
				[dataIndex]: value,
			};

			onChangeData?.({
				record: updatedRecord,
				dataIndex,
				value,
			}, index);
		},
		[onChangeData],
	);

	const antColumns = useMemo(
		() =>
			columns.map(column => {
				const width = column.width;
				const minWidth = column.minWidth ?? column.width ?? column.maxWidth ?? 150;
				const maxWidth = column.maxWidth ?? column.width;
				const widthStyle = width ?? column.maxWidth ?? column.minWidth;

				return {
					title: column.title,
					dataIndex: column.dataIndex,
					key: column.key,
					width,
					minWidth,
					maxWidth,
					display: column.display,
					fixed: column.fixed,
					align: column.align || 'left',
					onHeaderCell: () => ({
						style: {
							paddingTop: 6,
							paddingBottom: 6,
							width: widthStyle,
							minWidth,
							maxWidth,
						},
					}),
					onCell: () => {
						const baseStyle = {
							width: widthStyle,
							minWidth,
							maxWidth,
							paddingTop: 2,
							paddingBottom: 2,
						};

						if (column.type === undefined) {
							return {
								style: {
									...baseStyle,
									whiteSpace: 'nowrap',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									wordBreak: 'normal',
									overflowWrap: 'normal',
								},
							};
						}

						return {
							style: {
								...baseStyle,
								whiteSpace: 'normal',
								wordBreak: 'break-word',
								overflowWrap: 'break-word',
							},
						};
					},
					render: (value: any, record: T, index: number) => {

						if (column.render) {
							return column.render(value, record, index);
						}

						const isDisabled =
							typeof column.disabled === 'function' ? column.disabled(record, index, column) : !!column.disabled;

						const errorFromAccessor = column.errorAccessor?.(record, column);
						const errorFromKeyObject = (record as any)?.[(column.errorKey as keyof T) || 'keyObjectError']?.[
							column.dataIndex as string
						] as string | undefined;
						const error = errorFromAccessor ?? errorFromKeyObject;

						if (column.type === 'select') {
							const defaultOptionValue = column.options?.[0]?.value;
							const safeValue = typeof value === 'string' || typeof value === 'number' ? value : undefined;
							const rawDefault =
								safeValue === undefined
									? typeof column.defaultValue === 'function'
										? column.defaultValue(record, index, column)
										: column.defaultValue
									: undefined;
							const resolvedValue = safeValue ?? rawDefault ?? defaultOptionValue;

							return (
								<div className="flex flex-col gap-0.5" style={{ width: '100%', minWidth: 0, display: 'flex' }}>
									<Select
										value={resolvedValue}
										options={column.options || []}
										onChange={val => handleChangeData(record, column.dataIndex, val, index)}
										placeholder="Seleccione una opción"
										style={{ width: '100%' }}
										disabled={isDisabled || disabledColumnActions}
										status={error && column.type === 'select' ? 'error' : undefined}
									/>
									{error && column.type === 'select' && (
										<small className="text-[9px] text-red-500 italic">{error}</small>
									)}
								</div>
							);
						}

						if (column.type === 'text') {
							return (
								<div className="flex flex-col gap-0.5" style={{ width: '100%', minWidth: 0, display: 'flex' }}>
									<TextInputCell
										value={value}
										onCommit={val => handleChangeData(record, column.dataIndex, val, index)}
										disabled={isDisabled || disabledColumnActions}
										status={error ? 'error' : undefined}
										textTransform={column.textTransform}
									/>
									{error && <small className="text-[9px] text-red-500 italic">{error}</small>}
								</div>
							);
						}

						if (column.type === 'number') {
							return (
								<div className="flex flex-col gap-0.5" style={{ width: '100%', minWidth: 0, display: 'flex' }}>
									<NumberInputCell
										value={value}
										onCommit={val => handleChangeData(record, column.dataIndex, val, index)}
										min={0}
										disabled={isDisabled || disabledColumnActions}
										maxDigits={column.maxDigits}
										status={error ? 'error' : undefined}
									/>
									{error && <small className="text-[9px] text-red-500 italic">{error}</small>}
								</div>
							);
						}

						if (column.type === 'percentage') {
							return (
								<div className="flex flex-col gap-0.5" style={{ width: '100%', minWidth: 0, display: 'flex' }}>
									<NumberInputCell
										suffix="%"
										value={value}
										onCommit={val => handleChangeData(record, column.dataIndex, val, index)}
										min={0}
										max={100}
										disabled={isDisabled || disabledColumnActions}
										maxDigits={column.maxDigits}
										status={error ? 'error' : undefined}
									/>
									{error && <small className="text-[9px] text-red-500 italic">{error}</small>}
								</div>
							);
						}

						if (column.type === 'money') {
							return (
								<div className="flex flex-col gap-0.5" style={{ width: '100%', minWidth: 0, display: 'flex' }}>
									<MoneyInputCell
										value={value}
										onCommit={val => handleChangeData(record, column.dataIndex, val, index)}
										min={column.min ?? 0}
										disabled={isDisabled || disabledColumnActions}
										// suffix="USD"
										precision={2}
										prefix="$"
										maxDigits={column.maxDigits}
										status={error ? 'error' : undefined}
									/>
									{error && <small className="text-[9px] text-red-500 italic">{error}</small>}
								</div>
							);
						}

						const canTooltip = typeof value === 'string' || typeof value === 'number';
						const tooltipValue = canTooltip ? String(value) : undefined;

						return (
							<div className="w-full min-w-0">
								<Tooltip title={tooltipValue} placement="topLeft">
									<span className="block truncate">{value}</span>
								</Tooltip>
							</div>
						);
					},
				};
			}) as ColumnsType<T>,
		[columns, handleChangeData],
	);

	const ACTION_COL_WIDTH = 40;

	const handleDelete = useCallback(
		(value: any, record: T, index: number) => {
			onDelete(value, record, index);
		},
		[onDelete],
	);

	const antdWithActions: ColumnsType<T> = useMemo(
		() => [
			...antColumns,
			{
				title: '',
				key: 'actions',
				fixed: 'right' as const,
				width: ACTION_COL_WIDTH,
				align: 'center',
				render: (value: any, record: T, index: number) => {
					return (
						<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
							<Button
								type="secondary"
								size="small"
								onClick={() => handleDelete(value, record, index)}
								loading={false}
								label={<DeleteOutlined />}
							/>
						</div>
					);
				},
				onHeaderCell: () => ({
					style: {
						paddingTop: 4,
						paddingBottom: 4,
						width: ACTION_COL_WIDTH,
					},
				}),
				onCell: () => ({
					style: {
						width: ACTION_COL_WIDTH,
						minWidth: ACTION_COL_WIDTH,
						maxWidth: ACTION_COL_WIDTH,
						textAlign: 'center',
						verticalAlign: 'middle',
						whiteSpace: 'nowrap',
						paddingTop: 0,
						paddingBottom: 0,
					},
				}),
			},
		],
		[antColumns, handleDelete],
	);

	const bodyHeight = height != null ? (typeof height === 'number' ? `${height}px` : height) : undefined;

	const scrollConfig = useMemo(
		() => ({
			y: bodyHeight ?? scroll?.y ?? 'calc(80dvh - 310px)',
			x: scroll?.x ?? 'max-content',
			...(scroll?.scrollToFirstRowOnChange != null && { scrollToFirstRowOnChange: scroll.scrollToFirstRowOnChange }),
		}),
		[bodyHeight, scroll],
	);

	return (
		<div
			className={bodyHeight ? 'itsa-table-details-fixed-height' : undefined}
			style={bodyHeight ? ({ '--itsa-table-body-height': bodyHeight } as React.CSSProperties) : undefined}
		>
			<Table
				columns={disabledColumnActions || !showActions ? antColumns : antdWithActions}
				dataSource={data}
				rowKey={rowKey}
				pagination={false}
				tableLayout="fixed"
				scroll={scrollConfig}
				bordered={true}
				footer={footer ? () => footer : undefined}
				showHeader={showHeader}
				loading={loading}
			/>
		</div>
	);
};
