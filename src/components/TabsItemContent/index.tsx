import { TABS_ITEM_CONTENT_WIDTH } from '@/constants';
import { ReactNode } from 'react';
import classNames from 'classnames';

export interface ITabsItemContent {
	children: ReactNode;
	title?: string;
	width?: string;
	className?: string;
	containerClassName?: string;
	titleClassName?: string;
}

export const TabsItemContent = ({ 
	children, 
	title, 
	width = TABS_ITEM_CONTENT_WIDTH,
	className,
	containerClassName,
	titleClassName
}: ITabsItemContent) => {
	const customStyle = { '--tab-width': width } as React.CSSProperties;

	return (
		<div className={classNames("flex-1 min-w-0 w-full h-full flex justify-center items-center", containerClassName)}>
			<div className="w-full sm:max-w-[var(--tab-width)]" style={customStyle}>
				{title && <div className={classNames("font-semibold mb-2", titleClassName)}>{title}</div>}
				<div className={classNames("flex flex-col justify-center items-center w-full sm:w-[var(--tab-width)] h-full rounded-lg bg-gray-250 min-w-0", className)}>
					{children}
				</div>
			</div>
		</div>
	);
};
