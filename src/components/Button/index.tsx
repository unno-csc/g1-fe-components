import { useControlActions } from '@/hooks';
import { ButtonAntd } from '../ButtonAntd';
import { ReactNode } from 'react';
import { EActionType } from '@/enums';
import { isDisabledAction } from '@/helpers/functions';
import { useAppLayoutStore, useUserActionPermissions } from '@/store';
import { useOnlineStatus } from '@/hooks/useOnlineStatus/useOnlineStatus';

export interface IButtonProps {
	size?: 'small' | 'middle' | 'large';
	type?: 'primary' | 'secondary' | 'submit' | 'text';
	htmlType?: 'button' | 'submit' | 'reset';
	label?: ReactNode;
	disabled?: boolean;
	onClick?: () => void;
	default?: boolean;
	width?: number;
	block?: boolean;
	shape?: 'default' | 'round' | 'circle' | undefined;
	actionType?: EActionType;
	validateWithApiAction?: boolean;
	showBtnDisabled?: boolean;
	loading?: boolean;
	allowEnterKey?: boolean;
}

export const Button = (props: IButtonProps) => {
	const isOnline = useOnlineStatus();
	const currentAgency = useAppLayoutStore(state => state.currentAgency);
	const { programId, fnApiValidatePermissionAction } = useControlActions();
	const { userActionPermissions } = useUserActionPermissions();
	// const { width, block = false, actionType, validateWithApiAction = false, showBtnDisabled, loading = false } = props;
	const { width, block = false, actionType, validateWithApiAction = false, loading = false } = props;
	const { size = 'middle', type = 'primary', htmlType, label, disabled = false, onClick, allowEnterKey = false } = props;
	const isDisabledByState = disabled === true || isOnline === false;
	const sizeClass = size === 'small' ? 'itsa-btn--sm' : size === 'middle' ? 'itsa-btn--md' : 'itsa-btn--lg';
	const variantClass = type === 'primary' ? 'itsa-btn--primary' : 'itsa-btn--secondary';
	const defaultSecondaryClass = type === 'secondary' && props.default ? 'itsa-btn--default' : '';
	const className = ['itsa-btn', sizeClass, variantClass, defaultSecondaryClass].filter(Boolean).join(' ');
	const antdType: 'primary' | 'default' = type === 'primary' ? 'primary' : 'default';

	const disabledClass = isDisabledByState ? [className, 'itsa-btn--disabled', 'rounded-[12px]'].join(' ') : '';

	const labelContent = <span className="block w-full overflow-hidden text-ellipsis whitespace-nowrap">{label}</span>;

	const isActionForbidden = actionType ? isDisabledAction(userActionPermissions, actionType) : false;
	const isDisabledActionButton = isDisabledByState || isActionForbidden;

	const handleClick = async () => {
		const agencyId = currentAgency?.id;
		if (validateWithApiAction && programId && agencyId && actionType) {
			const isValid = await fnApiValidatePermissionAction(actionType, programId, agencyId);
			if (isValid) {
				onClick?.();
				return;
			}
		} else {
			onClick?.();
		}
	};
	const appliedClassName = isDisabledActionButton === true ? disabledClass : className;

	// if (actionType) {
	// 	if (isOnline === true) {
	// 		if (showBtnDisabled !== true && isActionForbidden) {
	// 			return null;
	// 		}
	// 	}
	// }

	return (
		<ButtonAntd
			className={appliedClassName}
			size={size}
			type={antdType}
			htmlType={htmlType}
			disabled={isDisabledActionButton}
			onClick={handleClick}
			onKeyDown={e => {
				if (!allowEnterKey && e.key === 'Enter') {
					e.preventDefault();
					e.stopPropagation();
				}
			}}
			block={block}
			style={{ width: block ? '100%' : width ? `${width}%` : undefined }}
			loading={loading}
		>
			{labelContent}
		</ButtonAntd>
	);
};
