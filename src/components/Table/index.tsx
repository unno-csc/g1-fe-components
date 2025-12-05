import { DEFAULT_PAGINATION_CONFIG, TABLE_SCROLL } from '@/constants';
import { EActionType } from '@/enums';
import { disabledActionButton } from '@/helpers/functions';
import { useControlActions } from '@/hooks';
import { useAppLayoutStore } from '@/store';
import { ITableColumnAction, TStrictColumnType, TStrictTableColumnsType } from '@/types';
import { MoreOutlined } from '@ant-design/icons';
import { Table as AntTable, TableProps as AntTableProps, Button, Dropdown, TablePaginationConfig, Modal } from 'antd';
import { ColumnsType, SorterResult, TableLocale, FilterValue } from 'antd/es/table/interface';
import { useState } from 'react';
import type { TableProps as RcTableProps } from 'rc-table';
export interface ITableProps<T extends object> {
	columns: TStrictTableColumnsType<T>;
	data: T[];
	rowKey: Extract<keyof T, string> | ((record: T) => React.Key);
	loading: boolean;
	onChange: (pagination?: TablePaginationConfig, filters?: Record<string, FilterValue | null>, sorter?: SorterResult<T> | SorterResult<T>[]) => void;
	bordered?: boolean;
	rowSelection?: AntTableProps<T>['rowSelection'];
	showPagination?: boolean;
	paginationConfig?: TablePaginationConfig;
	scroll?: RcTableProps<T>['scroll'] & {
		scrollToFirstRowOnChange?: boolean;
	};
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

	const tableRootClassName = ['itsa-table--head-rounded', rootClassName].filter(Boolean).join(' ');

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
				width: 64,
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

	// Calcular el scroll final asegurando que tenga 'x' cuando hay columnas fijas
	const getFinalScroll = () => {
		const columnsWithFixed = finalColumns().some(col => col.fixed === 'left' || col.fixed === 'right');

		if (!columnsWithFixed) {
			return scroll;
		}

		// Si hay columnas fijas, asegurar que scroll.x esté definido y sea un valor válido
		if (scroll && typeof scroll === 'object' && 'x' in scroll && scroll.x !== undefined && scroll.x !== null) {
			return scroll;
		}

		// Calcular el ancho total de las columnas o usar el valor por defecto
		const totalWidth = finalColumns().reduce((sum, col) => {
			const width = typeof col.width === 'number' ? col.width : 0;
			return sum + width;
		}, 0);

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

	const handleChange = (pagination?: TablePaginationConfig, filters?: Record<string, FilterValue | null>, sorter?: SorterResult<T> | SorterResult<T>[]) => {
		console.log('pagination =>', pagination);
		console.log('filters =>', filters);
		console.log('sorter =>', sorter);
		onChange(pagination, filters, sorter);
	};

	return (
		<>
			<AntTable<T>
				columns={finalColumns() as ColumnsType<T>}
				dataSource={data}
				loading={loading}
				bordered={bordered}
				rowSelection={rowSelection ? { type: 'checkbox', ...rowSelection } : undefined}
				onChange={handleChange}
				pagination={finalPagination}
				scroll={getFinalScroll()}
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
										height: '40px',
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
									fontSize: '14px',
									height: '45px',
								}}
							/>
						),
					},
				}}
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
