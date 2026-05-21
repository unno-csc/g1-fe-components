import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import { HeaderLayout, HeaderLayoutProps } from '../../components/AppLayout/components/HeaderLayout';
import { IAgency, IModule, IUserRole } from '../../interfaces';

// Mock localStorage
const localStorageMock = (() => {
	let store: Record<string, string> = {};
	return {
		getItem: vi.fn((key: string) => store[key] || null),
		setItem: vi.fn((key: string, value: string) => {
			store[key] = value;
		}),
		removeItem: vi.fn((key: string) => {
			delete store[key];
		}),
		clear: vi.fn(() => {
			store = {};
		}),
	};
})();

Object.defineProperty(window, 'localStorage', {
	value: localStorageMock,
});

vi.mock('../../assets/images', () => ({
	logoMotorsBlanco: 'test-motor-logo.png',
}));

vi.mock('../../hooks/useEnvironment', () => ({
	useEnvironment: vi.fn(() => 'PRODUCCION'),
}));

vi.mock('@ant-design/icons', () => ({
	MenuUnfoldOutlined: () => <span data-testid="menu-unfold-icon" />,
	SettingOutlined: () => <span data-testid="setting-icon" />,
}));

// Mock stores
const mockAppLayoutStore = {
	currentAgency: undefined as IAgency | undefined,
	currentModule: undefined as IModule | undefined,
	agencies: [] as IAgency[],
	modulesAgency: [] as IModule[],
	userName: undefined as string | undefined,
	userRole: undefined as IUserRole | undefined,
	setCurrentModule: vi.fn(),
	setCurrentAgency: vi.fn(),
	setModulesAgency: vi.fn(),
	setSubmodulesAgency: vi.fn(),
	setCurrentSubmodule: vi.fn(),
	setAgencies: vi.fn(),
};

const mockSidebarStore = {
	collapsed: false,
	setCollapsed: vi.fn(),
	searchTerm: '',
	setSearchTerm: vi.fn(),
	openKeys: [],
	setOpenKeys: vi.fn(),
};

vi.mock('../../store/appLayout.store', () => ({
	useAppLayoutStore: () => mockAppLayoutStore,
}));

vi.mock('../../hooks', () => ({
	useSidebarStore: () => mockSidebarStore,
}));

// Mock para los iconos SVG
vi.mock('../../assets/icons', async (importOriginal) => {
	const actual = await importOriginal<any>();
	return {
		...actual,
		ActiveNotificationIcon: ({ className, ...props }: any) => (
			<div data-testid="active-notification-icon" className={className} {...props}>
				ActiveNotificationIcon
			</div>
		),
		NotificationIcon: ({ className, ...props }: any) => (
			<div data-testid="notification-icon" className={className} {...props}>
				NotificationIcon
			</div>
		),
		PinIcon: ({ className, ...props }: any) => (
			<div data-testid="pin-icon" className={className} {...props}>
				PinIcon
			</div>
		),
		UserIcon: ({ className, ...props }: any) => (
			<div data-testid="user-icon" className={className} {...props}>
				UserIcon
			</div>
		),
	};
});

// Mock para componentes
vi.mock('../../components/DropdownCustomLabel', () => ({
	DropdownCustomLabel: (props: any) => (
		<div
			data-testid="dropdown-custom-label"
			data-props={JSON.stringify({
				defaultValue: props.defaultValue,
				options: props.options,
				loading: props.loading,
				emptyLabel: props.emptyLabel,
				icon: props.icon ? 'ReactElement' : undefined,
			})}
			onClick={() => props.onChange && props.onChange('test-id')}
		>
			DropdownCustomLabel Mock - {props.emptyLabel}
		</div>
	),
}));

vi.mock('../../components/DropdownIcon', () => ({
	DropdownIcon: (props: any) => (
		<div
			data-testid="dropdown-icon"
			data-props={JSON.stringify({
				options: props.options,
				loading: props.loading,
				icon: props.icon ? 'ReactElement' : undefined,
			})}
			onClick={() => props.onChange && props.onChange('test-id')}
		>
			DropdownIcon Mock
		</div>
	),
}));

