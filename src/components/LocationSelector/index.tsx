import { memo } from 'react';
import classNames from 'classnames';
import { Col, Row, type ColProps } from 'antd';
import { FormLabel } from '@/components/FormLabel';
import { FormLabelError } from '@/components/FormLabelError';
import { Select } from '@/components/Select';
import { filterOptions } from '../InputAddress/helpers';
import type {
	ILocationSelectorColSpan,
	ILocationSelectorProps,
	TLocationColSpan,
	TLocationColSpanValue,
} from '@/interfaces';

export type {
	ILocationSelectorColSpan,
	ILocationSelectorProps,
	TLocationColSpan,
	TLocationColSpanValue,
};

export type LocationSelectorProps = ILocationSelectorProps;

const resolveSingleColValue = (
	val?: TLocationColSpanValue
): ColProps | undefined => {
	if (val === undefined) return undefined;
	if (typeof val === 'object') return val;
	if (typeof val === 'string') return { flex: val };
	if (typeof val === 'number') {
		// Shorthand for columns per row: 1, 2, 3, 4
		if (val === 1) return { flex: '100%', span: 24 };
		if (val === 2) return { flex: '50%', span: 12 };
		if (val === 3) return { flex: '33.333333%', span: 8 };
		if (val === 4) return { flex: '25%', span: 6 };
		// Standard 24-grid span values: 6, 8, 12, 24
		if (val === 6) return { flex: '25%', span: 6 };
		if (val === 8) return { flex: '33.333333%', span: 8 };
		if (val === 12) return { flex: '50%', span: 12 };
		if (val === 24) return { flex: '100%', span: 24 };
		// Any other custom span
		return { span: val };
	}
	return undefined;
};

const resolveColProps = (colSpan?: TLocationColSpan): ColProps => {
	if (!colSpan) {
		return {
			xs: { flex: '100%', span: 24 },
			sm: { flex: '50%', span: 12 },
			md: { flex: '50%', span: 12 },
			lg: { flex: '50%', span: 12 },
			xl: { flex: '50%', span: 12 },
		};
	}

	if (typeof colSpan === 'number' || typeof colSpan === 'string') {
		const targetVal = resolveSingleColValue(colSpan);
		const numericVal = typeof colSpan === 'number' ? colSpan : undefined;
		return {
			xs: { flex: '100%', span: 24 },
			sm:
				resolveSingleColValue(
					numericVal && numericVal <= 4 ? Math.min(numericVal, 2) : 2
				) ?? { flex: '50%', span: 12 },
			md: targetVal,
			lg: targetVal,
			xl: targetVal,
		};
	}

	const fallback = colSpan.default;
	const resolvedXs = resolveSingleColValue(colSpan.xs ?? fallback ?? 1);
	const resolvedSm = resolveSingleColValue(colSpan.sm ?? fallback);
	const resolvedMd = resolveSingleColValue(colSpan.md ?? fallback);
	const resolvedLg = resolveSingleColValue(colSpan.lg ?? fallback);
	const resolvedXl = resolveSingleColValue(colSpan.xl ?? fallback);
	const resolvedXxl = resolveSingleColValue(colSpan.xxl ?? fallback);

	return {
		...(resolvedXs && { xs: resolvedXs }),
		...(resolvedSm && { sm: resolvedSm }),
		...(resolvedMd && { md: resolvedMd }),
		...(resolvedLg && { lg: resolvedLg }),
		...(resolvedXl && { xl: resolvedXl }),
		...(resolvedXxl && { xxl: resolvedXxl }),
	};
};

const LocationSelectorComponent = ({
	optionsCountries,
	optionsProvinces,
	optionsCantons,
	optionsParishes,
	onChangeCountry,
	onChangeProvince,
	onChangeCanton,
	onChangeParish,
	valueCountryId,
	valueProvinceId,
	valueCantonId,
	valueParishId,
	showParish,
	isLoadingCountries,
	isLoadingProvinces,
	isLoadingCantons,
	isLoadingParishes,
	showProvince,
	showCanton,
	allowClear = true,
	titleCountry = 'País',
	titleProvince = 'Provincia',
	titleCanton = 'Cantón',
	titleParish = 'Parroquia',
	errorCountry,
	errorProvince,
	errorCanton,
	errorParish,
	colSpan,
	gutter = 4,
	className,
	colClassName,
}: ILocationSelectorProps) => {
	const colProps = resolveColProps(colSpan);
	const resolvedColClassName = classNames('flex flex-col gap-0.5', colClassName);

	return (
		<Row gutter={gutter} className={className}>
			<Col {...colProps} className={resolvedColClassName}>
				<FormLabel label={titleCountry} />
				<Select
					options={optionsCountries}
					status={errorCountry ? 'error' : undefined}
					showSearch
					filterOption={filterOptions}
					onChange={onChangeCountry}
					loading={isLoadingCountries}
					value={valueCountryId}
					placeholder={titleCountry}
					className="w-full"
					allowClear={allowClear}
				/>
				{errorCountry && <FormLabelError label={errorCountry} />}
			</Col>

			{showProvince && (
				<Col {...colProps} className={resolvedColClassName}>
					<FormLabel label={titleProvince} />
					<Select
						options={optionsProvinces}
						status={errorProvince ? 'error' : undefined}
						showSearch
						filterOption={filterOptions}
						onChange={onChangeProvince}
						loading={isLoadingProvinces}
						value={valueProvinceId !== 0 ? valueProvinceId : undefined}
						placeholder={titleProvince}
						className="w-full"
						allowClear={allowClear}
					/>
					{errorProvince && <FormLabelError label={errorProvince} />}
				</Col>
			)}

			{showCanton && (
				<Col {...colProps} className={resolvedColClassName}>
					<FormLabel label={titleCanton} />
					<Select
						options={optionsCantons}
						status={errorCanton ? 'error' : undefined}
						showSearch
						filterOption={filterOptions}
						onChange={onChangeCanton}
						loading={isLoadingCantons}
						value={valueCantonId !== 0 ? valueCantonId : undefined}
						placeholder={titleCanton}
						className="w-full"
						allowClear={allowClear}
					/>
					{errorCanton && <FormLabelError label={errorCanton} />}
				</Col>
			)}

			{showParish && (
				<Col {...colProps} className={resolvedColClassName}>
					<FormLabel label={titleParish} />
					<Select
						options={optionsParishes}
						status={errorParish ? 'error' : undefined}
						showSearch
						filterOption={filterOptions}
						onChange={onChangeParish}
						loading={isLoadingParishes}
						value={valueParishId !== 0 ? valueParishId : undefined}
						placeholder={titleParish}
						className="w-full"
						allowClear={allowClear}
					/>
					{errorParish && <FormLabelError label={errorParish} />}
				</Col>
			)}
		</Row>
	);
};

export const LocationSelector = memo(LocationSelectorComponent) as typeof LocationSelectorComponent & {
	displayName?: string;
};

LocationSelector.displayName = 'LocationSelector';
