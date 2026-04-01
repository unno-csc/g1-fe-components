import { ReactNode } from 'react';

export interface IModalFieldProps {
	label: string;
	value?: ReactNode;
	fallback?: string;
}

export const ModalField = ({ label, value, fallback = 'No registrado' }: IModalFieldProps) => {
	const resolvedValue = value === undefined || value === null || value === '' ? fallback : value;

	return (
		<div>
			<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">{label}</p>
			<p className="mt-1 text-sm font-semibold text-zinc-800">{resolvedValue}</p>
		</div>
	);
};
