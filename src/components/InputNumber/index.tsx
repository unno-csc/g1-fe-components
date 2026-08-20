import { LoadingOutlined } from '@ant-design/icons';
import { InputProps, Spin } from 'antd';
import { memo, useMemo } from 'react';
import { Input } from '@/components/Input/Input';
import { EInput } from '@/enums';
import { filterPositiveNumbersOnly } from '@/helpers';

export interface InputNumberProps extends Omit<InputProps, 'type' | 'value' | 'onChange'> {
	value?: number | null;
	onChange?: (value: number | null) => void;
	showCaracteres?: boolean;
	loading?: boolean;
}

const InputNumberComponent = ({
	value,
	onChange,
	placeholder,
	disabled = false,
	suffix,
	prefix,
	showCaracteres,
	loading,
	onBlur,
	...rest
}: InputNumberProps) => {
	const commitString = (raw: string) => {
		const cleanValue = filterPositiveNumbersOnly(raw);
		if (cleanValue === '' || cleanValue === undefined || cleanValue === null) {
			onChange?.(null);
			return;
		}
		const numValue = Number(cleanValue);
		onChange?.(Number.isNaN(numValue) ? null : numValue);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		commitString(e.target.value);
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		commitString(e.target.value);
		onBlur?.(e);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (
			e.key === 'Backspace' ||
			e.key === 'Delete' ||
			e.key === 'Tab' ||
			e.key === 'Escape' ||
			e.key === 'Enter' ||
			e.key === 'ArrowLeft' ||
			e.key === 'ArrowRight' ||
			e.key === 'ArrowUp' ||
			e.key === 'ArrowDown' ||
			e.key === 'Home' ||
			e.key === 'End' ||
			(e.ctrlKey && (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x'))
		) {
			return;
		}

		if (/^[0-9]$/.test(e.key)) {
			return;
		}

		const currentValue = (e.target as HTMLInputElement).value;
		if (e.key === '.' && !currentValue.includes('.') && currentValue.length > 0) {
			return;
		}

		e.preventDefault();
	};

	const placeholderUppercase = useMemo(() => {
		if (placeholder && placeholder.trim().length > 0) {
			return placeholder.toUpperCase();
		}
		return 'Ingrese un valor numérico';
	}, [placeholder]);

	// Stable suffix avoids focus loss when toggling loading (same idea as FilterInput).
	const mergedSuffix = useMemo(() => {
		const showLoading = !!loading;
		const hasSuffix = suffix != null;
		if (!showLoading && !hasSuffix) return undefined;
		if (!showLoading && hasSuffix) return suffix;

		return (
			<span className="inline-flex items-center gap-1">
				<span style={{ visibility: showLoading ? 'visible' : 'hidden', display: 'inline-flex' }}>
					<Spin indicator={<LoadingOutlined spin className="text-gray-400" />} />
				</span>
				{hasSuffix ? (
					<span
						style={{ visibility: showLoading ? 'hidden' : 'visible', display: 'inline-flex', alignItems: 'center' }}
					>
						{suffix}
					</span>
				) : null}
			</span>
		);
	}, [loading, suffix]);

	return (
		<Input
			{...rest}
			type={EInput.number}
			value={value ?? ''}
			onChange={handleChange}
			onBlur={handleBlur}
			onKeyDown={(e) => {
				handleKeyDown(e);
				rest.onKeyDown?.(e);
			}}
			showCountCharacters={showCaracteres}
			min={0}
			step="any"
			placeholder={placeholderUppercase}
			disabled={disabled}
			prefix={prefix}
			suffix={mergedSuffix}
		/>
	);
};

export const InputNumber = memo(InputNumberComponent) as typeof InputNumberComponent & {
	displayName?: string;
};

InputNumber.displayName = 'InputNumber';
