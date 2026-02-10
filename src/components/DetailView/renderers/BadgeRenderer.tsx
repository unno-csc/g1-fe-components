import { TagStatus } from '@/components/TagStatus';
import { Typography } from 'antd';
import { FieldConfig } from '../schema/types';

const { Text } = Typography;

interface BadgeRendererProps {
	value: unknown;
	data: Record<string, unknown>;
	config: FieldConfig;
}

export const BadgeRenderer = ({ value, data, config }: BadgeRendererProps) => {
	if (value === null || value === undefined) {
		return (
			<Text type="secondary" style={{ fontStyle: 'italic' }}>
				{config.emptyText || 'N/A'}
			</Text>
		);
	}

	const processedValue = config.formatter ? config.formatter(value, data) : value;

	let booleanValue: boolean;
	if (typeof processedValue === 'boolean') {
		booleanValue = processedValue;
	} else if (typeof processedValue === 'string') {
		booleanValue = processedValue.toLowerCase() === 'true' || processedValue === '1';
	} else if (typeof processedValue === 'number') {
		booleanValue = processedValue === 1;
	} else {
		booleanValue = Boolean(processedValue);
	}

	return (
		<div className="flex items-start">
			<TagStatus status={booleanValue} />
		</div>
	);
};
