import { ISelectOptionDropdownButton } from '@/interfaces';
import { Button, Dropdown, MenuProps } from 'antd';
import { ReactNode, useCallback, useMemo } from 'react';

export interface IDropdownIconProps {
	options: ISelectOptionDropdownButton;
	onChange: (id: string) => void;
	loading?: boolean;
	icon: ReactNode;
}

export const DropdownIcon = ({ options, loading = false, icon, onChange }: IDropdownIconProps) => {

	const handleMenuClick = useCallback(
		(info: { key: string }) => {
			const selectedItem = options.items.find(item => item.key === info.key);
			if (selectedItem) {
				onChange(selectedItem.key);
			}
		},
		[options, onChange],
	);

	const menuWithHandler: MenuProps = useMemo(() => {
		return {
			items: options.items.map(item => ({
				key: item.key,
				label: item.label,
			})),
			onClick: handleMenuClick,
		};
	}, [options, handleMenuClick]);
	return (
		<Dropdown menu={menuWithHandler} placement="bottomRight"  disabled={!options || loading} trigger={['click', 'hover']}>
			<Button
				type="default"
				className="flex items-center justify-center w-[42px] min-h-[40px] 
                 !bg-white-100 !border-white-100 hover:!bg-white-100 hover:!border-white-100 !shadow-none p-0"
				loading={loading}
			>
				{icon}
			</Button>
		</Dropdown>
	);
};
