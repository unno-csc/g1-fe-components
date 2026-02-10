import { DEFAULT_LABEL } from '@/constants/dropdownCustomLabel';
import { ISelectOptionDropdownButton } from '@/interfaces';
import { Dropdown, MenuProps } from 'antd';
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

export interface DropdownCustomLabelProps {
	emptyLabel: string;
	onChange: (value: string) => void;
	defaultValue?: string;
	options?: ISelectOptionDropdownButton;
	loading?: boolean;
	icon?: ReactNode;
}

export const DropdownCustomLabel = ({
	emptyLabel,
	onChange,
	defaultValue = '',
	options = { items: [] },
	loading = false,
	icon,
}: DropdownCustomLabelProps) => {
	const [valueSelected, setValueSelected] = useState<string>();
	const items = useMemo(() => options?.items ?? [], [options?.items]);

	useEffect(() => {
		setValueSelected(defaultValue);
	}, [defaultValue]);

	const selectedLabel = useMemo(() => {
		if (!loading && items && items.length === 0) {
			return emptyLabel;
		}

		if (!valueSelected) {
			return DEFAULT_LABEL;
		}

		const found = items.find(item => item?.key === valueSelected);
		return found?.label ?? DEFAULT_LABEL;
	}, [emptyLabel, items, loading, valueSelected]);

	const handleMenuClick = useCallback((info: { key: string }) => {
		const selectedItem = items.find(item => item.key === info.key);
		if (selectedItem) {
			setValueSelected(selectedItem.key);
			onChange(selectedItem.key);
		}
	}, [items, onChange]);

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
		<Dropdown.Button
			menu={menuWithHandler}
			placement="bottomRight"
			trigger={['hover']}
			buttonsRender={([left, right]) => [
				React.cloneElement(left as React.ReactElement<{ className?: string; children?: React.ReactNode }>, {
					className:
						'rounded-l-[8px] max-w-[220px] min-h-[40px] truncate !bg-white-100 text-white-100 !border-primary-700 !shadow-none',
					children: (
						<div key=" item-label" className="text-black-100 max-w-[180px] truncate text-ellipsis">
							{selectedLabel}
						</div>
					),
				}),
				React.cloneElement(right as React.ReactElement<{ 'aria-label'?: string; className?: string }>, {
					'aria-label': 'Abrir opciones',
					className:
						'w-[32] min-h-[40px] flex items-center justify-center rounded-r-[8px] !bg-white-100 !border-primary-700 !shadow-none',
				}),
			]}
			icon={icon}
			disabled={loading || !options?.items?.length}
			loading={loading}
		/>
	);
};
