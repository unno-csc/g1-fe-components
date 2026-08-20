
import { disabledActionButton } from '@/helpers/functions';
import { useActionsUser } from '@/store';
import { ITableColumnAction } from '@/types';
import { InfoCircleOutlined, MoreOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import { useCallback } from 'react';

export interface IRowActionsDropdownProps<T extends object> {
	record: T;
	columnActions?: ITableColumnAction<T>[];
	onActionClick: (action: ITableColumnAction<T>, record: T) => void;
	getActionsDisabled?: (record: T) => boolean;
	getActionsTriggerDisabled?: (record: T) => boolean;
}

export const RowActionsDropdown = <T extends object>({
	record,
	columnActions,
	onActionClick,
	getActionsDisabled,
	getActionsTriggerDisabled,
}: IRowActionsDropdownProps<T>) => {
	const { actionsUser } = useActionsUser();

	const itemsDropdown = useCallback(() => {
		const resultActionsItems = (columnActions || [])
			.filter(action => {
				const isDisabled = disabledActionButton(action.actionType, actionsUser);
				if (isDisabled === true) {
					return false;
				}
				const actionDisabled =
					typeof action.disabled === 'function' ? action.disabled(record) : action.disabled ?? false;
				return !actionDisabled;
			})
			.map((action, index) => ({
				label: action.title,
				key: action.key || `action-${index}`,
				icon: typeof action.icon === 'function' ? action.icon(record) : action.icon,
				onClick: () => onActionClick(action, record),
				danger: action.danger,
			}));

		if (resultActionsItems.length > 0) {
			return resultActionsItems;
		}

		return [
			{
				label: 'Sin acciones disponibles',
				key: 'no-actions',
				icon: <InfoCircleOutlined />,
				onClick: () => {},
				danger: false,
				disabled: true,
			},
		];
	}, [columnActions, actionsUser, onActionClick, record]);

	if (!columnActions || columnActions.length === 0) {
		return null;
	}

	return (
		<Dropdown
			disabled={getActionsDisabled?.(record) ?? false}
			placement="bottomRight"
			menu={{ items: itemsDropdown() }}
			trigger={['click']}
		>
			<Button
				type="text"
				shape="round"
				size="small"
				disabled={(getActionsDisabled?.(record) ?? false) || (getActionsTriggerDisabled?.(record) ?? false)}
				onClick={e => e.stopPropagation()}
			>
				<MoreOutlined style={{ fontSize: 20 }} rotate={90} />
			</Button>
		</Dropdown>
	);
};
