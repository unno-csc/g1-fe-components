import { Tabs } from 'antd';
import { ITabsMaintenanceItem } from '@/interfaces';

export interface ITabsMaintenance {
	items: ITabsMaintenanceItem[];
	onChange: (key: string) => void;
	defaultActiveKey: string;
	activeKey?: string;
	centered?: boolean;
}

export const TabsMaintenance = ({ items, onChange, defaultActiveKey, activeKey, centered = true }: ITabsMaintenance) => {
	return (
		<Tabs
			className="tabs-maintenance"
			centered={centered}
			defaultActiveKey={defaultActiveKey}
			items={items}
			onChange={onChange}
			activeKey={activeKey}
		/>
	);
};
