import { DEFAULT_PAGINATION_CONFIG, TABLE_SCROLL } from '@/constants';
import { EActionType } from '@/enums';
import { disabledActionButton, parseSorter } from '@/helpers/functions';
import { useControlActions } from '@/hooks';
import { useAppLayoutStore } from '@/store';
import { ITableColumnAction, TStrictColumnType, TStrictTableColumnsType } from '@/types';
import { MoreOutlined } from '@ant-design/icons';
import { Table as AntTable, TableProps as AntTableProps, Button, Dropdown, TablePaginationConfig, Modal } from 'antd';
import { ColumnsType, FilterValue, SorterResult, TableCurrentDataSource, TableLocale } from 'antd/es/table/interface';
import { MouseEvent, useState } from 'react';
import type { TableProps as RcTableProps } from 'rc-table';
import { ISorterTable } from '@/interfaces';

const DEFAULT_COLUMN_MIN_WIDTH = 140;
const ACTIONS_COLUMN_WIDTH = 64;
export interface ITableProps<T extends object> {
	columns: TStrictTableColumnsType<T>;
	data: T[];
	rowKey: Extract<keyof T, string> | ((record: T) => React.Key);
	loading: boolean;
	onChange: (
		pagination?: TablePaginationConfig,
		sorter?: ISorterTable,
		filters?: Record<string, FilterValue | null>,
		extra?: TableCurrentDataSource<T>,
	) => void;
	bordered?: boolean;
	rowSelection?: AntTableProps<T>['rowSelection'];
	showPagination?: boolean;
	paginationConfig?: TablePaginationConfig;
	scroll?: RcTableProps<T>['scroll'] & {
		scrollToFirstRowOnChange?: boolean;
	};
	/** Controla si la selección debe ser única (radio) o múltiple (checkbox). */
	selectionMode?: 'single' | 'multiple';
	showColumnActions?: boolean;
	columnActions?: ITableColumnAction<T>[];
	getActionsDisabled?: (record: T) => boolean;
	getActionsTriggerDisabled?: (record: T) => boolean;
	className?: string;
	rootClassName?: string;
	rowClassName?: AntTableProps<T>['rowClassName'];
	locale?: TableLocale;
	rowHoverable?: boolean;
}

