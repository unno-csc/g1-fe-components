import { IAgency, IPermissions } from '@/interfaces';
import { fireEvent, render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppLayoutStore } from '../../store';
import { ControlBusinessLineSelectorUI } from './ControlBusinessLineSelectorUI.view';
import { ControlMultiCompanySelectorUI } from './ControlMultiCompanySelectorUI.view';
import { ControlSubAgencySelectorUI, MultiCompanyTreeNode } from './ControlSubAgencySelectorUI.view';

interface MockOption {
	value: string | number;
	label?: ReactNode;
	title?: ReactNode;
	selectable?: boolean;
}

interface MockSelectProps {
	options?: MockOption[];
	treeData?: MultiCompanyTreeNode[];
	value?: string;
	onChange?: (value: string) => void;
	onSelect?: (value: string) => void;
}

vi.mock('antd', async importOriginal => {
	const actual = (await importOriginal()) as object;
	const MockSelect = ({ options = [], value, onChange }: MockSelectProps) => (
		<select value={value ?? ''} onChange={event => onChange?.(event.target.value)}>
			<option value="" />
			{options.map(option => (
				<option key={String(option.value)} value={String(option.value)}>
					{option.label}
				</option>
			))}
		</select>
	);
	const MockTreeSelect = ({ treeData = [], value, onSelect }: MockSelectProps) => (
		<select value={value ?? ''} onChange={event => onSelect?.(event.target.value)}>
			<option value="" />
			{treeData.map(option => (
				<option
					key={String(option.value)}
					value={String(option.value)}
					disabled={option.selectable === false}
				>
					{option.title}
				</option>
			))}
		</select>
	);

	return { ...actual, Select: MockSelect, TreeSelect: MockTreeSelect };
});

const agency: IAgency = {
	id: 1,
	name: 'Agency',
	subAgencies: [
		{
			id: 10,
			name: 'SubAgency 10',
			modules: [
				{
					id: 100,
					name: 'Module 100',
					icon: '',
					submodules: [{ id: 1000, name: 'Submodule 1000', icon: '', programs: [] }],
				},
				{
					id: 101,
					name: 'Module 101',
					icon: '',
					submodules: [{ id: 1010, name: 'Submodule 1010', icon: '', programs: [] }],
				},
			],
		},
		{
			id: 11,
			name: 'SubAgency 11',
			modules: [
				{
					id: 110,
					name: 'Module 110',
					icon: '',
					submodules: [{ id: 1100, name: 'Submodule 1100', icon: '', programs: [] }],
				},
			],
		},
	],
};
const permissions: IPermissions = { agencies: [agency] };

const resetStore = () => {
	useAppLayoutStore.setState({
		permissions: undefined,
		companyOptions: [],
		companyOptionsReady: false,
		selectionIds: {},
		hydrated: false,
		agency: undefined,
		subAgency: undefined,
		module: undefined,
		currentSubmodule: undefined,
		currentCompany: undefined,
	});
};

const firstSelector = (): HTMLElement => {
	const selector = screen.getAllByRole('combobox')[0];
	if (selector === undefined) throw new Error('Expected selector');
	return selector;
};

describe('AppLayoutRefactor header selectors', () => {
	beforeEach(resetStore);

	it('delegates company selection to the centralized store', () => {
		const options = [
			{ label: 'Company 1', value: '1' },
			{ label: 'Company 2', value: '2' },
		];
		useAppLayoutStore.getState().setCompanyOptions(options);
		render(<ControlMultiCompanySelectorUI optionsCompany={options} loadingAppLayout={false} />);

		fireEvent.change(firstSelector(), { target: { value: '2' } });

		expect(useAppLayoutStore.getState().currentCompany?.value).toBe('2');
	});

	it('cascades module selection and preserves navigation', () => {
		const appNavigate = vi.fn();
		useAppLayoutStore.getState().setPermissions(permissions);
		render(<ControlBusinessLineSelectorUI loadingAppLayout={false} menuItemsNavigate={appNavigate} />);

		fireEvent.change(firstSelector(), { target: { value: '101' } });

		expect(useAppLayoutStore.getState().module?.id).toBe(101);
		expect(useAppLayoutStore.getState().currentSubmodule?.id).toBe(1010);
		expect(appNavigate).toHaveBeenCalledOnce();
	});

	it('resolves agency, subagency and descendants from the tree selection and navigates to home', () => {
		const appNavigate = vi.fn();
		useAppLayoutStore.getState().setPermissions(permissions);
		render(<ControlSubAgencySelectorUI menuItemsNavigate={appNavigate} />);

		fireEvent.change(firstSelector(), {
			target: { value: 'subagency-1-11' },
		});

		expect(useAppLayoutStore.getState().agency?.id).toBe(1);
		expect(useAppLayoutStore.getState().subAgency?.id).toBe(11);
		expect(useAppLayoutStore.getState().module?.id).toBe(110);
		expect(useAppLayoutStore.getState().currentSubmodule?.id).toBe(1100);
		expect(appNavigate).toHaveBeenCalledOnce();
		expect(appNavigate).toHaveBeenCalledWith(expect.objectContaining({ path: '/home' }));
	});

	it('supports agency without subagencies, cascades module/submodule and navigates to home', () => {
		const appNavigate = vi.fn();
		const agencyOne: IAgency = {
			id: 1,
			name: 'Cuenca',
			modules: [
				{
					id: 100,
					name: 'Module 100',
					icon: '',
					submodules: [{ id: 1000, name: 'Submodule 1000', icon: '', programs: [] }],
				},
			],
		};
		const agencyWithoutSubAgencies: IAgency = {
			id: 2,
			name: 'Quito',
			modules: [
				{
					id: 200,
					name: 'Module 200',
					icon: '',
					submodules: [{ id: 2000, name: 'Submodule 2000', icon: '', programs: [] }],
				},
			],
		};
		useAppLayoutStore.getState().setPermissions({ agencies: [agencyOne, agencyWithoutSubAgencies] });
		render(<ControlSubAgencySelectorUI menuItemsNavigate={appNavigate} />);

		fireEvent.change(firstSelector(), {
			target: { value: 'agency-2' },
		});

		expect(useAppLayoutStore.getState().agency?.id).toBe(2);
		expect(useAppLayoutStore.getState().subAgency?.id).toBe(2);
		expect(useAppLayoutStore.getState().module?.id).toBe(200);
		expect(useAppLayoutStore.getState().currentSubmodule?.id).toBe(2000);
		expect(appNavigate).toHaveBeenCalledOnce();
		expect(appNavigate).toHaveBeenCalledWith(expect.objectContaining({ path: '/home' }));
	});
});
