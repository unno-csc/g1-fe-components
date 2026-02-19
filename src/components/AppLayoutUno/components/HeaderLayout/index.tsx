import { ActiveNotificationIcon, NotificationIcon, PinIcon, UserIcon } from '@/assets/icons';
import { imageItsaLogo } from '@/assets/images';
import { DropdownCustomLabel } from '@/components/DropdownCustomLabel';
import { DropdownIcon } from '@/components/DropdownIcon';
import { useSidebarStore } from '@/hooks';
import { ISelectOptionDropdownButton } from '@/interfaces';
import { useViewportStore } from '@/store';
import { useAppLayoutStore } from '@/store/appLayout.store';
import { MenuUnfoldOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Dropdown, MenuProps } from 'antd';

export interface HeaderLayoutProps {
	loadingHeader: boolean;
	notifications?: MenuProps;
	userActions?: MenuProps;
}

export const HeaderLayout = ({
	loadingHeader,
	notifications = { items: [] },
	userActions = { items: [] }
}: HeaderLayoutProps) => {
	const { width } = useViewportStore();
	const { setCurrentModule, setCurrentAgency } = useAppLayoutStore();
	const { collapsed, setCollapsed } = useSidebarStore();
	const { agencies } = useAppLayoutStore();
	const { currentAgency } = useAppLayoutStore();
	const { currentModule } = useAppLayoutStore();
	const { modulesAgency } = useAppLayoutStore();
	const { userName } = useAppLayoutStore();
	const { userRole } = useAppLayoutStore();

	const isActiveNotifications = Boolean(notifications?.items?.length);
	const isActiveUserActions = Boolean(userActions?.items?.length);

	const modulesData: ISelectOptionDropdownButton = {
		items: modulesAgency.map(m => ({
			key: m.id.toString(),
			label: m.name,
			onClick: (id: string) => handleSetCurrentModule(id),
		})),
	};

	const agenciesData: ISelectOptionDropdownButton = {
		items: agencies.map(a => ({
			key: a.id.toString(),
			label: a.name,
			onClick: (id: string) => handleSetCurrentAgency(id),
		})),
	};

	const handleSetCurrentModule = (moduleId: string) => {
		const module = modulesAgency.find(m => m.id.toString() === moduleId);
		if (module) {
			setCurrentModule(module);
		}
	};

	const handleSetCurrentAgency = (agencyId: string) => {
		const agency = agencies.find(a => a.id.toString() === agencyId);
		if (agency) {
			setCurrentAgency(agency);
		}
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
					{width > 768 && (
						<img
							src={imageItsaLogo}
							alt="logo"
							className="h-full max-h-12 max-w-[150px] object-cover"
						/>
					)}
				</div>
				<div className="flex flex-row w-auto items-center gap-4">
					{/* Vista Móvil (solo iconos) */}
						<div className="flex tablet:hidden flex-row items-center gap-4">
							<DropdownIcon
								options={modulesData}
								loading={loadingHeader}
								icon={<SettingOutlined className="text-yellow-500 w-4 h-4" />}
								onChange={handleSetCurrentModule}
							/>
							<DropdownIcon
								options={agenciesData}
								loading={loadingHeader}
								icon={<PinIcon style={{ stroke: '#EAB308' }} className="w-4 h-4" />}
								onChange={handleSetCurrentAgency}
							/>
						</div>

					{/* Vista Desktop (custom labels) */}
					<div className="hidden tablet:flex flex-row items-center gap-4">
						<DropdownCustomLabel
							defaultValue={currentModule?.id?.toString()}
							options={modulesData}
							loading={loadingHeader}
							icon={<SettingOutlined className="text-white-100 w-4 h-4" />}
							emptyLabel="Sin módulos asignados"
							onChange={handleSetCurrentModule}
						/>
						<DropdownCustomLabel
							defaultValue={currentAgency?.id?.toString()}
							options={agenciesData}
							loading={loadingHeader}
							icon={<PinIcon className="text-white-100 w-4 h-4" />}
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
					<Dropdown menu={userActions || { items: [] }} placement="bottomRight" disabled={!isActiveUserActions}>
						<Button type="text" icon={<UserIcon className="text-white-100 w-6 h-6" />} />
					</Dropdown>
					<Dropdown menu={notifications || { items: [] }} placement="bottomRight" disabled={!isActiveNotifications}>
						<Button
							type="text"
							icon={
								isActiveNotifications ? (
									<ActiveNotificationIcon className="fill-white-100 w-6 h-6" />
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
