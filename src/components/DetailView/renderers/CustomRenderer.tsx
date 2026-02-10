import { Typography } from 'antd';
import { FieldConfig } from '../schema/types';

const { Text } = Typography;

interface CustomRendererProps {
	value: unknown;
	data: Record<string, unknown>;
	config: FieldConfig;
}

export const CustomRenderer = ({ value, data, config }: CustomRendererProps) => {
	if (!config.customRenderer) {
		return <Text type="danger">Error: No se definió customRenderer para este campo</Text>;
	}

	try {
		const result = config.customRenderer(value, data, config);
		return <>{result}</>;
	} catch (error) {
		console.error('Error en customRenderer:', error);
		return <Text type="danger">Error al renderizar campo custom</Text>;
	}
};