// Mock antd components
vi.mock('antd', async () => {
	const actual = await vi.importActual<any>('antd');
	return {
		...actual,
		Button: (props: any) => (
			<button
				data-testid="antd-button"
				onClick={props.onClick}
				type={props.type}
				disabled={props.disabled}
			>
				{props.icon}
				{props.children}
			</button>
		),
		Dropdown: (props: any) => {
			const safeMenu = props.menu
				? {
						items: props.menu.items || [],
						onClick: props.menu.onClick ? 'function' : undefined,
					}
				: { items: [] };

			return (
				<div
					data-testid="dropdown"
					data-props={JSON.stringify({
						menu: safeMenu,
						placement: props.placement,
						disabled: props.disabled,
					})}
				>
					{props.children}
				</div>
			);
		},
	};
});

describe('HeaderLayout', () => {
	const mockAgencies: IAgency[] = [
		{
			id: 1,
			name: 'Agencia Principal',
			modules: [
				{
					id: 10,
					name: 'Módulo Ventas',
					icon: 'shop',
					entorno: 'production',
					submodules: [],
				},
			],
		},
		{
			id: 2,
			name: 'Agencia Secundaria',
			modules: [
				{
					id: 20,
					name: 'Módulo Compras',
					icon: 'cart',
					entorno: 'production',
					submodules: [],
				},
			],
		},
	];

	const mockModules: IModule[] = [
		{
			id: 10,
			name: 'Módulo Ventas',
			icon: 'shop',
			entorno: 'production',
			submodules: [],
		},
		{
			id: 11,
			name: 'Módulo Inventario',
			icon: 'inventory',
			entorno: 'production',
			submodules: [],
		},
	];

	const defaultProps: HeaderLayoutProps = {
		loadingAppLayout: false,
		navigateApp: vi.fn(),
		notifications: {
			items: [{ key: 'n1', label: 'Nueva notificación' }],
		},
		userActions: {
			items: [
				{ key: 'u1', label: 'Perfil' },
				{ key: 'u2', label: 'Cerrar sesión' },
			],
		},
	};

	beforeEach(() => {
		vi.clearAllMocks();
		localStorageMock.clear();

		// Reset store values
		mockAppLayoutStore.currentAgency = undefined;
		mockAppLayoutStore.currentModule = undefined;
		mockAppLayoutStore.agencies = [];
		mockAppLayoutStore.modulesAgency = [];
		mockAppLayoutStore.userName = undefined;
		mockAppLayoutStore.userRole = undefined;

		mockSidebarStore.collapsed = false;
	});

	it('should render correctly with basic props', () => {
		const { container } = render(<HeaderLayout {...defaultProps} />);

		expect(screen.getByAltText('logo')).toBeInTheDocument();
		expect(screen.getByTestId('user-icon')).toBeInTheDocument();
		expect(screen.getByTestId('active-notification-icon')).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it('should display company logo from static import', () => {
		render(<HeaderLayout {...defaultProps} />);

		const logo = screen.getByAltText('logo');
		expect(logo).toHaveAttribute('src', 'test-motor-logo.png');
		expect(logo).toHaveAttribute('alt', 'logo');
	});

	it('should not show menu unfold button when sidebar is not collapsed', () => {
		mockSidebarStore.collapsed = false;
		render(<HeaderLayout {...defaultProps} />);

		const buttons = screen.getAllByTestId('antd-button');
		// Solo deberían estar los botones de user y notification dropdowns
		expect(buttons).toHaveLength(2);
	});

	it('should show menu unfold button when sidebar is collapsed', () => {
		mockSidebarStore.collapsed = true;
		render(<HeaderLayout {...defaultProps} />);

		const buttons = screen.getAllByTestId('antd-button');
		// Debería haber 3 botones: unfold, user dropdown, notification dropdown
		expect(buttons).toHaveLength(3);
	});

	it('should call setCollapsed when unfold button is clicked', () => {
		mockSidebarStore.collapsed = true;
		render(<HeaderLayout {...defaultProps} />);

		const unfoldButton = screen.getAllByTestId('antd-button')[0];
		fireEvent.click(unfoldButton);

		expect(mockSidebarStore.setCollapsed).toHaveBeenCalledWith(false);
	});

	it('should render active notification icon when notifications are present', () => {
		render(<HeaderLayout {...defaultProps} />);

		expect(screen.getByTestId('active-notification-icon')).toBeInTheDocument();
		expect(screen.queryByTestId('notification-icon')).not.toBeInTheDocument();
	});

	it('should render inactive notification icon when no notifications', () => {
		const propsWithoutNotifications = {
			...defaultProps,
			notifications: { items: [] },
		};

		render(<HeaderLayout {...propsWithoutNotifications} />);

		expect(screen.getByTestId('notification-icon')).toBeInTheDocument();
		expect(screen.queryByTestId('active-notification-icon')).not.toBeInTheDocument();
	});

	it('should render inactive notification icon when notifications is undefined', () => {
		const propsWithoutNotifications = {
			...defaultProps,
			notifications: undefined,
		};

		render(<HeaderLayout {...propsWithoutNotifications} />);

		expect(screen.getByTestId('notification-icon')).toBeInTheDocument();
		expect(screen.queryByTestId('active-notification-icon')).not.toBeInTheDocument();
	});

	it('should render user actions dropdown correctly', () => {
		render(<HeaderLayout {...defaultProps} />);

		const dropdowns = screen.getAllByTestId('dropdown');
		const userActionsDropdown = dropdowns[0];
		const userActionsProps = JSON.parse(userActionsDropdown.getAttribute('data-props') || '{}');

		expect(userActionsProps.menu.items).toHaveLength(2);
		expect(userActionsProps.disabled).toBe(false);
		expect(userActionsProps.placement).toBe('bottomRight');
	});

	it('should render notifications dropdown correctly', () => {
		render(<HeaderLayout {...defaultProps} />);

		const dropdowns = screen.getAllByTestId('dropdown');
		const notificationsDropdown = dropdowns[1];
		const notificationsProps = JSON.parse(notificationsDropdown.getAttribute('data-props') || '{}');

		expect(notificationsProps.menu.items).toHaveLength(1);
		expect(notificationsProps.disabled).toBe(false);
		expect(notificationsProps.placement).toBe('bottomRight');
	});

	it('should disable user actions dropdown when no items', () => {
		const propsWithEmptyUserActions = {
			...defaultProps,
			userActions: { items: [] },
		};

		render(<HeaderLayout {...propsWithEmptyUserActions} />);

		const dropdowns = screen.getAllByTestId('dropdown');
		const userActionsDropdown = dropdowns[0];
		const userActionsProps = JSON.parse(userActionsDropdown.getAttribute('data-props') || '{}');

		expect(userActionsProps.disabled).toBe(true);
	});

	it('should disable notifications dropdown when no items', () => {
		const propsWithEmptyNotifications = {
			...defaultProps,
			notifications: { items: [] },
		};

		render(<HeaderLayout {...propsWithEmptyNotifications} />);

		const dropdowns = screen.getAllByTestId('dropdown');
		const notificationsDropdown = dropdowns[1];
		const notificationsProps = JSON.parse(notificationsDropdown.getAttribute('data-props') || '{}');

		expect(notificationsProps.disabled).toBe(true);
	});

	it('should render modules dropdown when modules are available', () => {
		mockAppLayoutStore.modulesAgency = mockModules;
		mockAppLayoutStore.currentModule = mockModules[0];

		render(<HeaderLayout {...defaultProps} />);

		const dropdownCustomLabels = screen.getAllByTestId('dropdown-custom-label');
		expect(dropdownCustomLabels).toHaveLength(2); // modules and agencies

		const moduleDropdown = dropdownCustomLabels[0];
		expect(moduleDropdown).toHaveTextContent('Sin agencias asignadas');
	});

	it('should render agencies dropdown when agencies are available', () => {
		mockAppLayoutStore.agencies = mockAgencies;
		mockAppLayoutStore.currentAgency = mockAgencies[0];

		render(<HeaderLayout {...defaultProps} />);

		const dropdownCustomLabels = screen.getAllByTestId('dropdown-custom-label');
		expect(dropdownCustomLabels).toHaveLength(2); // modules and agencies

		const agencyDropdown = dropdownCustomLabels[1];
		expect(agencyDropdown).toHaveTextContent('Sin módulos asignados');
	});

	it('should display userName and userRole when provided', () => {
		mockAppLayoutStore.userName = 'Juan Pérez';
		mockAppLayoutStore.userRole = { id: 1, code: null, name: 'Administrador', moduleId: 1 };

		render(<HeaderLayout {...defaultProps} />);

		expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
		expect(screen.getByText('Administrador')).toBeInTheDocument();
	});

	it('should display empty strings when userName and userRole are undefined', () => {
		mockAppLayoutStore.userName = undefined;
		mockAppLayoutStore.userRole = undefined;

		const { container } = render(<HeaderLayout {...defaultProps} />);

		const userNameSpan = container.querySelector('.text-4');
		const userRoleSpan = container.querySelector('.text-primary-900');

		expect(userNameSpan).toBeInTheDocument();
		expect(userRoleSpan).toBeInTheDocument();
		expect(userNameSpan?.textContent).toBe('');
		expect(userRoleSpan?.textContent).toBe('');
	});

	it('should call setCurrentModule when module dropdown changes', () => {
		mockAppLayoutStore.modulesAgency = mockModules;

		render(<HeaderLayout {...defaultProps} />);

		const moduleToSelect = mockModules[0];
		const handleSetCurrentModule = (moduleId: string) => {
			const module = mockModules.find(m => m.id.toString() === moduleId);
			if (module) {
				mockAppLayoutStore.setCurrentModule(module);
			}
		};

		handleSetCurrentModule(moduleToSelect.id.toString());

		expect(mockAppLayoutStore.setCurrentModule).toHaveBeenCalledWith(moduleToSelect);
	});

	it('should call setCurrentAgency when agency dropdown changes', () => {
		mockAppLayoutStore.agencies = mockAgencies;

		render(<HeaderLayout {...defaultProps} />);

		const agencyToSelect = mockAgencies[0];
		const handleSetCurrentAgency = (agencyId: string) => {
			const agency = mockAgencies.find(a => a.id.toString() === agencyId);
			if (agency) {
				mockAppLayoutStore.setCurrentAgency(agency);
			}
		};

		handleSetCurrentAgency(agencyToSelect.id.toString());

		expect(mockAppLayoutStore.setCurrentAgency).toHaveBeenCalledWith(agencyToSelect);
	});

	it('should render dropdown icons for small screens', () => {
		mockAppLayoutStore.modulesAgency = mockModules;
		mockAppLayoutStore.agencies = mockAgencies;

		render(<HeaderLayout {...defaultProps} />);

		const dropdownIcons = screen.getAllByTestId('dropdown-icon');
		expect(dropdownIcons).toHaveLength(2); // one for modules, one for agencies
	});

	it('should handle loading state correctly', () => {
		const loadingProps = {
			...defaultProps,
			loadingAppLayout: true,
		};

		render(<HeaderLayout {...loadingProps} />);

		const dropdownCustomLabels = screen.getAllByTestId('dropdown-custom-label');
		dropdownCustomLabels.forEach(dropdown => {
			const props = JSON.parse(dropdown.getAttribute('data-props') || '{}');
			expect(props.loading).toBe(true);
		});

		const dropdownIcons = screen.getAllByTestId('dropdown-icon');
		dropdownIcons.forEach(dropdown => {
			const props = JSON.parse(dropdown.getAttribute('data-props') || '{}');
			expect(props.loading).toBe(true);
		});
	});

	it('should use default empty menu when userActions is undefined', () => {
		const propsWithUndefinedUserActions = {
			...defaultProps,
			userActions: undefined,
		};

		render(<HeaderLayout {...propsWithUndefinedUserActions} />);

		const dropdowns = screen.getAllByTestId('dropdown');
		const userActionsDropdown = dropdowns[0];
		const userActionsProps = JSON.parse(userActionsDropdown.getAttribute('data-props') || '{}');

		expect(userActionsProps.menu.items).toHaveLength(0);
		expect(userActionsProps.disabled).toBe(true);
	});

	it('should handle module selection correctly', () => {
		const testModule = mockModules[1];
		mockAppLayoutStore.modulesAgency = mockModules;

		const handleSetCurrentModule = (moduleId: string) => {
			const module = mockModules.find(m => m.id.toString() === moduleId);
			if (module) {
				mockAppLayoutStore.setCurrentModule(module);
			}
		};

		handleSetCurrentModule('11');

		expect(mockAppLayoutStore.setCurrentModule).toHaveBeenCalledWith(testModule);
	});

	it('should handle agency selection correctly', () => {
		const testAgency = mockAgencies[1];
		mockAppLayoutStore.agencies = mockAgencies;

		const handleSetCurrentAgency = (agencyId: string) => {
			const agency = mockAgencies.find(a => a.id.toString() === agencyId);
			if (agency) {
				mockAppLayoutStore.setCurrentAgency(agency);
			}
		};

		handleSetCurrentAgency('2');

		expect(mockAppLayoutStore.setCurrentAgency).toHaveBeenCalledWith(testAgency);
	});
});