export const Table = <T extends object>({
	columns,
	data,
	rowKey,
	loading,
	onChange,
	bordered = false,
	rowSelection,
	selectionMode = 'multiple',
	showPagination = false,
	paginationConfig = DEFAULT_PAGINATION_CONFIG,
	scroll = TABLE_SCROLL,
	showColumnActions = false,
	columnActions,
	getActionsDisabled,
	getActionsTriggerDisabled,
	rootClassName,
	locale = {
		emptyText: 'No hay datos',
	},
	rowHoverable = true,
}: ITableProps<T>) => {
	const { programId, actions, fnApiValidatePermissionAction } = useControlActions();
	const currentAgency = useAppLayoutStore(state => state.currentAgency);
	const finalPagination = showPagination ? paginationConfig : false;

	const selectionClass = rowSelection
		? selectionMode === 'single'
			? 'itsa-radio--default'
			: 'itsa-checkbox--default'
		: null;

	const tableRootClassName = ['itsa-table--head-rounded', 'itsa-table-min-h-responsive', selectionClass, rootClassName]
		.filter(Boolean)
		.join(' ');

	const [confirmModalState, setConfirmModalState] = useState<{
		open: boolean;
		action: ITableColumnAction<T> | null;
		record: T | null;
	}>({
		open: false,
		action: null,
		record: null,
	});

	const clickAction = async (action: ITableColumnAction<T>, record: T) => {
		const isPermitted = disabledActionButton(action.actionType, actions);
		if (isPermitted) return;
		const isDisabled = typeof action.disabled === 'function' ? action.disabled(record) : !!action.disabled;
		if (isDisabled) return;
		if (action.confirmDelete) {
			setConfirmModalState({
				open: true,
				action,
				record,
			});
			return;
		}

		if (action.validateWithApiAction) {
			const agencyId = currentAgency?.id;
			const actionTypeNumber = action.actionType as EActionType;
			if (!actionTypeNumber || !programId || !agencyId) return;
			const isValid = await fnApiValidatePermissionAction(actionTypeNumber, programId, agencyId);
			if (isValid) {
				action.action(record);
			}
		} else {
			action.action(record);
		}
	};

	const handleConfirmAction = async () => {
		const { action, record } = confirmModalState;
		if (!action || !record) return;

		setConfirmModalState({ open: false, action: null, record: null });

		if (action.validateWithApiAction) {
			const agencyId = currentAgency?.id;
			const actionTypeNumber = action.actionType as EActionType;
			if (!actionTypeNumber || !programId || !agencyId) return;
			const isValid = await fnApiValidatePermissionAction(actionTypeNumber, programId, agencyId);
			if (isValid) {
				action.action(record);
			}
		} else {
			action.action(record);
		}
	};

	const handleCancelConfirm = () => {
		setConfirmModalState({ open: false, action: null, record: null });
	};

	const finalColumns = (): TStrictTableColumnsType<T> => {
		if (showColumnActions) {
			const actionsColumn: TStrictColumnType<T> = {
				title: '',
				key: 'actions',
				width: ACTIONS_COLUMN_WIDTH,
				align: 'center',
				fixed: 'right',
				render: (record: T) => (
					<Dropdown
						disabled={!!getActionsDisabled?.(record)}
						placement="bottomRight"
						menu={{
							items: (columnActions || [])
								.filter(action => {
									const hasPermission = disabledActionButton(action.actionType, actions);
									const actionDisabled =
										typeof action.disabled === 'function' ? action.disabled(record) : !!action.disabled;
									return !hasPermission && !actionDisabled;
								})
								.map((action, index) => ({
									label: action.title,
									key: action.key || `action-${index}`,
									icon: action.icon,
									onClick: () => clickAction(action, record),
									danger: action.danger,
								})),
						}}
					>
						<Button
							type="text"
							shape="round"
							size="small"
							className="w-full"
							disabled={!!getActionsDisabled?.(record) || !!getActionsTriggerDisabled?.(record)}
						>
							<MoreOutlined style={{ fontSize: 24 }} rotate={90} />
						</Button>
					</Dropdown>
				),
			};
			return [...columns, actionsColumn];
		}
		return columns;
	};

	const getColumnsTotalWidth = (tableColumns: TStrictTableColumnsType<T>) =>
		tableColumns.reduce((sum, col) => {
			if (typeof col.width === 'number') return sum + col.width;
			if (col.key === 'actions') return sum + ACTIONS_COLUMN_WIDTH;
			return sum + DEFAULT_COLUMN_MIN_WIDTH;
		}, 0);

	// Calcular el scroll final asegurando que tenga 'x' cuando hay columnas fijas
	const getFinalScroll = (tableColumns: TStrictTableColumnsType<T>) => {
		const columnsWithFixed = tableColumns.some(col => col.fixed === 'left' || col.fixed === 'right');
		const shouldForceScrollX = columnsWithFixed || showColumnActions;

		if (!shouldForceScrollX) {
			return scroll;
		}

		// Si hay columnas fijas, asegurar que scroll.x esté definido y sea un valor válido
		if (scroll && typeof scroll === 'object' && 'x' in scroll && scroll.x !== undefined && scroll.x !== null) {
			return scroll;
		}

		// Calcular el ancho total de las columnas o usar el valor por defecto
		const totalWidth = getColumnsTotalWidth(tableColumns);

		// Si scroll es un objeto, hacer merge; si no, crear uno nuevo con el valor por defecto
		const baseScroll = scroll && typeof scroll === 'object' ? scroll : TABLE_SCROLL;

		return {
			...baseScroll,
			x:
				scroll && typeof scroll === 'object' && scroll.x !== undefined && scroll.x !== null
					? scroll.x
					: totalWidth > 0
						? totalWidth
						: TABLE_SCROLL.x,
		};
	};

	const getConfirmContent = () => {
		if (!confirmModalState.action?.confirmDelete || !confirmModalState.record) return '';
		const { content } = confirmModalState.action.confirmDelete;
		if (typeof content === 'function') {
			return content(confirmModalState.record);
		}
		return content;
	};

	const handleChangePagination = (
		pagination: TablePaginationConfig,
		filters: Record<string, FilterValue | null>,
		sorter: SorterResult<T> | SorterResult<T>[],
		extra: TableCurrentDataSource<T>,
	) => {
		if (Array.isArray(sorter)) {
			return;
		}
		const sorterParsed: ISorterTable = parseSorter(sorter);
		onChange(pagination, sorterParsed, filters, extra);
	};

	const tableColumns = finalColumns();

	const getRowSelection = (): AntTableProps<T>['rowSelection'] => {
		if (!rowSelection) return undefined;

		const isSingleSelection = selectionMode === 'single';

		const lastSingleSelectionKey =
			isSingleSelection &&
			Array.isArray(rowSelection.selectedRowKeys) &&
			rowSelection.selectedRowKeys.length > 0
				? rowSelection.selectedRowKeys[rowSelection.selectedRowKeys.length - 1]
				: undefined;

		const sanitizedSelectedRowKeys =
			isSingleSelection && lastSingleSelectionKey !== undefined
				? [lastSingleSelectionKey]
				: rowSelection.selectedRowKeys;

		const finalRowSelection: NonNullable<AntTableProps<T>['rowSelection']> = {
			...rowSelection,
			selectedRowKeys: sanitizedSelectedRowKeys,
			type: isSingleSelection ? 'radio' : rowSelection.type ?? 'checkbox',
		};

		if (isSingleSelection && rowSelection.onChange) {
			const originalOnChange = rowSelection.onChange;
			finalRowSelection.onChange = (selectedRowKeys, selectedRows, info) => {
				const lastKey = selectedRowKeys[selectedRowKeys.length - 1];
				const lastRow = selectedRows[selectedRows.length - 1];

				if (lastKey === undefined || !lastRow) {
					originalOnChange([], [], info);
					return;
				}

				originalOnChange([lastKey], [lastRow], info);
			};
		}

		return finalRowSelection;
	};

	const resolvedRowSelection = getRowSelection();

	const getRecordKey = (record: T): React.Key | undefined => {
		if (typeof rowKey === 'function') return rowKey(record);
		return (record as Record<string, React.Key | undefined>)[rowKey];
	};

	const isSelectionControlClick = (event: MouseEvent<HTMLElement>) => {
		const target = event.target as HTMLElement | null;
		if (!target) return false;
		return !!target.closest('.ant-checkbox') || !!target.closest('.ant-radio');
	};

	const handleRowClick = (record: T) => (event: MouseEvent<HTMLElement>) => {
		if (!resolvedRowSelection) return;
		if (isSelectionControlClick(event)) return;

		const recordKey = getRecordKey(record);
		if (recordKey === undefined) return;

		const isSingle = selectionMode === 'single';
		const currentKeys = (resolvedRowSelection.selectedRowKeys as React.Key[] | undefined) ?? [];
		const exists = currentKeys.includes(recordKey);

		let nextKeys: React.Key[];
		if (isSingle) {
			nextKeys = exists ? [] : [recordKey];
		} else {
			nextKeys = exists ? currentKeys.filter(k => k !== recordKey) : [...currentKeys, recordKey];
		}

		const nextRows = data.filter(item => {
			const key = getRecordKey(item);
			return key !== undefined && nextKeys.includes(key);
		});

		resolvedRowSelection.onSelect?.(record, !exists, nextRows, event as unknown as Event);
		resolvedRowSelection.onChange?.(nextKeys, nextRows, { type: isSingle ? 'single' : 'multiple' });
	};

	return (
		<>
			<AntTable<T>
				columns={tableColumns as ColumnsType<T>}
				dataSource={data}
				loading={loading}
				size="small"
				bordered={bordered}
				rowSelection={resolvedRowSelection}
				onChange={handleChangePagination}
				pagination={finalPagination}
				scroll={getFinalScroll(tableColumns)}
				locale={locale}
				rowKey={rowKey}
				rootClassName={tableRootClassName}
				components={{
					header: {
						wrapper: (props: any) => (
							<thead
								{...props}
								style={{
									...props?.style,
									overflow: 'hidden',
									borderTopLeftRadius: 8,
									borderTopRightRadius: 8,
								}}
							/>
						),
						cell: (props: any) => {
							return (
								<th
									{...props}
									style={{
										...props?.style,
										background: '#EEF1F3',
										color: 'black',
										fontSize: '12px',
										height: '42px',
										padding: '4px 8px',
									}}
								/>
							);
						},
					},
					body: {
						cell: (props: any) => (
							<td
								{...props}
								style={{
									...props?.style,
									color: 'black',
									fontSize: '12px',
									height: '30px',
									lineHeight: '18px',
									padding: '4px 8px',
								}}
							/>
						),
					},
				}}
				onRow={record => ({
				onClick: handleRowClick(record),
				})}
				rowHoverable={rowHoverable}
			/>

			{confirmModalState.open && (
				<Modal
					title={confirmModalState.action?.confirmDelete?.title}
					open={confirmModalState.open}
					onOk={handleConfirmAction}
					onCancel={handleCancelConfirm}
					okText={confirmModalState.action?.confirmDelete?.confirmLabel}
					cancelText={confirmModalState.action?.confirmDelete?.cancelLabel}
					okButtonProps={{ danger: confirmModalState.action?.danger }}
					cancelButtonProps={{ danger: true }}
				>
					{getConfirmContent()}
				</Modal>
			)}
		</>
	);
};
