import { Typography } from 'antd';
import { FieldConfig } from '../schema/types';

const { Link, Text } = Typography;

interface LinkRendererProps {
	value: unknown;
	data: Record<string, unknown>;
	config: FieldConfig;
}
export const LinkRenderer = ({ value, data, config }: LinkRendererProps) => {
	if (!value || value === '') {
		return (
			<Text type="secondary" style={{ fontStyle: 'italic' }}>
				{config.emptyText || 'No disponible'}
			</Text>
		);
	}

	const displayValue = config.formatter ? config.formatter(value, data) : value;
	const urlValue = typeof displayValue === 'string' ? displayValue : String(value);

	const isValidUrl = (url: string) => {
		try {
			new URL(url);
			return true;
		} catch {
			try {
				new URL(`http://${url}`);
				return true;
			} catch {
				return false;
			}
		}
	};

	if (!isValidUrl(urlValue)) {
		return <Text>{urlValue}</Text>;
	}

	const finalUrl = urlValue.startsWith('http') ? urlValue : `https://${urlValue}`;

	return (
		<Link href={finalUrl} target="_blank" rel="noopener noreferrer" copyable={config.copyable}>
			{config.prefix}
			{urlValue}
			{config.suffix}
		</Link>
	);
};
