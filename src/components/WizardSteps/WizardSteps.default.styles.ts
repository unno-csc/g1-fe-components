export const getWizardStepsDefaultStyles = (): string => `
	.itsa-wizard-steps .ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-icon {
		background-color: #EA3B48 !important;
		border-color: #EA3B48 !important;
	}

	.itsa-wizard-steps .ant-steps-item-wait > .ant-steps-item-container > .ant-steps-item-icon {
		background-color: #F4F8FB !important;
		border-color: #d9d9d9 !important;
	}

	.itsa-wizard-steps .ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-icon {
		background-color: #EA3B48 !important;
		border-color: #EA3B48 !important;
	}

	.itsa-wizard-steps .ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon {
		color: #FFFFFF !important;
	}

	.itsa-wizard-steps .ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title::after,
	.itsa-wizard-steps .ant-steps-item-finish > .ant-steps-item-tail::after,
	.itsa-wizard-steps .ant-steps-item-finish .ant-steps-item-tail::after,
	.itsa-wizard-steps.ant-steps-vertical .ant-steps-item-finish .ant-steps-item-tail::after {
		background-color: #EA3B48 !important;
	}

	.itsa-wizard-steps .ant-steps-item-process > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title {
		color: #EA3B48 !important;
	}

	.itsa-wizard-steps .ant-steps-item:hover .ant-steps-item-icon {
		border-color: #EA3B48 !important;
	}

	.itsa-wizard-steps .ant-steps-item:hover .ant-steps-item-icon .ant-steps-icon {
		color: #EA3B48 !important;
	}

	.itsa-wizard-steps .ant-steps-item-finish:hover .ant-steps-item-icon .ant-steps-icon,
	.itsa-wizard-steps .ant-steps-item-process:hover .ant-steps-item-icon .ant-steps-icon {
		color: #FFFFFF !important;
	}

	.itsa-wizard-steps .ant-steps-item:hover .ant-steps-item-title {
		color: #EA3B48 !important;
	}

	.itsa-wizard-steps.ant-steps-navigation .ant-steps-item::after {
		border-color: #EA3B48 !important;
	}

	.itsa-wizard-steps.ant-steps-navigation .ant-steps-item-active::after {
		border-left-color: #EA3B48 !important;
	}

	.itsa-wizard-steps.ant-steps-navigation .ant-steps-item-container:hover {
		background-color: rgba(234, 59, 72, 0.08) !important;
	}

	.itsa-wizard-steps.ant-steps-inline .ant-steps-item-container:hover {
		color: #EA3B48 !important;
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
