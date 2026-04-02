import classNames from 'classnames';
import { ReactNode } from 'react';

export interface IModalDetailLayoutProps {
	statusSlot?: ReactNode;
	headerFieldsSlot?: ReactNode;
	metricsSlot?: ReactNode;
	tableTitle?: string;
	tableSlot?: ReactNode;
	summarySlot?: ReactNode;
	className?: string;
	showBorder?: boolean;
	showSeparator?: boolean;
}

export const ModalDetailLayout = ({
	statusSlot,
	headerFieldsSlot,
	metricsSlot,
	tableTitle = 'Detalle',
	tableSlot,
	summarySlot,
	className,
	showBorder = false,
	showSeparator = true,
}: IModalDetailLayoutProps) => {
	const hasHeaderBlock = !!statusSlot || !!headerFieldsSlot;

	return (
		<div
			className={classNames(
				'overflow-hidden rounded-2xl border border-amber-300 bg-white',
				className,
			)}
		>
			<div className="h-1 w-full bg-amber-400" />

			{hasHeaderBlock && (
				<div className="bg-zinc-50/70 px-4 py-4 md:px-5">
					<div className="space-y-4">
						{statusSlot}
						{headerFieldsSlot}
					</div>
				</div>
			)}

			{metricsSlot && (
				<>
					{showSeparator && <div className="h-px w-full bg-zinc-100" />}
					<div className="px-4 py-4 md:px-5">{metricsSlot}</div>
				</>
			)}

			{showSeparator && <div className="h-px w-full bg-zinc-100" />}

			<div className="space-y-4 p-4 md:p-5">
				<section
					className={classNames(
						'overflow-hidden bg-white',
						showBorder && 'rounded-xl border border-zinc-200',
					)}
				>
					<header className="flex items-center gap-2 px-4 py-3">
						<span className="inline-block h-5 w-1.5 rounded-full bg-amber-400" />
						<h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-700">{tableTitle}</h3>
					</header>
					<div className="px-4 py-4">{tableSlot}</div>
				</section>

				{summarySlot && (
					<div className="flex flex-col items-end">
						<div className="w-full overflow-hidden rounded-xl border border-zinc-200 bg-white md:max-w-sm">
							<div className="h-1 w-full bg-amber-400" />
							<div className="px-4 py-4">{summarySlot}</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
