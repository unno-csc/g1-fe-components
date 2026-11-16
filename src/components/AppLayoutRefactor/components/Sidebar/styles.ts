import type { CSSProperties } from 'react';

export const sidebarStyles: {
	wrapper: CSSProperties;
	header: CSSProperties;
	body: CSSProperties;
	footer: CSSProperties;
	content: CSSProperties;
} = {
	wrapper: {
		borderTopRightRadius: 12,
		borderBottomRightRadius: 12,
		overflow: 'hidden',
		boxShadow: '4px 0 16px -2px rgba(0, 0, 0, 0.08)',
	},
	header: {
		minHeight: 'auto',
		padding: '8px 12px 4px 12px',
		lineHeight: 1.2,
		borderBottom: 'none',
	},
	body: {
		padding: '4px 12px',
		overflow: 'hidden',
		display: 'flex',
		flexDirection: 'column',
		flex: 1,
	},
	footer: {
		padding: '4px 12px 8px 12px',
		borderTop: 'none',
	},
	content: {
		backgroundColor: 'rgb(217 223 227)',
	},
};
