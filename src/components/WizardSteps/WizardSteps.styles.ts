export const getWizardStepsStyles = (containerId: string, arrowWidth: number): string => `
	#${containerId} {
		--wizard-arrow-width: ${arrowWidth}px;
		--wizard-height: 48px;
		--wizard-padding: 8px;
		--wizard-border-width: 2px;
		--wizard-color-wait: #F4F8FB;
		--wizard-color-active: #d9dfe3;
		--wizard-color-error: #F5423E;
		--itsa-primary: #EA3B48;
		--wizard-text-wait: #78909C;
		--wizard-text-active: #263238;
		--wizard-text-error: #FFFFFF;
	}

	#${containerId} .wizard-steps.ant-steps {
		display: flex;
		align-items: stretch;
		padding: 0;
		background: transparent;
	}

	#${containerId} .wizard-steps .ant-steps-item {
		flex: 1;
		overflow: visible;
		margin: 0 !important;
		padding: 0 !important;
		position: relative;
	}

	#${containerId} .wizard-steps .ant-steps-item-tail,
	#${containerId} .wizard-steps .ant-steps-item-icon {
		display: none !important;
	}

	#${containerId} .wizard-steps .ant-steps-item-container {
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		height: var(--wizard-height);
		padding: var(--wizard-padding);
		border-top: var(--wizard-border-width) solid transparent;
		border-bottom: var(--wizard-border-width) solid transparent;
		background: var(--wizard-color-wait);
		position: relative;
		transition: background-color 0.3s ease, border-color 0.3s ease;
		overflow: visible;
	}

	#${containerId} .wizard-steps .ant-steps-item:first-child .ant-steps-item-container {
		border-left: var(--wizard-border-width) solid transparent;
		border-top-left-radius: 6px;
		border-bottom-left-radius: 6px;
		padding-left: calc(var(--wizard-padding) * 1.5);
	}

	#${containerId} .wizard-steps .ant-steps-item:last-child .ant-steps-item-container {
		border-right: var(--wizard-border-width) solid transparent;
		border-top-right-radius: 6px;
		border-bottom-right-radius: 6px;
		padding-right: calc(var(--wizard-padding) * 1.5);
	}

	#${containerId} .wizard-steps .ant-steps-item:not(:first-child):not(:last-child) .ant-steps-item-container {
		clip-path: polygon(
			0 0,
			calc(95% - var(--wizard-arrow-width)) 0,
			95% 50%,
			calc(95% - var(--wizard-arrow-width)) 100%,
			0 100%,
			var(--wizard-arrow-width) 50%
		) !important;
		margin-left: calc(var(--wizard-arrow-width) * -0.6);
		margin-right: calc(var(--wizard-arrow-width) * -0.6);
		padding-left: calc(var(--wizard-padding) + var(--wizard-arrow-width) * 1.4);
		padding-right: calc(var(--wizard-padding) + var(--wizard-arrow-width) * 1.4);
	}

	#${containerId} .wizard-steps .ant-steps-item:first-child:not(:last-child) .ant-steps-item-container {
		clip-path: polygon(
			0 0,
			calc(95% - var(--wizard-arrow-width)) 0,
			95% 50%,
			calc(95% - var(--wizard-arrow-width)) 100%,
			0 100%
		) !important;
		margin-right: calc(var(--wizard-arrow-width) * -0.6);
		padding-right: calc(var(--wizard-padding) + var(--wizard-arrow-width) * 1.4);
		border-top-left-radius: 6px;
		border-bottom-left-radius: 6px;
	}

	#${containerId} .wizard-steps .ant-steps-item:last-child:not(:first-child) .ant-steps-item-container {
		clip-path: polygon(
			0 0,
			100% 0,
			100% 100%,
			0 100%,
			var(--wizard-arrow-width) 50%
		) !important;
		margin-left: calc(var(--wizard-arrow-width) * -0.6);
		padding-left: calc(var(--wizard-padding) + var(--wizard-arrow-width) * 1.4);
		border-top-right-radius: 6px;
		border-bottom-right-radius: 6px;
	}

	#${containerId} .wizard-steps .ant-steps-item-content,
	#${containerId} .wizard-steps .ant-steps-item-title {
		font-weight: 600;
		font-size: 0.875rem;
		line-height: 1.25rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: var(--wizard-text-wait) !important;
		margin: 0 !important;
		padding: 0 !important;
		z-index: 2;
	}

	#${containerId} .wizard-steps .ant-steps-item-description {
		display: none !important;
	}

	#${containerId} .wizard-steps .ant-steps-item-wait .ant-steps-item-container {
		background-color: var(--wizard-color-wait);
		border-color: var(--wizard-color-wait);
	}

	#${containerId} .wizard-steps .ant-steps-item-wait .ant-steps-item-title {
		color: var(--wizard-text-wait) !important;
	}

	#${containerId} .wizard-steps .ant-steps-item-process .ant-steps-item-container,
	#${containerId} .wizard-steps .ant-steps-item-finish .ant-steps-item-container {
		background-color: var(--wizard-color-active);
		border-color: var(--wizard-color-active);
	}

	#${containerId} .wizard-steps .ant-steps-item-process .ant-steps-item-title,
	#${containerId} .wizard-steps .ant-steps-item-finish .ant-steps-item-title {
		color: var(--wizard-text-active) !important;
	}

	#${containerId} .wizard-steps .ant-steps-item-process .ant-steps-item-container {
		z-index: 3;
	}

	#${containerId} .wizard-steps .ant-steps-item-error .ant-steps-item-container {
		background-color: var(--wizard-color-error);
		border-color: var(--wizard-color-error);
	}

	#${containerId} .wizard-steps .ant-steps-item-error .ant-steps-item-title {
		color: var(--wizard-text-error) !important;
	}

	#${containerId} .wizard-steps .ant-steps-item:not(.ant-steps-item-disabled):hover .ant-steps-item-title {
		color: var(--itsa-primary) !important;
		transition: color 0.2s ease;
	}

	#${containerId} .wizard-steps .ant-steps-item-disabled .ant-steps-item-container {
		cursor: not-allowed;
		opacity: 0.6;
	}

	@media (max-width: 640px) {
		#${containerId} {
			--wizard-padding: 12px;
		}

		#${containerId} .wizard-steps.ant-steps {
			flex-direction: column;
			gap: 8px;
		}

		#${containerId} .wizard-steps .ant-steps-item {
			width: 100%;
		}

		#${containerId} .wizard-steps .ant-steps-item-container {
			height: auto;
			min-height: 48px;
			border-radius: 6px !important;
		}

		#${containerId} .wizard-steps .ant-steps-item:not(:first-child):not(:last-child) .ant-steps-item-container,
		#${containerId} .wizard-steps .ant-steps-item:first-child:not(:last-child) .ant-steps-item-container,
		#${containerId} .wizard-steps .ant-steps-item:last-child:not(:first-child) .ant-steps-item-container {
			clip-path: none !important;
			margin: 0 !important;
			padding: var(--wizard-padding) !important;
			border-radius: 6px !important;
		}

		#${containerId} .wizard-steps .ant-steps-item:first-child .ant-steps-item-container {
			padding: var(--wizard-padding) !important;
		}

		#${containerId} .wizard-steps .ant-steps-item:last-child .ant-steps-item-container {
			padding: var(--wizard-padding) !important;
		}

		#${containerId} .wizard-steps .ant-steps-item-title {
			font-size: 0.875rem;
			white-space: normal;
			text-align: center;
		}
	}
`;
