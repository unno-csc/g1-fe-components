export const getSegmentedStyles = (): string => `
	.itsa-segmented.ant-segmented {
		padding: 4px;
		border-radius: 12px;
		background: #F4F8FB;
	}

	.itsa-segmented .ant-segmented-item {
		color: #4A5565;
		border-radius: 8px;
		font-weight: 500;
	}

	.itsa-segmented .ant-segmented-item-selected {
		background: #EA3B48;
		color: #FFFFFF;
	}

	.itsa-segmented .ant-segmented-item-selected:hover {
		color: #FFFFFF;
	}
`;
