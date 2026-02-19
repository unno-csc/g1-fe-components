export const getWizardStepsDefaultStyles = (): string => `
	.itsa-wizard-steps .ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-icon {
		background-color: #F9A825 !important;
		border-color: #F9A825 !important;
	}

	.itsa-wizard-steps .ant-steps-item-wait > .ant-steps-item-container > .ant-steps-item-icon {
		background-color: #F4F8FB !important;
		border-color: #d9d9d9 !important;
	}

	.itsa-wizard-steps .ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-icon {
		background-color: #F9A825 !important;
		border-color: #F9A825 !important;
	}

	.itsa-wizard-steps .ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon {
		color: #FFFFFF !important;
	}

	.itsa-wizard-steps .ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title::after,
	.itsa-wizard-steps .ant-steps-item-finish > .ant-steps-item-tail::after,
	.itsa-wizard-steps .ant-steps-item-finish .ant-steps-item-tail::after,
	.itsa-wizard-steps.ant-steps-vertical .ant-steps-item-finish .ant-steps-item-tail::after {
		background-color: #F9A825 !important;
	}

	.itsa-wizard-steps .ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title {
		color: #F9A825 !important;
	}

	.itsa-wizard-steps .ant-steps-item:hover .ant-steps-item-icon {
		border-color: #F9A825 !important;
	}

	.itsa-wizard-steps .ant-steps-item:hover .ant-steps-item-icon .ant-steps-icon {
		color: #F9A825 !important;
	}

	.itsa-wizard-steps .ant-steps-item-finish:hover .ant-steps-item-icon .ant-steps-icon,
	.itsa-wizard-steps .ant-steps-item-process:hover .ant-steps-item-icon .ant-steps-icon {
		color: #FFFFFF !important;
	}

	.itsa-wizard-steps .ant-steps-item:hover .ant-steps-item-title {
		color: #F9A825 !important;
	}

	.itsa-wizard-steps.ant-steps-navigation .ant-steps-item::after {
		border-color: #F9A825 !important;
	}

	.itsa-wizard-steps.ant-steps-navigation .ant-steps-item-active::after {
		border-left-color: #F9A825 !important;
	}

	.itsa-wizard-steps.ant-steps-navigation .ant-steps-item-container:hover {
		background-color: rgba(249, 168, 37, 0.08) !important;
	}

	.itsa-wizard-steps.ant-steps-inline .ant-steps-item-container:hover {
		color: #F9A825 !important;
	}

	.itsa-wizard-steps .ant-steps-item-error > .ant-steps-item-container > .ant-steps-item-icon {
		background-color: #F9A825 !important;
		border-color: #F9A825 !important;
	}

	.itsa-wizard-steps .ant-steps-item-error .ant-steps-item-icon > .ant-steps-icon,
	.itsa-wizard-steps .ant-steps-item-error > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title {
		color: #F9A825 !important;
	}

	.itsa-wizard-steps .ant-steps-item-error > .ant-steps-item-tail::after,
	.itsa-wizard-steps.ant-steps-vertical .ant-steps-item-error .ant-steps-item-tail::after {
		background-color: #F9A825 !important;
	}

	.itsa-wizard-steps.ant-steps-vertical .ant-steps-item-content {
		margin-top: 2px !important;
		margin-inline-start: 0 !important;
	}

	.itsa-wizard-steps.ant-steps-label-vertical .ant-steps-item-content {
		margin-top: 4px !important;
	}

	.itsa-wizard-steps.ant-steps-vertical .ant-steps-item-icon {
		margin-inline-end: 0 !important;
	}
`;

