import { Select, SelectProps } from "antd";

export interface IFilterSelectProps extends SelectProps {
    label: string;
}

type AnyOption = { value: unknown; options?: AnyOption[] };

// Recorre options (incluye grupos con sub-options) y verifica si el value existe
const valueExistsInOptions = (val: unknown, options?: AnyOption[]): boolean => {
	if (!options || options.length === 0) return false;
	for (const opt of options) {
		if (!opt) continue;
		if (Array.isArray(opt.options)) {
			if (valueExistsInOptions(val, opt.options)) return true;
		} else if (opt.value === val) {
			return true;
		}
	}
	return false;
};

export const FilterSelect = ({ label, ...rest }: IFilterSelectProps) => {
	const restAny = rest as any;
	const options: AnyOption[] | undefined = restAny.options;

	// Sanea el value: si no existe en options, lo convierte en undefined
	// para que el Select muestre el placeholder en lugar del valor "crudo".
	const sanitizeValue = (val: unknown): unknown => {
		if (val === undefined || val === null) return undefined;

		if (Array.isArray(val)) {
			const filtered = val.filter((v) => {
				const realV = v && typeof v === 'object' && 'value' in v ? (v as any).value : v;
				return valueExistsInOptions(realV, options);
			});
			return filtered.length > 0 ? filtered : undefined;
		}

		if (typeof val === 'object' && 'value' in (val as any)) {
			return valueExistsInOptions((val as any).value, options) ? val : undefined;
		}

		return valueExistsInOptions(val, options) ? val : undefined;
	};

	// Solo saneamos si hay options definidas (modo controlado típico).
	// Si el consumidor usa <Option> como children, dejamos el value tal cual.
	const hasOptionsProp = Array.isArray(options);
	const safeValue = hasOptionsProp ? sanitizeValue(restAny.value) : restAny.value;
	const safeDefaultValue = hasOptionsProp ? sanitizeValue(restAny.defaultValue) : restAny.defaultValue;

	const rawValue = safeValue ?? safeDefaultValue;
	let hasValue = false;
	if (Array.isArray(rawValue)) {
		hasValue = rawValue.length > 0;
	} else if (rawValue && typeof rawValue === 'object' && 'value' in (rawValue as any)) {
		hasValue = !!(rawValue as any).value;
	} else if (typeof rawValue === 'string') {
		hasValue = rawValue.trim().length > 0;
	} else if (typeof rawValue === 'number') {
		hasValue = true;
	} else {
		hasValue = !!rawValue;
	}

	const shouldHighlight = hasValue;

	const mergedStyles = {
		...restAny.styles,
		selector: {
			...(restAny.styles?.selector ?? {}),
			transition: 'box-shadow 160ms ease, border-color 160ms ease',
			...(shouldHighlight
				? {
						borderColor: '#93c5fd',
						boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.15)',
				  }
				: {}),
		},
	};

	return (
		<div className="flex flex-col gap-0">
            <small className="font-bold flex-1 min-w-0 truncate">
                {label}
            </small>
			<Select
				{...rest}
				value={safeValue as any}
				defaultValue={safeDefaultValue as any}
				status={undefined}
				className={`${restAny.className || ''} ${shouldHighlight ? 'itsa-select-has-value' : ''}`.trim()}
				styles={mergedStyles as any}
				style={{
					height: '28px',
					lineHeight: '18px',
					padding: '1px 2px',
                    fontSize: '11px',
					transition: 'box-shadow 160ms ease, border-color 160ms ease',
				}}
			/>
		</div>
	);
};
