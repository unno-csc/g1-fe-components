import { Tag, Typography } from 'antd';
import { FieldConfig } from '../schema/types';

const { Text } = Typography;

interface ArrayRendererProps {
	value: unknown;
	data: Record<string, unknown>;
	config: FieldConfig;
}

export const ArrayRenderer = ({ value, data, config }: ArrayRendererProps) => {
	if (!Array.isArray(value) || value.length === 0) {
		return (
			<Text type="secondary" style={{ fontStyle: 'italic' }}>
				{config.emptyText || 'N/A'}
			</Text>
		);
	}

	if (config.formatter) {
		const formatted = config.formatter(value, data);
		return <span>{formatted}</span>;
	}

	return (
		<span className="flex flex-wrap gap-1">
			{value.map((item, index) => {
				const displayValue = typeof item === 'object' ? JSON.stringify(item) : String(item);
				return (
					<Tag key={index} color="blue">
						{config.prefix}
						{displayValue}
						{config.suffix}
					</Tag>
				);
			})}
		</span>
	);
};
