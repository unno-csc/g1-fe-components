import type { ReactNode } from 'react';

export interface IReadOnlyFieldProps {
	label: ReactNode;
	value?: ReactNode;
	placeholder?: ReactNode;
	emphasize?: boolean;
	dashed?: boolean;
	className?: string;
}

export const ReadOnlyField = ({
	label,
	value,
	placeholder = '-',
	emphasize = false,
	dashed = false,
	className = '',
}: IReadOnlyFieldProps) => {
	const hasValue = value !== undefined && value !== null && String(value) !== '';

	return (
		<div
			className={`flex flex-col gap-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 ${
				dashed ? 'border-dashed' : ''
			} ${className}`}
		>
			<span className="text-xs font-medium uppercase tracking-[0.08em] text-gray-500">{label}</span>

			<span className={`text-sm ${emphasize ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
				{hasValue ? value : placeholder}
			</span>
		</div>
	);
};
