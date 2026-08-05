import type { ReactNode, CSSProperties } from 'react';

export type TReadOnlyFieldType = 'high' | 'medium' | 'low' | 'info' | 'success';
export type TReadOnlyFieldDescriptionPosition = 'bottom-label' | 'bottom-value';

export interface IReadOnlyFieldProps {
	label: ReactNode;
	value?: ReactNode;
	placeholder?: ReactNode;
	emphasize?: boolean;
	dashed?: boolean;
	className?: string;
	type?: TReadOnlyFieldType;
	customBorderColor?: string;
	customBackgroundColor?: string;
	width?: string | number;
	height?: string | number;
	description?: ReactNode;
	descriptionPosition?: TReadOnlyFieldDescriptionPosition;
	prefix?: ReactNode;
	suffix?: ReactNode;
	labelClassName?: string;
}

const DEFAULT_LABEL_CLASSNAME = 'text-xs font-medium uppercase tracking-[0.08em] text-gray-500';

export const ReadOnlyField = ({
	label,
	value,
	placeholder = '-',
	emphasize = false,
	dashed = false,
	className = '',
	type = 'low',
	customBorderColor,
	customBackgroundColor,
	width,
	height,
	description,
	descriptionPosition = 'bottom-label',
	prefix,
	suffix,
	labelClassName,
}: IReadOnlyFieldProps) => {
	const hasValue = value !== undefined && value !== null && String(value) !== '';

	const getTypeClasses = () => {
		switch (type) {
			case 'high':
				return 'border-red-200 bg-red-50';
			case 'medium':
				return 'border-amber-200 bg-amber-50';
			case 'info':
				return 'border-blue-200 bg-blue-50';
			case 'success':
				return 'border-green-200 bg-green-50';
			case 'low':
			default:
				return 'border-gray-200 bg-gray-50';
		}
	};

	const customStyles: CSSProperties = {
		...(customBorderColor && { borderColor: customBorderColor }),
		...(customBackgroundColor && { backgroundColor: customBackgroundColor }),
		...(width && { width }),
		...(height && { height }),
	};

	const renderDescription = () => {
		if (!description) return null;
		return <span className="text-[10px] text-gray-400 leading-tight mt-0.5">{description}</span>;
	};

	return (
		<div
			className={`flex flex-col gap-1 rounded-md border px-3 py-2 ${getTypeClasses()} ${
				dashed ? 'border-dashed' : ''
			} ${className}`}
			style={Object.keys(customStyles).length > 0 ? customStyles : undefined}
		>
			<div className="flex flex-col">
				<span className={labelClassName ?? DEFAULT_LABEL_CLASSNAME}>{label}</span>
				{descriptionPosition === 'bottom-label' && renderDescription()}
			</div>

			<div className="flex flex-col">
				<div className={`text-sm flex items-center gap-1 ${emphasize ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
					{prefix && <span className="text-gray-500">{prefix}</span>}
					<span>{hasValue ? value : placeholder}</span>
					{suffix && <span className="text-gray-500">{suffix}</span>}
				</div>
				{descriptionPosition === 'bottom-value' && renderDescription()}
			</div>
		</div>
	);
};
