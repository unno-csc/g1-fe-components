import React, { memo, useEffect, useId, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin, type InputProps } from 'antd';
import type { RefCallBack } from 'react-hook-form';
import classNames from 'classnames';
import { FormLabel } from '@/components/FormLabel';
import { FormLabelError } from '@/components/FormLabelError';
import { Input } from '@/components/Input/Input';
import type { TTextTransform } from '@/types';

export interface IInputSearchProps extends Omit<InputProps, 'type'> {
	type?: string;
	title?: string;
	label?: string;
	optional?: boolean;
	error?: string;
	defaultValue?: string;
	ref?: RefCallBack;
	loading?: boolean;
	enterButton?: boolean;
	searchTrigger?: 'change' | 'enter' | 'both';
	textTransform?: TTextTransform;
	containerClassName?: string;
	onSearch?: (value: string) => void;
}

export type InputSearchProps = IInputSearchProps;

const InputSearchComponent = ({
	ref,
	type = 'text',
	defaultValue,
	loading = false,
	onSearch,
	searchTrigger = 'both',
	title,
	label,
	optional,
	error,
	textTransform,
	containerClassName,
	className,
	style,
	id: customId,
	value,
	onChange,
	onPressEnter,
	status,
	...rest
}: IInputSearchProps) => {
	const generatedId = useId();
	const id = customId ?? generatedId;
	const errId = `${id}-error`;
	const displayLabel = label ?? title;

	const isControlled = value !== undefined;
	const [internalValue, setInternalValue] = useState<string>(
		typeof value === 'string'
			? value
			: typeof defaultValue === 'string'
				? defaultValue
				: '',
	);

	const resolvedValue = isControlled ? (typeof value === 'string' ? value : String(value ?? '')) : internalValue;

	useEffect(() => {
		if (!isControlled && defaultValue !== undefined) {
			setInternalValue(typeof defaultValue === 'string' ? defaultValue : String(defaultValue));
		}
	}, [defaultValue, isControlled]);

	const handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
		const inputValue = e.target.value ?? '';
		let transformedValue = inputValue;

		if (textTransform === 'uppercase') {
			transformedValue = inputValue.toUpperCase();
		} else if (textTransform === 'lowercase') {
			transformedValue = inputValue.toLowerCase();
		}

		if (onChange) {
			if (transformedValue !== inputValue) {
				e.target.value = transformedValue;
			}
			onChange(e);
		}

		if (!isControlled) {
			setInternalValue(transformedValue);
		}

		if (onSearch && (searchTrigger === 'change' || searchTrigger === 'both')) {
			onSearch(transformedValue);
		}
	};

	const handlePressEnter: React.KeyboardEventHandler<HTMLInputElement> = e => {
		onPressEnter?.(e);
		const currentValue = (e.currentTarget as HTMLInputElement).value;
		if (onSearch && (searchTrigger === 'enter' || searchTrigger === 'both')) {
			onSearch(currentValue);
		}
	};

	const showLoading = !!loading;

	const mergedSuffix = (
		<span className="itsa-inputsearch-suffix inline-flex items-center gap-1">
			{showLoading && (
				<span className="inline-flex items-center">
					<Spin indicator={<LoadingOutlined spin className="text-gray-400" />} />
				</span>
			)}
			<span
				style={{
					visibility: showLoading ? 'hidden' : 'visible',
					display: rest.suffix ? 'inline-flex' : 'none',
				}}
			>
				{rest.suffix}
			</span>
		</span>
	);

	const mergedStyle = textTransform ? { ...style, textTransform } : style;

	return (
		<div className={classNames('flex flex-col gap-0.5', containerClassName)}>
			{displayLabel && <FormLabel label={displayLabel} htmlFor={id} optional={optional} />}
			<Input
				{...rest}
				id={id}
				ref={ref}
				type={type}
				value={resolvedValue}
				onChange={handleChange}
				onPressEnter={handlePressEnter}
				suffix={mergedSuffix}
				className={className}
				style={mergedStyle}
				status={error ? 'error' : status}
				aria-invalid={!!error}
				aria-describedby={error ? errId : undefined}
			/>
			{error && <FormLabelError label={error} id={errId} />}
		</div>
	);
};

export const InputSearch = memo(InputSearchComponent) as typeof InputSearchComponent & {
	displayName?: string;
};

InputSearch.displayName = 'InputSearch';
