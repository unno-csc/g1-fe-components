import { Table } from '@/components/Table';
import { Empty, Typography } from 'antd';
import { ReactNode } from 'react';
import { FieldConfig, TableColumnConfig } from '../schema/types';
import { TStrictTableColumnsType } from '@/types';

const { Text } = Typography;

interface TableRendererProps {
	value: unknown;
	data: Record<string, unknown>;
	config: FieldConfig;
}

export const TableRenderer = ({ value, config }: TableRendererProps) => {
	if (!Array.isArray(value) || value.length === 0) {
		return (
			<div className="flex items-center justify-center min-h-[200px] py-8">
				<Empty
					image={Empty.PRESENTED_IMAGE_SIMPLE}
					description={config.tableConfig?.emptyText || 'No hay datos disponibles'}
				/>
			</div>
		);
	}

	if (!config.tableConfig || !config.tableConfig.columns) {
		return (
			<Text type="danger">Error: No se definieron columnas para la tabla</Text>
		);
	}

	const { columns: columnConfigs, rowKey, bordered = true } = config.tableConfig;

	const columns: TStrictTableColumnsType<Record<string, unknown>> = columnConfigs.map((col: TableColumnConfig) => ({
		key: col.key,
		title: col.label,
		dataIndex: col.key,
		align: col.align || 'left',
		width: col.width,
		render: (cellValue: unknown, record: Record<string, unknown>, index: number) => {
			if (col.render) {
				return col.render(cellValue, record, index);
			}

			if (cellValue === null || cellValue === undefined || cellValue === '') {
				return (
					<Text type="secondary" style={{ fontStyle: 'italic' }}>
						N/A
					</Text>
				);
			}

			let displayValue: string | ReactNode;
			if (col.formatter) {
				displayValue = col.formatter(cellValue, record);
			} else {
				displayValue = String(cellValue);
			}

			return (
				<>
					{col.prefix && <Text type="secondary">{col.prefix}</Text>}
					<Text>{displayValue}</Text>
					{col.suffix && <Text type="secondary"> {col.suffix}</Text>}
				</>
			);
		},
	}));

	const getRowKey = rowKey || ((record: Record<string, unknown>, index?: number) => 
		(record.id as string) || (record.key as string) || String(index)
	);

	return (
		<div className="w-full">
			<Table
				columns={columns}
				data={value}
				rowKey={getRowKey}
				loading={false}
				onChange={() => {}}
				bordered={bordered}
				showPagination={false}
				showColumnActions={false}
				scroll={{ y: "calc(100dvh - 320px)" }}
				className="detail-view-embedded-table"
			/>
		</div>
	);
};
