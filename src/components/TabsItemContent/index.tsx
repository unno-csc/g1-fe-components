import { TABS_ITEM_CONTENT_WIDTH } from '@/constants';
import { ReactNode } from 'react';

export interface ITabsItemContent {
	children: ReactNode;
	title?: string;
	width?: string;
}

export const TabsItemContent = ({ children, title, width = TABS_ITEM_CONTENT_WIDTH }: ITabsItemContent) => {
	const customStyle = { '--tab-width': width } as React.CSSProperties;

	return (
		<div className="flex-1 min-w-0 w-full h-full flex justify-center items-center">
			<div className="w-full sm:max-w-[var(--tab-width)]" style={customStyle}>
				{title && <div className="font-semibold mb-2">{title}</div>}
				<div className="flex flex-col justify-center items-center w-full sm:w-[var(--tab-width)] h-full rounded-lg bg-gray-250 min-w-0">
					{children}
				</div>
			</div>
		</div>
	);
};
