import React from 'react';
import { render, screen, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Grid, useBreakpoint } from '../../components/Grid';

describe('Grid and useBreakpoint', () => {
	it('provides useBreakpoint hook on Grid object', () => {
		expect(typeof Grid.useBreakpoint).toBe('function');
		expect(Grid.useBreakpoint).toBe(useBreakpoint);
	});

	it('executes useBreakpoint hook via renderHook', () => {
		const { result } = renderHook(() => useBreakpoint());
		expect(result.current).toBeDefined();
		expect(typeof result.current).toBe('object');
	});

	it('executes Grid.useBreakpoint hook via renderHook', () => {
		const { result } = renderHook(() => Grid.useBreakpoint());
		expect(result.current).toBeDefined();
		expect(typeof result.current).toBe('object');
	});

	it('renders responsive component evaluating isMdUp correctly', () => {
		const ResponsiveComponent = () => {
			const screens = Grid.useBreakpoint();
			const isMdUp = screens.md ?? true;

			return (
				<div data-testid="responsive-wrapper">
					<span>{isMdUp ? 'Desktop View' : 'Mobile View'}</span>
				</div>
			);
		};

		const { container } = render(<ResponsiveComponent />);
		expect(screen.getByTestId('responsive-wrapper')).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});
});
