import React, { forwardRef } from 'react';
import { Radio as AntRadio } from 'antd';
import type {
	RadioChangeEvent,
	RadioGroupButtonStyle,
	RadioGroupOptionType,
	RadioGroupProps,
	RadioProps,
	RadioRef,
} from 'antd/es/radio/interface';
import type { RadioButtonProps } from 'antd/es/radio/radioButton';
import classNames from 'classnames';

export type TRadioVariant = 'default' | 'warning';
export type TRadioRef = RadioRef;
export type TRadioChangeEvent = RadioChangeEvent;
export type TRadioGroupOptionType = RadioGroupOptionType;
export type TRadioGroupButtonStyle = RadioGroupButtonStyle;

export interface IRadioProps extends RadioProps {
	variant?: TRadioVariant;
	label?: string;
	options?: RadioGroupProps['options'];
	buttonStyle?: TRadioGroupButtonStyle;
	optionType?: TRadioGroupOptionType;
}

export interface IRadioGroupProps extends RadioGroupProps {
	variant?: TRadioVariant;
	label?: string;
}

export interface IRadioButtonProps extends RadioButtonProps {
	variant?: TRadioVariant;
}

const RadioItem = forwardRef<TRadioRef, IRadioProps>(
	({ variant = 'default', label, className, rootClassName, options, ...props }, ref) => {
		const hasLabel = Boolean(label);

		if (options !== undefined || (hasLabel && props.children === undefined)) {
			const mergedRootClassName = classNames(
				'motor1-radio-group',
				rootClassName,
				{
					'itsa-radio--default': variant === 'default',
					'itsa-radio--warning': variant === 'warning',
				}
			);

			return (
				<div className="motor1-radio-container">
					{hasLabel && label !== undefined && <p className="text-sm font-medium text-gray-800 mb-1">{label}</p>}
					<AntRadio.Group
						ref={ref as unknown as React.ForwardedRef<HTMLDivElement>}
						className={className}
						rootClassName={mergedRootClassName}
						options={options}
						{...(props as unknown as RadioGroupProps)}
					/>
				</div>
			);
		}

		const mergedRootClassName = classNames(
			'motor1-radio',
			rootClassName,
			{
				'itsa-radio--default': variant === 'default',
				'itsa-radio--warning': variant === 'warning',
			}
		);

		return (
			<AntRadio
				ref={ref}
				className={className}
				rootClassName={mergedRootClassName}
				{...props}
			>
				{props.children}
			</AntRadio>
		);
	}
);
RadioItem.displayName = 'RadioItem';

const RadioGroup = forwardRef<HTMLDivElement, IRadioGroupProps>(
	({ variant = 'default', label, className, rootClassName, ...props }, ref) => {
		const hasLabel = Boolean(label);
		const mergedRootClassName = classNames(
			'motor1-radio-group',
			rootClassName,
			{
				'itsa-radio--default': variant === 'default',
				'itsa-radio--warning': variant === 'warning',
			}
		);

		if (hasLabel && label !== undefined) {
			return (
				<div className="motor1-radio-group-container">
					<p className="text-sm font-medium text-gray-800 mb-1">{label}</p>
					<AntRadio.Group
						ref={ref}
						className={className}
						rootClassName={mergedRootClassName}
						{...props}
					/>
				</div>
			);
		}

		return (
			<AntRadio.Group
				ref={ref}
				className={className}
				rootClassName={mergedRootClassName}
				{...props}
			/>
		);
	}
);
RadioGroup.displayName = 'RadioGroup';

const RadioButton = forwardRef<TRadioRef, IRadioButtonProps>(
	({ variant = 'default', className, rootClassName, ...props }, ref) => {
		const mergedRootClassName = classNames(
			'motor1-radio-button',
			rootClassName,
			{
				'itsa-radio--default': variant === 'default',
				'itsa-radio--warning': variant === 'warning',
			}
		);

		return (
			<AntRadio.Button
				ref={ref}
				className={className}
				rootClassName={mergedRootClassName}
				{...props}
			/>
		);
	}
);
RadioButton.displayName = 'RadioButton';

export type TRadioComponent = typeof RadioItem & {
	Group: typeof RadioGroup;
	Button: typeof RadioButton;
};

export const Radio = RadioItem as TRadioComponent;
Radio.Group = RadioGroup;
Radio.Button = RadioButton;
Radio.displayName = 'Radio';
