import { Collapse } from 'antd';
import { useMemo, useState } from 'react';
import classNames from 'classnames';
import { SectionConfig, FieldConfig, ColumnConfig } from './schema/types';
import { getNestedValue } from '@/helpers/objects';
import { TextRenderer } from './renderers/TextRenderer';
import { BadgeRenderer } from './renderers/BadgeRenderer';
import { LinkRenderer } from './renderers/LinkRenderer';
import { DateRenderer } from './renderers/DateRenderer';
import { CurrencyRenderer } from './renderers/CurrencyRenderer';
import { ArrayRenderer } from './renderers/ArrayRenderer';
import { TableRenderer } from './renderers/TableRenderer';
import { GalleryRenderer } from './renderers/GalleryRenderer';
import { CustomRenderer } from './renderers/CustomRenderer';

const { Panel } = Collapse;

const getGridColumns = (columns: ColumnConfig, isFullWidth?: boolean) => {
	if (isFullWidth) return 'grid-cols-1';

	const md = columns?.md || 2;
	const xl = columns?.xl || md;

	const mdMap: Record<number, string> = {
		1: 'md:grid-cols-1',
		2: 'md:grid-cols-2',
		3: 'md:grid-cols-3',
		4: 'md:grid-cols-4',
	};
	const xlMap: Record<number, string> = {
		1: 'xl:grid-cols-1',
		2: 'xl:grid-cols-2',
		3: 'xl:grid-cols-3',
		4: 'xl:grid-cols-4',
	};

	return `grid-cols-1 sm:grid-cols-2 ${mdMap[md] ?? 'md:grid-cols-2'} ${xlMap[xl] ?? 'xl:grid-cols-2'}`;
};

const spanMap: Record<number, string> = {
	2: 'sm:col-span-2',
	3: 'sm:col-span-2 md:col-span-3',
	4: 'sm:col-span-2 md:col-span-4',
};

interface DetailSectionProps<TData = object> {
	section: SectionConfig<TData>;
	data: TData;
}

export const DetailSection = <TData extends object = object>({ section, data }: DetailSectionProps<TData>) => {
	const [collapsed, setCollapsed] = useState(section.defaultCollapsed || false);

	if (section.condition && !section.condition(data)) {
		return null;
	}

	const visibleFields = useMemo(() => {
		return section.fields.filter((field: FieldConfig<TData>) => {
			if (field.condition && !field.condition(data)) {
				return false;
			}
			return true;
		});
	}, [section.fields, data]);

	if (visibleFields.length === 0) {
		return null;
	}

	const columns = section.columns || { xs: 1, md: 2, xl: 2 };
	const gridClass = `grid ${getGridColumns(columns, section.fullWidth)}`;

	const sectionHeader = (
		<div className="flex items-center gap-2 px-2 py-3">
			<span className="inline-block h-5 w-1.5 rounded-full bg-amber-400" />
			<h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-700 my-3">{section.title}</h3>
			{section.extra && <div>{section.extra}</div>}
		</div>
	);

	const fieldsGrid = (
		<div className={classNames(gridClass, section.className)}>
			{visibleFields.map((field: FieldConfig<TData>, index: number) => {
				const value = getNestedValue(data, field.key);

				if (field.hideIfEmpty && (value === null || value === undefined || value === '')) {
					return null;
				}

				const fieldType = field.type || 'text';
				let RendererComponent;

				switch (fieldType) {
					case 'badge':
						RendererComponent = BadgeRenderer;
						break;
					case 'link':
						RendererComponent = LinkRenderer;
						break;
					case 'date':
						RendererComponent = DateRenderer;
						break;
					case 'currency':
						RendererComponent = CurrencyRenderer;
						break;
					case 'array':
						RendererComponent = ArrayRenderer;
						break;
					case 'table':
						RendererComponent = TableRenderer;
						break;
					case 'gallery':
						RendererComponent = GalleryRenderer;
						break;
					case 'custom':
						RendererComponent = CustomRenderer;
						break;
					default:
						RendererComponent = TextRenderer;
				}

				const isBlockField = fieldType === 'table' || fieldType === 'gallery' || fieldType === 'array' || field.layout === 'vertical';
				const flexClass = isBlockField 
					? 'flex flex-col lg:flex-row lg:items-start' 
					: 'flex items-baseline';

				const spanClass = field.span && field.span > 1 && !section.fullWidth ? (spanMap[field.span] ?? '') : '';

				return (
					<div
						key={`${field.key}-${index}`}
						className={classNames('gap-2 py-2 border-b border-zinc-100 mx-5', flexClass, spanClass)}
					>
						{field.label && (
							<span className={classNames(
								"min-w-[80px] shrink-0 text-xs text-zinc-400",
								isBlockField ? "mb-1 lg:mb-0 lg:mt-1.5 lg:w-1/4 xl:w-1/5" : ""
							)}>
								{field.label}
							</span>
						)}
						<span className={classNames(
							"text-sm font-semibold text-zinc-800 break-words min-w-0",
							isBlockField ? "w-full lg:flex-1" : "flex-1"
						)}>
							<RendererComponent value={value} data={data as Record<string, unknown>} config={field as FieldConfig} />
						</span>
					</div>
				);
			})}
		</div>
	);

	if (section.collapsible) {
		return (
			<div className="mb-4">
				<Collapse
					ghost
					activeKey={collapsed ? [] : ['1']}
					onChange={keys => setCollapsed(keys.length === 0)}
					className="border-none p-0 [&_.ant-collapse-header]:!px-0 [&_.ant-collapse-content-box]:!px-0 [&_.ant-collapse-content-box]:!pb-0"
				>
					<Panel header={sectionHeader} key="1" className="border-none">
						<div className="h-px w-full bg-amber-300 mb-3" />
						{fieldsGrid}
					</Panel>
				</Collapse>
			</div>
		);
	}

	return (
		<section className="mb-5 w-full">
			<div className="h-px w-full bg-amber-300 mb-0" />
			{sectionHeader}
			{fieldsGrid}
		</section>
	);
};
