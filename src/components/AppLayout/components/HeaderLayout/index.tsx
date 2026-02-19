import { Button, Dropdown, MenuProps } from 'antd';
import { MenuUnfoldOutlined } from '@ant-design/icons';
import { useSidebarStore } from '@/hooks';
import { useAppLayoutStore } from '@/store';
import { logoMotorsBlanco } from '@/assets/images';
import { DropdownIcon } from '@/components/DropdownIcon';
import { ActiveNotificationIcon, NotificationIcon, PinIcon, UserIcon } from '@/assets/icons';
import { SettingOutlined } from '@ant-design/icons';
import { IAgency, ISelectOptionDropdownButton } from '@/interfaces';
import { DropdownCustomLabel } from '@/components/DropdownCustomLabel';
import { useCallback, useEffect } from 'react';
import { ELocalStorageKeys } from '@/enums';
import { getNumberFromStorage } from '@/helpers';
import { NavigateFunction } from 'react-router-dom';

export interface HeaderLayoutProps {
	loadingAppLayout: boolean;
	navigateApp: NavigateFunction;
	userActions?: MenuProps;
	notifications?: MenuProps;
}

export const HeaderLayout = ({
	loadingAppLayout,
	userActions = { items: [] },
	notifications = { items: [] },
	navigateApp,
}: HeaderLayoutProps) => {
	const { collapsed, setCollapsed } = useSidebarStore();
	const { modulesAgency } = useAppLayoutStore();
	const { agencies } = useAppLayoutStore();
	const { userRole } = useAppLayoutStore();
	const { userName } = useAppLayoutStore();
	const { currentModule } = useAppLayoutStore();
	const { currentAgency } = useAppLayoutStore();
	const { setCurrentModule, setModulesAgency, setCurrentAgency, setSubmodulesAgency, setCurrentSubmodule } =
		useAppLayoutStore();

	const redirectToHome = () => {
		navigateApp('/home');
	};

	const selectModule = (module?: (typeof modulesAgency)[number], shouldNavigate = true) => {
		if (!module) return false;
		setCurrentModule(module);
		setSubmodulesAgency(module.submodules);
		const currentSubmodule = module.submodules[0];
		if (currentSubmodule) {
			setCurrentSubmodule(currentSubmodule);
		}
		if (shouldNavigate) {
			redirectToHome();
		}
		return true;
	};

	const selectAgency = (agency?: IAgency, navigateWhenNoModule = true) => {
		if (!agency) return false;
		setCurrentAgency(agency);
		setModulesAgency(agency.modules);
		const hasModule = selectModule(agency.modules[0], false);
		if (hasModule || navigateWhenNoModule) {
			redirectToHome();
		}
		return hasModule;
	};

	const isActiveUserActions = Boolean(userActions?.items?.length);
	const isActiveNotifications = Boolean(notifications?.items?.length);

	const modulesData: ISelectOptionDropdownButton = {
		items: modulesAgency.map(m => ({
			key: m.id.toString(),
			label: m.name,
			onClick: (id: string) => selectModule(modulesAgency.find(m => m.id.toString() === id)),
		})),
	};

	const agenciesData: ISelectOptionDropdownButton = {
		items: agencies.map(a => ({
			key: a.id.toString(),
			label: a.name,
			onClick: (id: string) => selectAgency(agencies.find(a => a.id.toString() === id)),
		})),
	};

	const setModulesAgencyCallback = useCallback(
		(agencies: IAgency[]) => {
			const moduleId = getNumberFromStorage(ELocalStorageKeys.moduleId);
			if (moduleId) {
				for (const agency of agencies) {
					if (!agency.modules) continue;
					for (const module of agency.modules) {
						if (module.id === moduleId) {
							setCurrentModule(module);
							setModulesAgency(agency.modules);
							setCurrentAgency(agency);
							return;
						}
					}
				}
			} else {
				const agencyId = getNumberFromStorage(ELocalStorageKeys.agencyId);
				if (agencyId) {
					const agency = agencies.find(a => a.id === agencyId);
					if (agency) {
						setCurrentAgency(agency);
						setModulesAgency(agency.modules);
						const currentModule = agency.modules[0];
						if (currentModule) {
							setCurrentModule(currentModule);
						}
					}
				} else {
					const newAgency = agencies[0];
					if (newAgency) {
						setCurrentAgency(newAgency);
						setModulesAgency(newAgency.modules);
						const currentModule = newAgency.modules[0];
						if (currentModule) {
							setCurrentModule(currentModule);
						}
					}
				}
			}
		},
		[setCurrentModule, setModulesAgency],
	);

	useEffect(() => {
		setModulesAgencyCallback(agencies);
	}, [agencies, setModulesAgencyCallback]);

	useEffect(() => {
		if (currentAgency) {
			setModulesAgencyCallback([currentAgency]);
		}
	}, [currentAgency]);

	const handleSetCurrentModule = (moduleId: string) => {
		selectModule(modulesAgency.find(m => m.id.toString() === moduleId));
	};

	const handleSetCurrentAgency = (agencyId: string) => {
		selectAgency(agencies.find(a => a.id.toString() === agencyId), false);
	};

	return (
		<header className="h-16">
			<div className="flex flex-row text-white-100 items-center justify-between w-full rounded-xl h-16 pr-4 pl-6 bg-primary-700">
				<div className="w-full flex flex-row items-center justify-start gap-4">
						{collapsed && (
							<Button
								type="text"
								className="!bg-white-100 hover:!bg-white-100 !border-0 !shadow-none"
								icon={<MenuUnfoldOutlined className="text-white-100" />}
								onClick={() => setCollapsed(!collapsed)}
							/>
						)}
					<div className="hidden md:block">
						<img src={logoMotorsBlanco} alt="logo" className="h-full max-h-12 max-w-[150px] object-cover" />
					</div>
				</div>
				<div className="block md:hidden">
					<div className="flex flex-row items-center gap-4">
						<DropdownIcon
							options={modulesData}
							loading={loadingAppLayout}
							icon={<SettingOutlined className="text-yellow-500 w-4 h-4" />}
							onChange={handleSetCurrentModule}
						/>
						<DropdownIcon
							options={agenciesData}
							loading={loadingAppLayout}
							icon={<PinIcon style={{ stroke: '#EAB308' }} className="w-4 h-4" />}
							onChange={handleSetCurrentAgency}
						/>
					</div>
				</div>
				<div className="hidden md:block">
					<div className="flex flex-row items-center gap-4">
						<DropdownCustomLabel
							defaultValue={currentModule?.id?.toString()}
							options={modulesData}
							loading={loadingAppLayout}
							icon={<SettingOutlined className="text-yellow-500 w-4 h-4" />}
							emptyLabel="Sin módulos asignados"
							onChange={handleSetCurrentModule}
						/>
						<DropdownCustomLabel
							defaultValue={currentAgency?.id?.toString()}
							options={agenciesData}
							loading={loadingAppLayout}
							icon={<PinIcon style={{ stroke: '#EAB308' }} className="w-4 h-4" />}
							emptyLabel="Sin agencias asignadas"
							onChange={handleSetCurrentAgency}
						/>
						<div className="flex flex-col">
							<span className="text-4 whitespace-nowrap">{userName ?? ''}</span>
							<span className="text-primary-900 font-bold text-end text-xs whitespace-nowrap">
								{userRole?.name ?? ''}
							</span>
						</div>
					</div>
				</div>
				<div className="flex flex-row pl-4">
					<Dropdown menu={userActions} placement="bottomRight" disabled={!isActiveUserActions}>
						<Button type="text" icon={<UserIcon className="text-black-100 w-6 h-6" />} />
					</Dropdown>
					<Dropdown menu={notifications} placement="bottomRight" disabled={!isActiveNotifications}>
						<Button
							type="text"
							icon={
								isActiveNotifications ? (
									<ActiveNotificationIcon className="text-white-100 w-6 h-6" />
								) : (
									<NotificationIcon className="text-white-100 w-6 h-6" />
								)
							}
						/>
					</Dropdown>
				</div>
			</div>
		</header>
	);
};
