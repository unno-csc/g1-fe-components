import { ReactNode } from 'react';

export interface IEmptyStateBoxProps {
	message: ReactNode;
	className?: string;
}

export const EmptyStateBox = ({ message, className = '' }: IEmptyStateBoxProps) => (
	<div
		className={`text-center py-6 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-400 ${className}`}
	>
		{message}
	</div>
);
