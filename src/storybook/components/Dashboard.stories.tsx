import type { Decorator, StoryObj } from '@storybook/react';
import { Dashboard } from '../../components/Dashboard';
import { AppLayout } from '../../components/AppLayoutRefactor';
import { useAppLayoutStore } from '../../store';
import { PERMISSIONS_MOCK } from '../../components/AppLayoutRefactor/mocks/permissions.mock';
import { useEffect } from 'react';

const meta = {
	title: 'Components/Dashboard',
	component: Dashboard,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: 'Dashboard principal con navegación por módulos, submódulos y programas. Incluye búsqueda contextual, agrupación de programas, y prevención de duplicados.',
			},
		},
	},
	argTypes: {
		handleNavigateProgram: {
			description: 'Función llamada cuando se selecciona un programa',
			action: 'program-selected',
		},
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

const withRealData: Decorator = (Story) => {
	const setPermissions = useAppLayoutStore(state => state.setPermissions);

	useEffect(() => {
		setPermissions(PERMISSIONS_MOCK);
	}, [setPermissions]);

	return <Story />;
};

export const Default: Story = {
	decorators: [withRealData],
	args: {
		handleNavigateProgram: () => {},
	},
	parameters: {
		docs: {
			description: {
				story: 'Dashboard con datos reales de la agencia CUENCA. Navega entre VEHÍCULOS > MANTENIMIENTOS para ver grupos expandibles y programas. Incluye deduplicación automática y estilos refinados.',
			},
		},
	},
};

export const Empty: Story = {
	args: {
		handleNavigateProgram: () => {},
	},
	parameters: {
		docs: {
			description: {
				story: 'Dashboard sin datos - estado inicial cuando no hay agencia seleccionada.',
			},
		},
	},
};

export const WithinAppLayout: Story = {
	decorators: [withRealData],
	args: {
		handleNavigateProgram: () => {},
	},
	render: (args) => {
		return (
			<AppLayout
				optionsCompany={[]}
				loadingAppLayout={false}
				onCloseSession={() => {}}
				menuItemsNavigate={args.handleNavigateProgram}
				userActions={{ items: [] }}
			>
				<Dashboard {...args} />
			</AppLayout>
		);
	},
	parameters: {
		docs: {
			description: {
				story: 'Dashboard renderizado dentro del AppLayout completo, mostrando cómo se ve en el contexto real de la aplicación con sidebar, header y toda la estructura.',
			},
		},
	},
};
