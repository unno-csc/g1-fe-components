import dayjs from 'dayjs';
import { Typography } from 'antd';
import { FieldConfig } from '../schema/types';

const { Text } = Typography;

interface DateRendererProps {
	value: unknown;
	data: Record<string, unknown>;
	config: FieldConfig;
}

export const DateRenderer = ({ value, data, config }: DateRendererProps) => {
	if (!value) {
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

	const date = dayjs(value as string | number | Date);

	if (!date.isValid()) {
		return <Text type="warning">Fecha inválida</Text>;
	}

	const formattedDate = date.format('DD/MM/YYYY');

	return (
		<Text>
			{config.prefix}
			{formattedDate}
			{config.suffix}
		</Text>
	);
};
