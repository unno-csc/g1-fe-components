import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { TreeSelect } from '../../components/TreeSelect';

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

describe('TreeSelect component', () => {
	const sampleTreeData = [
		{
			title: 'Vehículos',
			value: 'vehiculos',
			children: [
				{ title: 'Autos', value: 'autos' },
				{ title: 'Motos', value: 'motos' },
			],
		},
		{
			title: 'Repuestos',
			value: 'repuestos',
			children: [{ title: 'Frenos', value: 'frenos' }],
		},
	];

	it('renders and allows selecting a tree option', async () => {
		const user = userEvent.setup();
		const onChangeMock = vi.fn();
		const { container } = render(
			<TreeSelect
				treeData={sampleTreeData}
				placeholder="Seleccione opción"
				treeDefaultExpandAll
				onChange={onChangeMock}
			/>,
		);

		const selector = container.querySelector('.ant-select-selector') as HTMLElement;
		expect(selector).toBeInTheDocument();
		await user.click(selector);

		const option = await screen.findByText('Autos');
		await user.click(option);
		expect(onChangeMock).toHaveBeenCalledWith('autos', expect.anything(), expect.anything());
	});

	it('merges custom className and applies rounded-lg', () => {
		const { container } = render(
			<TreeSelect
				treeData={sampleTreeData}
				className="custom-tree-class"
			/>,
		);

		const wrapper = container.querySelector('.ant-select');
		expect(wrapper).toHaveClass('custom-tree-class');
		expect(wrapper).toHaveClass('rounded-lg');
	});

	it('configures itsa-tree-select-dropdown and subtle switcher icon by default', () => {
		render(
			<TreeSelect
				open
				treeData={sampleTreeData}
				treeDefaultExpandAll
			/>,
		);

		const dropdown = document.querySelector('.itsa-tree-select-dropdown');
		expect(dropdown).toBeInTheDocument();

		const switcherIcon = document.querySelector('.itsa-tree-select-switcher-icon');
		expect(switcherIcon).toBeInTheDocument();
	});

	it('renders switcher icon for leaf node when switcherIcon is provided on node', () => {
		render(
			<TreeSelect
				open
				treeData={[
					{
						title: 'Agency without subagencies',
						value: 'agency-solo',
						isLeaf: true,
						switcherIcon: <span data-testid="custom-leaf-switcher">icon</span>,
					},
				]}
			/>,
		);

		const leafSwitcher = screen.getByTestId('custom-leaf-switcher');
		expect(leafSwitcher).toBeInTheDocument();
	});
});

