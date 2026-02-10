import { ReactNode } from 'react';
import { DescriptionsProps } from 'antd';

export interface ColumnConfig {
	xs?: number;
	sm?: number;
	md?: number;
	lg?: number;
	xl?: number;
	xxl?: number;
}

export type FieldType = 'text' | 'badge' | 'link' | 'table' | 'gallery' | 'custom' | 'date' | 'currency' | 'array';

export type FieldFormatter<T = unknown, TData = object> = (value: T, fullData: TData) => string | ReactNode;

export type CustomRenderer<T = unknown, TData = object> = (value: T, fullData: TData, fieldConfig: FieldConfig<TData>) => ReactNode;

export type RendererComponent = (props: {
	value: unknown;
	data: Record<string, unknown>;
	config: FieldConfig;
}) => JSX.Element;

export type RendererRegistry = Record<FieldType, RendererComponent>;

export interface TableColumnConfig<TRecord = Record<string, unknown>> {
	key: string;
	label: string;
	width?: string | number; 
	suffix?: string;
	prefix?: string;
	formatter?: FieldFormatter;
	render?: (value: unknown, record: TRecord, index: number) => ReactNode;
	align?: 'left' | 'center' | 'right';
}

export interface TableConfig<TRecord = Record<string, unknown>> {
	columns: TableColumnConfig<TRecord>[];
	rowKey?: string | ((record: TRecord) => string);
	emptyText?: string;
	bordered?: boolean;
	size?: 'small' | 'middle' | 'large';
	showHeader?: boolean;
}

export interface GalleryConfig {
	aspectRatio?: string;
	autoPlay?: boolean;
	autoPlayInterval?: number;
	loop?: boolean;
	showThumbnails?: boolean;
	imageKey?: string;
	emptyText?: string;
}

export interface FieldConfig<TData = Record<string, unknown>> {
	key: keyof TData & string;
	label: string;
	type?: FieldType;
	span?: number;
	formatter?: FieldFormatter<unknown, TData>;
	suffix?: string;
	prefix?: string;
	tableConfig?: TableConfig;
	galleryConfig?: GalleryConfig;
	customRenderer?: CustomRenderer<unknown, TData>;
	emptyText?: string;
	copyable?: boolean;
	showTooltip?: boolean;
	hideIfEmpty?: boolean;
	condition?: (fullData: TData) => boolean;
}

export interface SectionConfig<TData = Record<string, unknown>> {
	title: string;
	columns?: ColumnConfig;
	fields: FieldConfig<TData>[];
	fullWidth?: boolean;
	size?: DescriptionsProps['size'];
	bordered?: boolean;
	layout?: 'horizontal' | 'vertical';
	collapsible?: boolean;
	defaultCollapsed?: boolean;
	condition?: (fullData: TData) => boolean;
	extra?: ReactNode;
	className?: string;
}

export interface DetailSchema<TData = Record<string, unknown>> {
	sections: SectionConfig<TData>[];
	defaultColumns?: ColumnConfig;
	title?: string;
	description?: string;
	className?: string;
	metadata?: {
		version?: string;
		author?: string;
		createdAt?: string;
		[key: string]: unknown;
	};
}

export interface DetailViewProps<TData = Record<string, unknown>> {
	data: TData;
	schema: DetailSchema<TData>;
	isLoading?: boolean;
	emptyMessage?: string;
	className?: string;
}

export interface FieldBuilderOptions<TData = Record<string, unknown>> extends Omit<FieldConfig<TData>, 'key' | 'label'> {}
