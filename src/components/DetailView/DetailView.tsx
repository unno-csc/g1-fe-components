import { Empty } from 'antd';
import { useMemo } from 'react';
import { DetailViewProps, FieldConfig } from './schema/types';
import { DetailSection } from './DetailSection';
import { getNestedValue } from '@/helpers/objects';
import { BadgeRenderer } from './renderers/BadgeRenderer';

export const DetailView = <T extends object = object>({
	data,
	schema,
	isLoading = false,
	emptyMessage = 'No hay datos disponibles',
	className = '',
}: DetailViewProps<T>) => {
	const visibleSections = useMemo(() => {
		return schema.sections.filter(section => {
			if (section.condition && !section.condition(data)) {
				return false;
			}
			return true;
		});
	}, [schema.sections, data]);

	if (isLoading) {
		return (
			<div className="flex flex-col gap-0 animate-pulse px-1">
				<div className="flex items-center gap-3 mb-1">
					<div className="h-8 w-28 rounded border-2 border-zinc-200 bg-zinc-100" />
					<div className="h-5 w-14 rounded-full bg-zinc-100" />
				</div>
				<div className="h-3 w-40 bg-zinc-100 rounded mb-4" />
				<div className="h-px w-full bg-zinc-100 mb-5" />
				{Array.from({ length: schema.sections.length || 3 }).map((_, index) => (
					<div key={index} className="mb-5">
						<div className="h-3 w-36 bg-amber-200 rounded mb-1" />
						<div className="h-px w-full bg-amber-100 mb-3" />
						<div className="grid grid-cols-2 gap-x-6 gap-y-3">
							{Array.from({ length: 4 }).map((__, fi) => (
								<div key={fi} className="flex gap-3 py-2 border-b border-zinc-100">
									<div className="h-3 w-16 bg-zinc-100 rounded" />
									<div className="h-3 w-24 bg-zinc-200 rounded" />
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		);
	}

	if (!data) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<Empty description={emptyMessage} />
			</div>
		);
	}

	const containerClassName = ['max-h-[80vh] pb-6 overflow-y-auto px-1', schema.className, className]
		.filter(Boolean)
		.join(' ');

	let displayTitle = schema.title;
	if (schema.title && data) {
		const val = getNestedValue(data, schema.title);
		if (val !== undefined && val !== null) displayTitle = String(val);
	}

	let displayDesc = schema.description;
	if (schema.description && data) {
		const val = getNestedValue(data, schema.description);
		if (val !== undefined && val !== null) displayDesc = String(val);
	}

	const hasHeader = displayTitle || displayDesc || schema.statusBadge;

	let statusSlot = null;
	if (schema.statusBadge && data) {
		const value = getNestedValue(data, schema.statusBadge.key);
		statusSlot = (
			<BadgeRenderer
				value={value}
				data={data as Record<string, unknown>}
				config={{ ...schema.statusBadge, label: '', type: 'badge' } as FieldConfig}
			/>
		);
	}

	return (
		<div className={containerClassName}>
			{hasHeader && (
				<div className="mb-4">
					{(displayTitle || statusSlot) && (
						<div className="flex items-center gap-3 flex-wrap mb-1">
							{displayTitle && (
								<span className="inline-block rounded border-[1px] border-amber-400 bg-amber-50 px-3 py-0.5 text-lg font-semibold tracking-wide text-amber-500">
									{displayTitle}
								</span>
							)}
							{statusSlot}
						</div>
					)}
					{displayDesc && <p className="text-sm text-zinc-400 mt-0.5">{displayDesc}</p>}
				</div>
			)}

			{visibleSections.length === 0 ? (
				<Empty description="No hay secciones para mostrar" />
			) : (
				<div className="flex flex-col">
					{visibleSections.map((section, index) => (
						<DetailSection key={`${section.title}-${index}`} section={section} data={data} />
					))}
				</div>
			)}
		</div>
	);
};
