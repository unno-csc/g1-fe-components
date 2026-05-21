import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { Select } from '../../components/Select';

beforeAll(() => {
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: vi.fn().mockImplementation(query => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		})),
	});

	global.ResizeObserver = vi.fn().mockImplementation(() => ({
		observe: vi.fn(),
		unobserve: vi.fn(),
		disconnect: vi.fn(),
	}));
});

describe('Select component', () => {
	it('renders and allows selecting an option', async () => {
		const user = userEvent.setup();
		const { container } = render(
			<Select
				options={[
					{ label: 'Uno', value: '1' },
					{ label: 'Dos', value: '2' },
				]}
				placeholder="Seleccione"
			/>,
		);

		const selector = container.querySelector('.ant-select-selector') as HTMLElement;
		await user.click(selector);

		const option = await screen.findByText('Dos');
		await user.click(option);
		expect(container).toMatchSnapshot();
	});
});


