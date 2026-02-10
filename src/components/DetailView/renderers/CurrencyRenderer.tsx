import { Typography } from 'antd';
import { FieldConfig } from '../schema/types';

const { Text } = Typography;

interface CurrencyRendererProps {
	value: unknown;
	data: Record<string, unknown>;
	config: FieldConfig;
}

export const CurrencyRenderer = ({ value, data, config }: CurrencyRendererProps) => {
	if (value === null || value === undefined || value === '') {
		return (
			<Text type="secondary" style={{ fontStyle: 'italic' }}>
				{config.emptyText || 'N/A'}
			</Text>
		);
	}

	if (config.formatter) {
		const formatted = config.formatter(value, data);
		return <Text>{formatted}</Text>;
	}

	const numericValue = typeof value === 'number' ? value : parseFloat(String(value));

	if (isNaN(numericValue)) {
		return <Text type="warning">Valor inválido</Text>;
	}

	const formatted = new Intl.NumberFormat('es-EC', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(numericValue);

	return (
		<Text>
			{config.prefix || '$'}
			{formatted}
			{config.suffix}
		</Text>
	);
};
