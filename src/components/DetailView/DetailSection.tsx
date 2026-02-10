import { Card, Collapse } from 'antd';
import { useMemo, useState } from 'react';
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

const columnMap: Record<number, string> = {
	1: 'grid-cols-1',
	2: 'grid-cols-2',
	3: 'grid-cols-3',
	4: 'grid-cols-4',
};

const mdColumnMap: Record<number, string> = {
	1: 'md:grid-cols-1',
	2: 'md:grid-cols-2',
	3: 'md:grid-cols-3',
	4: 'md:grid-cols-4',
};

const xlColumnMap: Record<number, string> = {
	1: 'xl:grid-cols-1',
	2: 'xl:grid-cols-2',
	3: 'xl:grid-cols-3',
	4: 'xl:grid-cols-4',
};

const getGridColumns = (columns: ColumnConfig) => {
	const xs = columns?.xs || 1;
	const md = columns?.md || 2;
	const xl = columns?.xl || 2;

	return `${columnMap[xs] || 'grid-cols-1'} ${mdColumnMap[md] || 'md:grid-cols-2'} ${xlColumnMap[xl] || 'xl:grid-cols-2'}`;
};

interface DetailSectionProps<TData = object> {
	section: SectionConfig<TData>;
	data: TData;
}

export const DetailSection = <TData extends object = object>({
	section,
	data,
}: DetailSectionProps<TData>) => {
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
	const gridClass = `grid gap-4 ${getGridColumns(columns)}`;

	const content = (
		<div className={gridClass}>
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

				const spanClass = field.span && field.span > 1 ? (
					field.span === 2 ? 'col-span-2' :
					field.span === 3 ? 'col-span-3' :
					field.span === 4 ? 'col-span-4' :
					''
				) : '';

				return (
					<div key={`${field.key}-${index}`} className={`flex flex-col gap-1 ${spanClass}`}>
						<label className="text-xs text-gray-400 font-normal">{field.label}</label>
						<div className="text-sm font-medium">
							<RendererComponent value={value} data={data as Record<string, unknown>} config={field as FieldConfig} />
						</div>
					</div>
				);
			})}
		</div>
	);

	if (section.collapsible) {
		return (
			<Collapse
				defaultActiveKey={collapsed ? [] : ['1']}
				onChange={keys => setCollapsed(keys.length === 0)}
				className={section.className}
			>
				<Panel header={section.title} key="1" extra={section.extra}>
					{content}
				</Panel>
			</Collapse>
		);
	}

	return (
		<Card
			title={<span className="text-sm font-normal">{section.title}</span>}
			extra={section.extra}
			className={`bg-gray-50 ${section.className || ''}`}
			styles={{
				header: {
					borderTop: '1px solid #E5E7EB',
					borderLeft: '1px solid #E5E7EB',
					borderRight: '1px solid #E5E7EB',
					borderBottom: 'none',
				},
				body: { 
                    paddingTop: '0px', 
                    borderTop: 'none',
					borderLeft: '1px solid #E5E7EB',
					borderRight: '1px solid #E5E7EB',
					borderBottom: '1px solid #E5E7EB', 
                },
			}}
		>
			{content}
		</Card>
	);
};
