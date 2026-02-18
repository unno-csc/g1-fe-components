import {
	ColumnConfig,
	DetailSchema,
	FieldBuilderOptions,
	FieldConfig,
	SectionConfig,
	TableColumnConfig,
	GalleryConfig,
} from './types';

export class SectionBuilder<TData = Record<string, unknown>> {
	private section: SectionConfig<TData>;

	constructor(title: string) {
		this.section = {
			title,
			fields: [],
			bordered: true,
			size: 'small',
			layout: 'horizontal',
		};
	}

	columns(config: ColumnConfig | number): this {
		if (typeof config === 'number') {
			this.section.columns = { xs: config, md: config, xl: config, xxl: config };
		} else {
			this.section.columns = config;
		}
		return this;
	}

	field(key: keyof TData & string, label: string, options?: FieldBuilderOptions<TData>): this {
		const fieldConfig: FieldConfig<TData> = {
			key,
			label,
			type: options?.type || 'text',
			span: options?.span,
			formatter: options?.formatter,
			suffix: options?.suffix,
			prefix: options?.prefix,
			tableConfig: options?.tableConfig,
			galleryConfig: options?.galleryConfig,
			customRenderer: options?.customRenderer,
			badgeLabels: options?.badgeLabels,
			emptyText: options?.emptyText,
			copyable: options?.copyable,
			showTooltip: options?.showTooltip,
			hideIfEmpty: options?.hideIfEmpty,
			condition: options?.condition,
		};

		this.section.fields.push(fieldConfig);
		return this;
	}

	table(
		key: keyof TData & string,
		label: string,
		columns: TableColumnConfig[],
		options?: Omit<FieldBuilderOptions<TData>, 'tableConfig'>,
	): this {
		return this.field(key, label, {
			...options,
			type: 'table',
			tableConfig: {
				columns,
				bordered: true,
				size: 'small',
				showHeader: true,
			},
		});
	}

	gallery(key: keyof TData & string, label: string, config?: GalleryConfig, options?: Omit<FieldBuilderOptions<TData>, 'galleryConfig'>): this {
		return this.field(key, label, {
			...options,
			type: 'gallery',
			galleryConfig: {
				aspectRatio: '16/9',
				autoPlay: true,
				autoPlayInterval: 4000,
				showThumbnails: false,
				...config,
			},
		});
	}

	custom(key: keyof TData & string, label: string, renderer: FieldBuilderOptions<TData>['customRenderer'], options?: FieldBuilderOptions<TData>): this {
		return this.field(key, label, {
			...options,
			type: 'custom',
			customRenderer: renderer,
		});
	}

	badge(
		key: keyof TData & string, 
		label: string, 
		labels?: { true: string; false: string },
		options?: Omit<FieldBuilderOptions<TData>, 'type' | 'badgeLabels'>
	): this {
		return this.field(key, label, { 
			...options, 
			type: 'badge',
			badgeLabels: labels 
		});
	}

	link(key: keyof TData & string, label: string, options?: Omit<FieldBuilderOptions<TData>, 'type'>): this {
		return this.field(key, label, { ...options, type: 'link' });
	}

	date(key: keyof TData & string, label: string, options?: Omit<FieldBuilderOptions<TData>, 'type'>): this {
		return this.field(key, label, { ...options, type: 'date' });
	}

	currency(key: keyof TData & string, label: string, options?: Omit<FieldBuilderOptions<TData>, 'type'>): this {
		return this.field(key, label, { ...options, type: 'currency' });
	}

	array(key: keyof TData & string, label: string, options?: Omit<FieldBuilderOptions<TData>, 'type'>): this {
		return this.field(key, label, { ...options, type: 'array' });
	}

	size(size: 'small' | 'middle' | 'default'): this {
		this.section.size = size;
		return this;
	}

	bordered(bordered: boolean): this {
		this.section.bordered = bordered;
		return this;
	}

	layout(layout: 'horizontal' | 'vertical'): this {
		this.section.layout = layout;
		return this;
	}

	collapsible(defaultCollapsed: boolean = false): this {
		this.section.collapsible = true;
		this.section.defaultCollapsed = defaultCollapsed;
		return this;
	}

	showIf(condition: (data: TData) => boolean): this {
		this.section.condition = condition;
		return this;
	}
	className(className: string): this {
		this.section.className = className;
		return this;
	}

	fullWidth(): this {
		this.section.fullWidth = true;
		return this;
	}

	build(): SectionConfig<TData> {
		return this.section;
	}
}

export class SchemaBuilder<TData = Record<string, unknown>> {
	private schema: DetailSchema<TData>;

	constructor() {
		this.schema = {
			sections: [],
			defaultColumns: { xs: 1, md: 2, xl: 2, xxl: 2 },
		};
	}

	title(title: string): this {
		this.schema.title = title;
		return this;
	}

	description(description: string): this {
		this.schema.description = description;
		return this;
	}

	defaultColumns(config: ColumnConfig): this {
		this.schema.defaultColumns = config;
		return this;
	}

	section(titleOrConfig: string | SectionConfig<TData>, configurator?: (builder: SectionBuilder<TData>) => SectionBuilder<TData>): this {
		if (typeof titleOrConfig === 'string') {
			const builder = new SectionBuilder<TData>(titleOrConfig);
			const configuredBuilder = configurator ? configurator(builder) : builder;
			const sectionConfig = configuredBuilder.build();

			if (!sectionConfig.columns && this.schema.defaultColumns) {
				sectionConfig.columns = this.schema.defaultColumns;
			}

			this.schema.sections.push(sectionConfig);
		} else {
			this.schema.sections.push(titleOrConfig);
		}

		return this;
	}

	className(className: string): this {
		this.schema.className = className;
		return this;
	}

	metadata(metadata: DetailSchema<TData>['metadata']): this {
		this.schema.metadata = metadata;
		return this;
	}
	build(): DetailSchema<TData> {
		return this.schema;
	}
}

export const createDetailSchema = <TData = Record<string, unknown>>(): SchemaBuilder<TData> => {
	return new SchemaBuilder<TData>();
};
