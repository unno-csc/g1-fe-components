export const getDropdownButtonStyles = (): string => `
	.itsa-dropdown-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		font-weight: 500;
		cursor: pointer;
		border: none;
		white-space: nowrap;
		transition-property: color, background-color, border-color;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 150ms;
	}

	.itsa-dropdown-btn--sm {
		padding: 4px 12px;
		border-radius: 8px;
		font-size: 0.75rem;
		line-height: 1rem;
		max-height: 3rem;
	}

	.itsa-dropdown-btn--md {
		padding: 6px 16px;
		border-radius: 12px;
		font-size: 0.875rem;
		line-height: 1.25rem;
		max-height: 4rem;
	}

	.itsa-dropdown-btn--lg {
		padding: 8px 20px;
		border-radius: 16px;
		font-size: 1rem;
		line-height: 1.5rem;
		height: 44px;
	}

	.itsa-dropdown-btn--primary {
		background-color: #000000;
		color: #FFFFFF;
	}

	.itsa-dropdown-btn--primary:hover {
		background-color: #6B6B6B;
	}

	.itsa-dropdown-btn--primary:active {
		background-color: #000000;
	}

	.itsa-dropdown-btn--secondary {
		border: 1px solid #000000;
		background-color: #FFFFFF;
		color: #000000;
	}

	.itsa-dropdown-btn--secondary:hover {
		background-color: #EEF1F3;
		color: #000000;
	}

	.itsa-dropdown-btn--secondary:active {
		color: #6B6B6B;
		border-color: #6B6B6B;
	}

	.itsa-dropdown-btn--disabled {
		cursor: not-allowed;
		background-color: #D9D9D9;
		color: #4A5D85;
		pointer-events: none;
	}

	.itsa-dropdown-btn--disabled:hover {
		background-color: #D9D9D9;
	}

	.itsa-dropdown-btn__icon {
		display: inline-flex;
		align-items: center;
		font-size: 14px;
	}

	.itsa-dropdown-btn__label {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.itsa-dropdown-btn__arrow {
		display: inline-flex;
		align-items: center;
		font-size: 10px;
		margin-left: 4px;
	}
	.itsa-dropdown-btn__arrow--up {
		transform: rotate(180deg);
	}

	.itsa-dropdown-item {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 6px 8px;
	}

	.itsa-dropdown-item__icon {
		display: inline-flex;
		align-items: center;
	}

	.itsa-dropdown-item__label {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* Variants for item severity */
	.itsa-dropdown-item--danger {
		color: #D93025;
	}

	.itsa-dropdown-item--primary {
		color: #1F2937;
	}

	.itsa-dropdown-item--secondary {
		color: #4A5565;
	}

	.itsa-dropdown-item--success {
		color: #16A34A;
	}

	.itsa-dropdown-item--warning {
		color: #F59E0B;
	}
	.itsa-dropdown-btn .anticon-loading {
		font-size: 14px;
	}
`;
