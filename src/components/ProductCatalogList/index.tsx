import { EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Button } from '../Button';

export interface IProductCatalogListItem {
	code: string;
	brandName: string;
	productCode: string;
	numericCode?: string;
	description: string;
	status: string;
	countryOriginName?: string;
	itemClassName?: string;
	itemSubclassName?: string;
	serialization?: string;
	suffix?: string;
	viewDisabled?: boolean;
	addDisabled?: boolean;
}

export interface IProductCatalogListProps {
	items: IProductCatalogListItem[];
	className?: string;
	emptyMessage?: string;
	viewLabel?: string;
	addLabel?: string;
	onViewItem?: (item: IProductCatalogListItem) => void;
	onAddItem?: (item: IProductCatalogListItem) => void;
}

export const ProductCatalogList = ({
	items,
	className = '',
	emptyMessage = 'No hay items disponibles',
	viewLabel = 'Ver',
	addLabel = 'Agregar',
	onViewItem,
	onAddItem,
}: IProductCatalogListProps) => {
	const [hoveredItemKey, setHoveredItemKey] = useState<string | null>(null);

	if (items.length === 0) {
		return (
			<div className={`rounded-xl border border-gray-300 bg-white-100 p-6 text-center text-sm text-gray-500 ${className}`.trim()}>
				{emptyMessage}
			</div>
		);
	}

	return (
		<div className={`flex flex-col gap-1 ${className}`.trim()}>
			{items.map(item => {
				const itemKey = `${item.code}-${item.productCode}`;
				const isHovered = hoveredItemKey === itemKey;

				return (
					<div
						key={itemKey}
						className={`cursor-pointer rounded-xl border px-3.5 py-2.5 transition-colors duration-200 ${
							isHovered ? 'border-primary-400 bg-gray-25' : 'border-gray-150 bg-white-100'
						}`}
						onMouseEnter={() => setHoveredItemKey(itemKey)}
						onMouseLeave={() => setHoveredItemKey(currentKey => currentKey === itemKey ? null : currentKey)}
					>
						<div className="flex flex-col gap-0.5">
							<span className="text-gray-600 font-bold">{item.code}</span>
							<div className="flex flex-col gap-1">
								<strong className="text-sm font-semibold leading-tight text-gray-900">{item.description}</strong>
								<div className="flex flex-col gap-0.5 text-sm text-gray-600">
									<div className='flex flex-col gap-0.5'>
										{item.itemClassName && <span>Clase: <strong>{item.itemClassName}</strong></span>}
										{item.itemSubclassName && <span>Subclase: <strong>{item.itemSubclassName}</strong></span>}
									</div>

								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
								<Button
									type="secondary"
									size="small"
									block
									disabled={item.viewDisabled}
									onClick={() => onViewItem?.(item)}
									label={(
										<span className="flex items-center justify-center gap-2">
											<EyeOutlined />
											<span>{viewLabel}</span>
										</span>
									)}
								/>
								<Button
									type="primary"
									size="small"
									block
									disabled={item.addDisabled}
									onClick={() => onAddItem?.(item)}
									label={(
										<span className="flex items-center justify-center gap-2">
											<PlusOutlined />
											<span>{addLabel}</span>
										</span>
									)}
								/>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};
