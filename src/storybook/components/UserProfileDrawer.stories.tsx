import type { StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';

import type { IUserInformation } from '../../interfaces';
import type { IUserProfileDrawerProps } from '../../components/UserProfileDrawer';
import { UserProfileDrawer } from '../../components/UserProfileDrawer';
import { useAppLayoutStore } from '../../store';

const meta = {
	title: 'Components/UserProfileDrawer',
	component: UserProfileDrawer,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: 'Component UserProfileDrawer',
			},
		},
	},
	argTypes: {},
};

export default meta;

type Story = StoryObj<typeof meta>;

const mockUserInformation: IUserInformation = {
	userId: 1,
	identification: '0102030405',
	identificationType: 'Cédula',
	name: 'María Pérez',
	picture: '',
	email: 'maria.perez@itsa.local',
	businessLines: [
		{ id: 1, name: 'Línea de negocio principal' },
		{ id: 2, name: 'Línea de negocio corporativa' },
	],
	roles: [
		{ id: 1, code: 'FO_ADMIN', name: 'Administrador Front', moduleId: 10 },
		{ id: 2, code: 'BO_USER', name: 'Usuario Back', moduleId: 20 },
	],
};

const UserProfileDrawerWithStore = (args: IUserProfileDrawerProps) => {
	const [open, setOpen] = useState(true);

	useEffect(() => {
		const previousState = useAppLayoutStore.getState();

		useAppLayoutStore.setState({
			userInformation: mockUserInformation,
			businessLineId: mockUserInformation.businessLines?.[0]?.id ?? null,
		});

		return () => {
			useAppLayoutStore.setState({
				userInformation: previousState.userInformation,
				businessLineId: previousState.businessLineId,
			});
		};
	}, []);

	return (
		<div>
			<button className="mb-3" type="button" onClick={() => setOpen(true)}>
				Abrir
			</button>
			<UserProfileDrawer {...args} open={open} onClose={() => setOpen(false)} />
		</div>
	);
};

export const Default: Story = {
	args: {
		open: true,
		onClose: () => undefined,
		isLoading: false,
		currentModuleId: 10,
		userInformation: mockUserInformation,
	},
	render: args => <UserProfileDrawerWithStore {...args} />,
};

export const Loading: Story = {
	args: {
		open: true,
		onClose: () => undefined,
		isLoading: true,
		currentModuleId: 10,
		userInformation: undefined,
	},
	render: (args) => {
		const [open, setOpen] = useState(true);
		return (
			<div>
				<button className="mb-3" type="button" onClick={() => setOpen(true)}>
					Abrir
				</button>
				<UserProfileDrawer {...args} open={open} onClose={() => setOpen(false)} />
			</div>
		);
	},
};
