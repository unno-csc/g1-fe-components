import { Select } from 'antd';
import { CSSProperties } from 'react';
import { useAppLayoutStore } from '@/store';

export interface IBusinessLineSelectProps {
	className?: string;
	style?: CSSProperties;
	minWidth?: number;
}

export const BusinessLineSelect = ({
	className = 'itsa-business-line-select',
	style,
	minWidth = 220,
}: IBusinessLineSelectProps) => {
	const { userInformation, businessLineId, setBusinessLineId } = useAppLayoutStore();
	const businessLines = userInformation?.businessLines ?? [];

	if (businessLines.length <= 1) {
		return null;
	}

	return (
		<Select
			options={businessLines.map(businessLine => ({ label: businessLine.name, value: businessLine.id }))}
			value={businessLineId}
			onChange={setBusinessLineId}
			size="small"
			className={className}
			style={{ minWidth, ...style }}
			placeholder="Selecciona una línea de negocio"
		/>
	);
};

