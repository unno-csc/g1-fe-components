import { Card, Empty, Typography } from 'antd';
import { useMemo } from 'react';
import { DetailViewProps } from './schema/types';
import { DetailSection } from './DetailSection';

const { Title, Paragraph } = Typography;
export const DetailView = <T extends object = object>({
	data,
	schema,
	isLoading = false,
	emptyMessage = 'No hay datos disponibles',
	className = '',
}: DetailViewProps<T>) => {
	const visibleSections = useMemo(() => {
		return schema.sections.filter(section => {
			if (section.condition && !section.condition(data)) {
				return false;
			}
			return true;
		});
	}, [schema.sections, data]);

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
				{Array.from({ length: schema.sections.length || 3 }).map((_, index) => (
					<Card key={index} loading className="bg-gray-50" />
				))}
			</div>
		);
	}

	if (!data) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<Empty description={emptyMessage} />
			</div>
		);
	}

	const containerClassName = [
		'max-h-[88vh] overflow-y-auto px-2',
		schema.className,
		className,
	]
		.filter(Boolean)
		.join(' ');

	return (
		<div className={containerClassName}>
			{(schema.title || schema.description) && (
				<div className="mb-4">
					{schema.title && (
						<Title level={3} className="!mb-1">
							{schema.title}
						</Title>
					)}
					{schema.description && (
						<Paragraph type="secondary" className="!mb-0">
							{schema.description}
						</Paragraph>
					)}
				</div>
			)}

			{visibleSections.length === 0 ? (
				<Empty description="No hay secciones para mostrar" />
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{visibleSections.map((section, index) => (
						<div
							key={`${section.title}-${index}`}
							className={`h-full ${section.fullWidth ? 'md:col-span-2' : ''}`}
						>
							<DetailSection
								section={section}
								data={data}
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
