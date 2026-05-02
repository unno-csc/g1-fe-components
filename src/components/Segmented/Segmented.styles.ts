export const getSegmentedStyles = (): string => `
	.itsa-segmented.ant-segmented {
		padding: 4px;
		border-radius: 12px;
		background: #FFFBEA;
		border: 1px solid #FDE68A;
	}

	.itsa-segmented .ant-segmented-item {
		color: #111111;
		border-radius: 8px;
		font-weight: 500;
	}

	.itsa-segmented .ant-segmented-item-selected {
		background: #111111;
		color: #FFFFFF;
	}

	.itsa-segmented .ant-segmented-item-selected:hover {
		color: #FFFFFF;
	}
`;
