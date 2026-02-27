import { Dropdown, MenuProps } from 'antd';
import { DownOutlined, LoadingOutlined } from '@ant-design/icons';
import { ReactNode, useCallback, useMemo } from 'react';
import { EActionType } from '@/enums';
import { isDisabledAction } from '@/helpers/functions';
import { useAppLayoutStore, useUserActionPermissions } from '@/store';
import { useOnlineStatus } from '@/hooks/useOnlineStatus/useOnlineStatus';
import { useControlActions } from '@/hooks';
import { getDropdownButtonStyles } from './DropdownButton.styles';

export interface IDropdownButtonItem {
	key: string;
	label: string;
	icon?: ReactNode;
	onClick: () => void;
	disabled?: boolean;
}

export interface IDropdownButtonProps {
	label: string;
	items: IDropdownButtonItem[];
	type?: 'primary' | 'secondary';
	size?: 'small' | 'middle' | 'large';
	icon?: ReactNode;
	showDropdownIcon?: boolean;
	trigger?: ('click' | 'hover')[];
	loading?: boolean;
	disabled?: boolean;
	actionType?: EActionType;
	validateWithApiAction?: boolean;
	placement?: 'bottomLeft' | 'bottomCenter' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight';
}

export const DropdownButton = ({
	label,
	items,
	type = 'primary',
	size = 'middle',
	icon,
	showDropdownIcon = true,
	trigger = ['click'],
	loading = false,
	disabled = false,
	actionType,
	validateWithApiAction = false,
	placement = 'bottomLeft',
}: IDropdownButtonProps) => {
	const isOnline = useOnlineStatus();
	const currentAgency = useAppLayoutStore(state => state.currentAgency);
	const { programId, fnApiValidatePermissionAction } = useControlActions();
	const { userActionPermissions } = useUserActionPermissions();

	const isActionForbidden = actionType ? isDisabledAction(userActionPermissions, actionType) : false;
	const isDisabled = disabled || !isOnline || isActionForbidden || loading;

	const sizeClass = size === 'small' ? 'itsa-dropdown-btn--sm' : size === 'large' ? 'itsa-dropdown-btn--lg' : 'itsa-dropdown-btn--md';
	const variantClass = type === 'primary' ? 'itsa-dropdown-btn--primary' : 'itsa-dropdown-btn--secondary';
	const disabledClass = isDisabled ? 'itsa-dropdown-btn--disabled' : '';
	const className = ['itsa-dropdown-btn', sizeClass, variantClass, disabledClass].filter(Boolean).join(' ');

	const handleMenuClick = useCallback(
		async (info: { key: string }) => {
			const selectedItem = items.find(item => item.key === info.key);
			if (!selectedItem || selectedItem.disabled) return;

			const agencyId = currentAgency?.id;
			if (validateWithApiAction && programId && agencyId && actionType) {
				const isValid = await fnApiValidatePermissionAction(actionType, programId, agencyId);
				if (!isValid) return;
			}

			selectedItem.onClick();
		},
		[items, validateWithApiAction, programId, currentAgency, actionType, fnApiValidatePermissionAction],
	);

	const menuProps: MenuProps = useMemo(
		() => ({
			items: items.map(item => ({
				key: item.key,
				label: item.label,
				icon: item.icon,
				disabled: item.disabled,
			})),
			onClick: handleMenuClick,
		}),
		[items, handleMenuClick],
	);

	return (
		<>
			<style>{getDropdownButtonStyles()}</style>
			<Dropdown menu={menuProps} trigger={trigger} placement={placement} disabled={isDisabled}>
				<button className={className} type="button" disabled={isDisabled}>
					{loading && <LoadingOutlined className="itsa-dropdown-btn__icon" spin />}
					{!loading && icon && <span className="itsa-dropdown-btn__icon">{icon}</span>}
					<span className="itsa-dropdown-btn__label">{label}</span>
					{showDropdownIcon && <DownOutlined className="itsa-dropdown-btn__arrow" />}
				</button>
			</Dropdown>
		</>
	);
};
