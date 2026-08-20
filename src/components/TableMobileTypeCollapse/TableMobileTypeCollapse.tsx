import { EActionType } from '@/enums';
import { disabledActionButton } from '@/helpers/functions';
import { useControlActions } from '@/hooks';
import { useActionsUser, useAppLayoutStore } from '@/store';
import { ITableColumnAction, TStrictTableColumnsType } from '@/types';
import { LoadingOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Checkbox, Collapse, Empty, Modal, Pagination, Radio, Spin, TablePaginationConfig } from 'antd';
import type { TableProps } from 'antd';
import { useCallback, useState } from 'react';
import type { Key, ReactNode } from 'react';
import { CollapseLabel } from './components/CollapseLabel';
import { DetailRowDataCollapse } from './components/DetailRowDataCollapse';
import { RowActionsDropdown } from './components/RowActionsDropdown';
import { getCellValue } from './utils/getCellValue';

export interface ITableMobileTypeCollapseProps<T extends object> {
	heightMobile?: number | string;
	emptyContent?: ReactNode;
	columns: TStrictTableColumnsType<T>;
	data: T[];
	rowKey?: Extract<keyof T, string> | ((record: T) => Key);
	loading?: boolean;
	showColumnActions?: boolean;
	columnActions?: ITableColumnAction<T>[];
	getActionsDisabled?: (record: T) => boolean;
	getActionsTriggerDisabled?: (record: T) => boolean;
	refreshDataFunction?: () => void;
	showPagination?: boolean;
	paginationConfig?: TablePaginationConfig;
	onChange?: (pagination?: TablePaginationConfig) => void;
	rowSelection?: TableProps<T>['rowSelection'];
	selectionMode?: 'single' | 'multiple';
}

