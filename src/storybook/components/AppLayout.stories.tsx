import React, { useEffect } from 'react';
import type { StoryObj } from '@storybook/react';
import { AppLayout, type AppLayoutProps } from '../../components/AppLayoutRefactor';
import { useAppLayoutStore } from '../../store';
import { PERMISSIONS_MOCK } from '../../components/AppLayoutRefactor/mocks/permissions.mock';
import type { IUserInformation } from '../../interfaces';

const meta = {
	title: 'Components/AppLayout',
	component: AppLayout,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: 'Componente de layout principal de la aplicación.',
			},
		},
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

const defaultArgs: AppLayoutProps = {
	optionsCompany: [
		{
			label: 'Empresa 1',
			value: '1',
		},
		{
			label: 'Empresa 2',
			value: '2',
		},
		{
			label: 'Empresa 3',
			value: '3',
		},
	],
	loadingAppLayout: false,
	children: <div>Hello World</div>,
	onCloseSession: () => {},
	menuItemsNavigate: () => {},
	userActions: { items: [] },
};

const withPermissions = (Story: React.ComponentType) => {
	const setPermissions = useAppLayoutStore(state => state.setPermissions);
	const setUserInformation = useAppLayoutStore(state => state.setUserInformation);

	useEffect(() => {
		setPermissions(PERMISSIONS_MOCK);
		const userInfo: IUserInformation = {
			userId: 1,
			name: 'Juan Perez',
			email: 'juan.perez@example.com',
			roles: [
				{
					id: 1,
					code: 'ADMIN-LPH',
					name: 'ADMINISTRADOR LPH',
					moduleId: 30,
				},
				{
					id: 2,
					code: 'ADMIN-TESORERIA',
					name: 'ADMINISTRADOR TESORERIA',
					moduleId: 40,
				},
			],
			identification: '1234567890',
			identificationType: 'CC',
			businessLines: [{ id: 1, name: 'Business Line 1' }],
			picture: 'https://via.placeholder.com/150',
		};
		setUserInformation(userInfo);
	}, [setPermissions, setUserInformation]);

	return <Story />;
};

export const Default: Story = {
	args: defaultArgs,
};

export const WithExampleData: Story = {
	name: 'Con data de ejemplo',
	decorators: [withPermissions],
	args: defaultArgs,
	parameters: {
		docs: {
			description: {
				story: 'Carga PERMISSIONS_MOCK en el store (`permissions`). Agencia CUENCA con subagencias MATRIZ y CAPULISPAMBA.',
			},
		},
	},
};
