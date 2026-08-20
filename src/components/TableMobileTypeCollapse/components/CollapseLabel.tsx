import { ReactNode } from 'react';

export interface ICollapseLabelProps {
	title?: ReactNode;
	value?: ReactNode;
	selection?: ReactNode;
	actions?: ReactNode;
}

export const CollapseLabel = ({ title, value, selection, actions }: ICollapseLabelProps) => {
	return (
		<div className="flex w-full min-w-0 items-center gap-2 pr-1 text-left text-xs">
			{selection != null && (
				<div className="shrink-0" onClick={e => e.stopPropagation()}>
					{selection}
				</div>
			)}
			<div className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
				<span className="truncate font-semibold text-gray-900">{title}</span>
				{value != null && <span className="shrink-0 text-gray-500">{value}</span>}
			</div>
			{actions != null && (
				<div className="ml-auto shrink-0" onClick={e => e.stopPropagation()}>
					{actions}
				</div>
			)}
		</div>
	);
};