export const TableMobileTypeCollapse = <T extends object>({
	heightMobile,
	emptyContent,
	columns,
	data,
	rowKey,
	loading = false,
	showColumnActions = false,
	columnActions,
	getActionsDisabled,
	getActionsTriggerDisabled,
	refreshDataFunction,
	showPagination = false,
	paginationConfig,
	onChange,
	rowSelection,
	selectionMode = 'multiple',
}: ITableMobileTypeCollapseProps<T>) => {
	const { programId, fnApiValidatePermissionAction } = useControlActions();
	const currentAgency = useAppLayoutStore(state => state.currentAgency);
	const { actionsUser } = useActionsUser();
	const leadingColumns = columns.slice(0, 2);

	const [confirmModalState, setConfirmModalState] = useState<{
		open: boolean;
		action: ITableColumnAction<T> | null;
		record: T | null;
	}>({
		open: false,
		action: null,
		record: null,
	});
	const [internalSelectedRowKeys, setInternalSelectedRowKeys] = useState<Key[]>([]);

	const clickAction = useCallback(
		async (action: ITableColumnAction<T>, record: T) => {
			const isPermitted = disabledActionButton(action.actionType, actionsUser);
			if (isPermitted) return;
			const isDisabled = typeof action.disabled === 'function' ? action.disabled(record) : action.disabled ?? false;
			if (isDisabled) return;

			if (action.confirmDelete) {
				setConfirmModalState({ open: true, action, record });
				return;
			}

			if (action.validateWithApiAction ?? false) {
				const agencyId = currentAgency?.id;
				const actionTypeNumber = action.actionType as EActionType;
				if (actionTypeNumber === undefined || programId === undefined || agencyId === undefined) return;
				const isValid = await fnApiValidatePermissionAction(actionTypeNumber, programId, agencyId);
				if (isValid) {
					action.action(record);
				}
			} else {
				action.action(record);
			}
		},
		[currentAgency, programId, fnApiValidatePermissionAction, actionsUser],
	);

	const handleConfirmAction = async () => {
		const { action, record } = confirmModalState;
		if (!action || !record) return;

		setConfirmModalState({ open: false, action: null, record: null });

		if (action.validateWithApiAction ?? false) {
			const agencyId = currentAgency?.id;
			const actionTypeNumber = action.actionType as EActionType;
			if (programId === undefined || agencyId === undefined) return;
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

	const getConfirmContent = () => {
		if (!confirmModalState.action?.confirmDelete || !confirmModalState.record) return '';
		const { content } = confirmModalState.action.confirmDelete;
		if (typeof content === 'function') {
			return content(confirmModalState.record);
		}
		return content;
	};

	const shouldShowActions =
		!!columnActions && columnActions.length > 0 && (showColumnActions ?? true);

	const getRecordKey = (record: T, rowIndex: number): Key => {
		if (typeof rowKey === 'function') return rowKey(record);
		if (rowKey !== undefined) return (record as Record<string, Key | undefined>)[rowKey] ?? rowIndex;
		return rowIndex;
	};

	const selectedRowKeys =
		(rowSelection?.selectedRowKeys as Key[] | undefined) ?? internalSelectedRowKeys;
	const isSingleSelection = selectionMode === 'single' || rowSelection?.type === 'radio';

	const getSelectedRows = (keys: Key[]) =>
		data.filter((item, index) => keys.includes(getRecordKey(item, index)));

	const handleSelectionChange = (record: T, rowIndex: number, checked: boolean) => {
		if (!rowSelection) return;

		const recordKey = getRecordKey(record, rowIndex);
		const nextSelectedRowKeys = isSingleSelection
			? checked
				? [recordKey]
				: []
			: checked
				? [...selectedRowKeys.filter(key => key !== recordKey), recordKey]
				: selectedRowKeys.filter(key => key !== recordKey);
		const nextSelectedRows = getSelectedRows(nextSelectedRowKeys);

		if (rowSelection.selectedRowKeys === undefined) {
			setInternalSelectedRowKeys(nextSelectedRowKeys);
		}

		rowSelection.onSelect?.(record, checked, nextSelectedRows, undefined as unknown as Event);
		rowSelection.onChange?.(nextSelectedRowKeys, nextSelectedRows, {
			type: isSingleSelection ? 'single' : 'multiple',
		});
	};

	const renderSelectionControl = (record: T, rowIndex: number) => {
		if (!rowSelection) return undefined;

		const recordKey = getRecordKey(record, rowIndex);
		const checked = selectedRowKeys.includes(recordKey);
		const checkboxProps = rowSelection.getCheckboxProps?.(record);
		const disabled = checkboxProps?.disabled;
		const control = isSingleSelection ? (
			<Radio
				{...checkboxProps}
				checked={checked}
				disabled={disabled}
				onChange={event => handleSelectionChange(record, rowIndex, event.target.checked)}
			/>
		) : (
			<Checkbox
				{...checkboxProps}
				checked={checked}
				disabled={disabled}
				onChange={event => handleSelectionChange(record, rowIndex, event.target.checked)}
			/>
		);

		return (
			<div className="shrink-0" onClick={event => event.stopPropagation()}>
				{control}
			</div>
		);
	};

	const pageSize = paginationConfig?.pageSize ?? 10;
	const currentPage = paginationConfig?.current ?? 1;
	const totalItems = paginationConfig?.total ?? data.length;
	const shouldShowPagination = showPagination && totalItems > pageSize;
	const shouldPaginateLocalData = shouldShowPagination && totalItems <= data.length;
	const visibleData = shouldPaginateLocalData
		? data.slice((currentPage - 1) * pageSize, currentPage * pageSize)
		: data;

	const handlePaginationChange = (page: number, size: number) => {
		onChange?.({
			...paginationConfig,
			current: page,
			pageSize: size,
			total: totalItems,
		});
	};

	const content =
		visibleData.length === 0 ? (
			<Empty description={emptyContent ?? 'No hay datos disponibles'} />
		) : (
			<Collapse
				size="small"
				expandIconPosition="end"
				className="itsa-table-mobile-collapse__panel"
				items={visibleData.map((row, rowIndex) => {
					const originalRowIndex = shouldPaginateLocalData ? (currentPage - 1) * pageSize + rowIndex : rowIndex;
					const values = leadingColumns.map(column => getCellValue(column, row, originalRowIndex));

					return {
						key: String(getRecordKey(row, originalRowIndex)),
						label: (
							<CollapseLabel
								title={values[0]}
								value={values[1]}
								selection={renderSelectionControl(row, originalRowIndex)}
								actions={
									shouldShowActions ? (
										<RowActionsDropdown
											record={row}
											columnActions={columnActions}
											onActionClick={clickAction}
											getActionsDisabled={getActionsDisabled}
											getActionsTriggerDisabled={getActionsTriggerDisabled}
										/>
									) : undefined
								}
							/>
						),
						children: <DetailRowDataCollapse columns={columns} row={row} rowIndex={originalRowIndex} />,
					};
				})}
			/>
		);

	return (
		<>
			<div
				className={
					refreshDataFunction
						? 'w-full min-w-0 max-w-full itsa-table-wrapper itsa-table-wrapper--refresh itsa-table-mobile-collapse'
						: 'w-full min-w-0 max-w-full itsa-table-mobile-collapse'
				}
			>
				{refreshDataFunction && (
					<div className="itsa-table-refresh-bar">
						<Button
							style={{ color: 'gray', border: 'none' }}
							type="text"
							onClick={() => refreshDataFunction()}
							className="itsa-table-refresh-button"
						>
							<div className="flex flex-row items-center justify-center gap-1">
								{loading ? <LoadingOutlined spin={loading} style={{ fontSize: 9 }} /> : <ReloadOutlined style={{ fontSize: 12 }} />}
								<span className="text-[11px] leading-none">Refrescar</span>
							</div>
						</Button>
					</div>
				)}
				<Spin spinning={loading}>
					<div
						className="overflow-y-auto overscroll-contain pr-1"
						style={heightMobile !== undefined ? { maxHeight: heightMobile } : undefined}
					>
						{content}
					</div>
				</Spin>
				{shouldShowPagination && (
					<div className="mt-2 flex shrink-0 justify-end border-t border-gray-100 pt-2">
						<Pagination
							{...paginationConfig}
							size="small"
							current={currentPage}
							pageSize={pageSize}
							total={totalItems}
							onChange={handlePaginationChange}
						/>
					</div>
				)}
			</div>

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

/** @deprecated Usar ITableMobileTypeCollapseProps */
export type ITableMobileProps<T extends object> = ITableMobileTypeCollapseProps<T>;
