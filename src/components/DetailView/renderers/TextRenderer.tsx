import { Typography } from 'antd';
import { FieldConfig } from '../schema/types';

const { Text } = Typography;

interface TextRendererProps {
	value: unknown;
	data: Record<string, unknown>;
	config: FieldConfig;
}

export const TextRenderer = ({ value, data, config }: TextRendererProps) => {
	if (value === null || value === undefined || value === '') {
		return (
			<Text type="secondary" className="italic">
				{config.emptyText || 'N/A'}
			</Text>
		);
	}

	let displayValue: any = value;
	if (config.formatter) {
		displayValue = config.formatter(value, data);
	}

	const stringValue: any = typeof displayValue === 'object' ? displayValue : String(displayValue);

	return (
		<div className="flex items-center gap-1">
			{config.prefix && <Text type="secondary">{config.prefix}</Text>}
			<Text copyable={config.copyable} ellipsis={config.showTooltip ? { tooltip: stringValue } : false}>
				{stringValue}
			</Text>
			{config.suffix && <Text type="secondary">{config.suffix}</Text>}
		</div>
	);
};
