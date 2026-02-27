export const getCollapseCardStyles = (): string => `
	:root {
		--collapse-primary: #EA3B48;
		--collapse-gradient-start: #fff0f1;
		--collapse-gradient-end: white;
		--collapse-border-active: #ffc2c6;
		--collapse-border-inactive: #e0e0e0;
		--collapse-text-active: #EA3B48;
		--collapse-text-inactive: #000000;
		--collapse-badge-bg-active: #EA3B48;
		--collapse-badge-text-active: #FFFFFF;
		--collapse-badge-bg-inactive: #F4F8FB;
		--collapse-badge-text-inactive: #4A5565;
		--collapse-bg-white: white;
		--collapse-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
		--collapse-border-radius: 12px;
	}

	.itsa-collapse--card.ant-collapse {
		background: transparent !important;
		border: none !important;
	}

	.itsa-collapse--card.ant-collapse > .ant-collapse-item {
		margin-bottom: 16px !important;
		background: var(--collapse-bg-white) !important;
		border-radius: var(--collapse-border-radius) !important;
		border: 1px solid var(--collapse-border-inactive) !important;
		box-shadow: var(--collapse-shadow) !important;
		overflow: hidden !important;
	}

	.itsa-collapse--card.ant-collapse > .ant-collapse-item.ant-collapse-item-active {
		background: linear-gradient(to bottom, var(--collapse-gradient-start) 0%, var(--collapse-gradient-end) 30%) !important;
		border: 1.5px solid var(--collapse-border-active) !important;
	}

	.itsa-collapse--card.ant-collapse > .ant-collapse-item:last-child {
		margin-bottom: 0 !important;
	}

	.itsa-collapse--card.ant-collapse > .ant-collapse-item > .ant-collapse-header {
		background: transparent !important;
		border-radius: var(--collapse-border-radius) var(--collapse-border-radius) 0 0 !important;
		border-bottom: none !important;
		padding: 20px 20px !important;
		font-weight: 600 !important;
		font-size: 16px !important;
	}

	.itsa-collapse--card.ant-collapse > .ant-collapse-item > .ant-collapse-header .ant-collapse-header-text {
		color: var(--collapse-text-inactive) !important;
	}

	.itsa-collapse--card.ant-collapse > .ant-collapse-item.ant-collapse-item-active > .ant-collapse-header .ant-collapse-header-text {
		color: var(--collapse-text-active) !important;
	}

	.itsa-collapse--card.ant-collapse > .ant-collapse-item > .ant-collapse-header .ant-collapse-expand-icon {
		color: var(--collapse-text-inactive) !important;
	}

	.itsa-collapse--card.ant-collapse > .ant-collapse-item.ant-collapse-item-active > .ant-collapse-header .ant-collapse-expand-icon {
		color: var(--collapse-text-active) !important;
	}

	.itsa-collapse--card.ant-collapse > .ant-collapse-item > .ant-collapse-header .ant-collapse-expand-icon svg {
		color: var(--collapse-text-inactive) !important;
		fill: var(--collapse-text-inactive) !important;
	}

	.itsa-collapse--card.ant-collapse > .ant-collapse-item.ant-collapse-item-active > .ant-collapse-header .ant-collapse-expand-icon svg {
		color: var(--collapse-text-active) !important;
		fill: var(--collapse-text-active) !important;
	}

	.itsa-collapse--card.ant-collapse > .ant-collapse-item.ant-collapse-item-active > .ant-collapse-header {
		border-radius: var(--collapse-border-radius) var(--collapse-border-radius) 0 0 !important;
	}

	.itsa-collapse--card.ant-collapse > .ant-collapse-item:not(.ant-collapse-item-active) > .ant-collapse-header {
		border-radius: var(--collapse-border-radius) !important;
		border-bottom: none !important;
	}

	.itsa-collapse--card.ant-collapse > .ant-collapse-item > .ant-collapse-content {
		background: transparent !important;
		border-radius: 0 0 var(--collapse-border-radius) var(--collapse-border-radius) !important;
		border-top: none !important;
	}

	.itsa-collapse--card.ant-collapse > .ant-collapse-item > .ant-collapse-content > .ant-collapse-content-box {
		background: transparent !important;
		padding: 20px !important;
		padding-top: 0 !important;
	}

	.itsa-collapse--card.ant-collapse .ant-collapse-content-box {
		background: transparent !important;
	}

	.itsa-collapse-step-badge {
		display: inline-block;
		background: var(--collapse-badge-bg-inactive) !important;
		color: var(--collapse-badge-text-inactive) !important;
		padding: 4px 12px;
		border-radius: var(--collapse-border-radius);
		font-size: 10px;
		font-weight: 400;
		margin-left: 12px;
	}

	.itsa-collapse--card.ant-collapse > .ant-collapse-item.ant-collapse-item-active .itsa-collapse-step-badge {
		background: var(--collapse-badge-bg-active) !important;
		color: var(--collapse-badge-text-active) !important;
	}
`;
