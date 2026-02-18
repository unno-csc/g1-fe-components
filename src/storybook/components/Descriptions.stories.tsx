import type { Meta, StoryObj } from '@storybook/react';
import { Descriptions } from '../../components/Descriptions';
import { Card } from '../../components/Card/Card';
import { TagStatus } from '../../components/TagStatus';
import { Carousel } from '../../components/Carousel';
import { WithoutInformation } from '../../components/WithoutInformation';
import { _mockModelData } from '../../constants/modelPreviewData.ts';
import { Spin } from '../../components/Spin';
import { Empty } from '../../components/Empty';

const meta: Meta<typeof Descriptions> = {
	title: 'Components/Descriptions',
	component: Descriptions,
	tags: ['autodocs'],
	parameters: {
		layout: 'padded',
	},
};

export default meta;
type Story = StoryObj<typeof Descriptions>;

export const Default: Story = {
	render: () => (
		<Descriptions title="User Info" bordered>
			<Descriptions.Item label="UserName">Zhou Maomao</Descriptions.Item>
			<Descriptions.Item label="Telephone">1810000000</Descriptions.Item>
			<Descriptions.Item label="Live">Hangzhou, Zhejiang</Descriptions.Item>
			<Descriptions.Item label="Remark">empty</Descriptions.Item>
			<Descriptions.Item label="Address">
				No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
			</Descriptions.Item>
		</Descriptions>
	),
};

export const ModelPreviewMigrated: Story = {
	render: () => {
		const model = _mockModelData;

		return (
			<div className="flex flex-col gap-4 max-h-[88vh] overflow-y-auto px-2 bg-gray-50 p-4">
				<Card title="Información Básica">
					<Descriptions bordered column={{ xs: 1, md: 2, xl: 2, xxl: 2 }} size="small">
						<Descriptions.Item label="Código">{model.itemCode || 'N/A'}</Descriptions.Item>
						<Descriptions.Item label="Sufijo">{model.itemSuffix || 'N/A'}</Descriptions.Item>
						<Descriptions.Item label="Marca">{model.brandName || 'N/A'}</Descriptions.Item>
						<Descriptions.Item label="Estado">
							<TagStatus status={model.isActive} />
						</Descriptions.Item>
						<Descriptions.Item label="Descripción" span={2}>
							{model.itemDescription || 'N/A'}
						</Descriptions.Item>
					</Descriptions>
				</Card>

				<Card title="Clasificaciones">
					<Descriptions bordered column={{ xs: 1, md: 2, xl: 2, xxl: 2 }} size="small">
						<Descriptions.Item label="Parentesco">{model.relationshipDescription || 'N/A'}</Descriptions.Item>
						<Descriptions.Item label="País de Origen">{model.countryName || 'N/A'}</Descriptions.Item>
						<Descriptions.Item label="Clase">{model.className || 'N/A'}</Descriptions.Item>
						<Descriptions.Item label="Subclase">{model.subclassName || 'N/A'}</Descriptions.Item>
						<Descriptions.Item label="Tipo ANT">{model.antTypeDescription || 'N/A'}</Descriptions.Item>
						<Descriptions.Item label="Subtipo ANT">{model.antSubtypeDescription || 'N/A'}</Descriptions.Item>
					</Descriptions>
				</Card>

				<Card title="Especificaciones Técnicas">
					<Descriptions bordered column={{ xs: 1, md: 2, xl: 2, xxl: 2 }} size="small">
						<Descriptions.Item label="Cilindraje">
							{model.displacement ? `${model.displacement} cc` : 'N/A'}
						</Descriptions.Item>
						<Descriptions.Item label="Capacidad">
							{model.capacity ? `${model.capacity} personas` : 'N/A'}
						</Descriptions.Item>
						<Descriptions.Item label="Tonelaje">
							{model.tonnage === undefined ? 'N/A' : `${model.tonnage} t`}
						</Descriptions.Item>
						<Descriptions.Item label="Transmisión">{model.transmissionDescription || 'N/A'}</Descriptions.Item>
						<Descriptions.Item label="¿Aplica encuesta TDE?">
							{model.requiresCustomerProfile ? 'Si' : 'No'}
						</Descriptions.Item>
						<Descriptions.Item label="IVA">{model.ivaDescription || 'N/A'}</Descriptions.Item>
						<Descriptions.Item label="Valor Ecológico">{model.ecoValueDescription || 'N/A'}</Descriptions.Item>
					</Descriptions>
				</Card>
                
				<Card title="Información Comercial">
					<Descriptions bordered column={1} size="small">
						<Descriptions.Item label="URL del QR Comercial">
							{model.qrCommercialCode ? (
								<a
									href={model.qrCommercialCode}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 hover:underline"
								>
									{model.qrCommercialCode}
								</a>
							) : (
								<span className="text-gray-400">No disponible</span>
							)}
						</Descriptions.Item>
						<Descriptions.Item label="Depreciación por Años">
							{model.depreciationPercentages && model.depreciationPercentages.length > 0 ? (
								<div className="overflow-x-auto">
									<table className="w-full min-w-full divide-y divide-gray-200 border">
										<thead className="bg-gray-50">
											<tr>
												<th className="px-4 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-700 uppercase tracking-wider">
													Año
												</th>
												<th className="px-4 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-700 uppercase tracking-wider">
													Depreciación (%)
												</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-200">
											{model.depreciationPercentages.map(({ year, depreciationPercentage }) => (
												<tr key={year} className="hover:bg-gray-50">
													<td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{year}</td>
													<td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
														{depreciationPercentage}%
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							) : (
								<span className="text-gray-400">No disponible</span>
							)}
						</Descriptions.Item>
					</Descriptions>
				</Card>

				<Card title="Galería de Imágenes">
					{model.images && model.images.length > 0 ? (
						<div className="max-w-2xl mx-auto w-full">
							<Carousel.Root autoPlayInterval={4000} loop className="rounded-xl overflow-hidden shadow-lg">
								<Carousel.Content aspectRatio="16/9" className="overflow-hidden">
									{model.images.map((image, index) => (
										<Carousel.Item key={index} className="flex bg-white items-center justify-center">
											<img src={image} alt={`Imagen ${index + 1}`} className="w-full h-full object-cover" />
										</Carousel.Item>
									))}
								</Carousel.Content>
								<Carousel.PrevButton variant="overlay" />
								<Carousel.NextButton variant="overlay" />
								<Carousel.Indicators variant="dots" position="bottom" />
							</Carousel.Root>
						</div>
					) : (
						<WithoutInformation title="No hay imágenes disponibles" />
					)}
				</Card>
			</div>
		);
	},
};

export const EmptyState: Story = {
	render: () => (
		<div className="flex flex-col gap-4 max-h-[88vh] overflow-y-auto px-2 p-4">
			<Card title="Custom Empty (WithoutInformation)">
				<WithoutInformation title="Modelo no encontrado" />
			</Card>
			<Card title="Ant Design Empty">
				<Empty description="Modelo no encontrado" />
			</Card>
		</div>
	),
};

export const LoadingState: Story = {
	render: () => (
		<div className="flex justify-center items-center min-h-[400px]">
			<Spin size="large" />
		</div>
	),
};
