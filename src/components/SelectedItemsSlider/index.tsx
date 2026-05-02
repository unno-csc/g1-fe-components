import { type KeyboardEvent, type ReactNode, useEffect, useState } from 'react';
import { AppstoreOutlined, CloseOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import classNames from 'classnames';

export type TSelectedItemBadgeVariant = 'info' | 'success' | 'neutral';

export interface ISelectedSliderItem {
	id: string | number;
	eyebrow: string;
	title: string;
	badgeLabel?: string;
	badgeVariant?: TSelectedItemBadgeVariant;
}

export interface ISelectedItemsSliderRenderContext {
	index: number;
	total: number;
}

export interface ISelectedItemsSliderProps {
	items: ISelectedSliderItem[];
	onRemoveItem?: (item: ISelectedSliderItem) => void;
	className?: string;
	title?: string;
	emptyMessage?: string;
	showHeader?: boolean;
	renderItem?: (item: ISelectedSliderItem, context: ISelectedItemsSliderRenderContext) => ReactNode;
}

const badgeVariantClasses: Record<TSelectedItemBadgeVariant, string> = {
	info: 'border-blue-200 bg-blue-50 text-blue-750',
	success: 'border-green-200 bg-green-50 text-green-700',
	neutral: 'border-gray-200 bg-gray-25 text-gray-500',
};

export const SelectedItemsSlider = ({
	items,
	onRemoveItem,
	className,
	title = 'Elementos seleccionados',
	emptyMessage = 'No hay elementos seleccionados',
	showHeader = false,
	renderItem,
}: ISelectedItemsSliderProps) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const currentItem = items.length > 0 ? (items[currentIndex] ?? items[0]) : undefined;
	const canNavigate = items.length > 1;

	useEffect(() => {
		setCurrentIndex(index => Math.min(index, Math.max(items.length - 1, 0)));
	}, [items.length]);

	const handlePrev = () => {
		setCurrentIndex(index => (items.length > 1 ? (index - 1 + items.length) % items.length : index));
	};

	const handleNext = () => {
		setCurrentIndex(index => (items.length > 1 ? (index + 1) % items.length : index));
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
		if (!canNavigate) {
			return;
		}

		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			handlePrev();
		}

		if (event.key === 'ArrowRight') {
			event.preventDefault();
			handleNext();
		}
	};

	return (
		<section
			className={classNames('w-full', className)}
			role={items.length > 0 ? 'region' : undefined}
			aria-label={items.length > 0 ? 'Elementos seleccionados' : undefined}
			tabIndex={items.length > 0 ? 0 : undefined}
			onKeyDown={handleKeyDown}
		>
			{showHeader ? (
				<div className="mb-4">
					<h3 className="text-base font-semibold text-gray-800">
						{title} ({items.length})
					</h3>
				</div>
			) : null}

			{items.length === 0 ? (
				<div className="flex min-h-[184px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-25 px-4 py-8 text-center">
					<div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-yellow-500 bg-white text-yellow-500 shadow-xs">
						<AppstoreOutlined className="text-xl" />
					</div>
					<p className="mb-4 text-sm font-medium text-gray-500">{emptyMessage}</p>
				</div>
			) : currentItem !== undefined ? (
				<div className="mx-auto w-full max-w-xl">
					<article
						key={currentItem.id}
						className="relative min-h-[92px] w-full rounded-xl border border-gray-200 border-t-4 border-t-yellow-500 bg-white px-4 py-2 shadow-sm transition duration-200 hover:shadow-lg"
					>
						<span className="absolute left-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 text-xs font-semibold text-gray-800 shadow-xs">
							{currentIndex + 1}
						</span>
						<button
							type="button"
							aria-label={`Quitar elemento ${currentItem.title}`}
							onClick={() => onRemoveItem?.(currentItem)}
							className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-350 shadow-xs transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
							disabled={!onRemoveItem}
						>
							<CloseOutlined className="text-[10px]" />
						</button>

						{renderItem !== undefined ? (
							<div className="pl-9 pr-7">{renderItem(currentItem, { index: currentIndex, total: items.length })}</div>
						) : (
							<>
								<p
									className="mb-1 max-w-[calc(100%-4.5rem)] truncate pl-9 text-xs font-medium uppercase text-gray-400"
									title={currentItem.eyebrow}
								>
									{currentItem.eyebrow}
								</p>
								<h4
									className="mb-3 truncate pr-32 text-sm font-semibold leading-5 text-gray-800"
									title={currentItem.title}
								>
									{currentItem.title}
								</h4>
								{currentItem.badgeLabel !== undefined ? (
									<span
										className={classNames(
											'absolute right-3 top-12 inline-flex max-w-[120px] items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold',
											badgeVariantClasses[currentItem.badgeVariant ?? 'neutral'],
										)}
										title={currentItem.badgeLabel}
									>
										{currentItem.badgeLabel}
									</span>
								) : null}
							</>
						)}
					</article>

					<div className="mt-2 flex items-center justify-center gap-2" aria-live="polite">
						<button
							type="button"
							aria-label="Elemento anterior"
							onClick={handlePrev}
							disabled={!canNavigate}
							className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition duration-200 hover:border-yellow-500 hover:bg-gray-50 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
						>
							<LeftOutlined className="text-xs" />
						</button>
						<span className="flex h-8 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-400 shadow-xs">
							{currentIndex + 1} / {items.length}
						</span>
						<button
							type="button"
							aria-label="Elemento siguiente"
							onClick={handleNext}
							disabled={!canNavigate}
							className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition duration-200 hover:border-yellow-500 hover:bg-gray-50 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
						>
							<RightOutlined className="text-xs" />
						</button>
					</div>
				</div>
			) : null}
		</section>
	);
};
