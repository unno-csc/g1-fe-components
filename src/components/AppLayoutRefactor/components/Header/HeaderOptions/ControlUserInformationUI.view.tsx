import { UserIcon } from '@/assets/icons';
import { USER_INFO_WRAPPER_CLASSNAME } from '@/constants';
import { Button, Dropdown, MenuProps, Tooltip } from 'antd';
import { useAppLayoutStore } from '../../store';
import { LogoutOutlined } from '@ant-design/icons';

export interface ControlUserInformationUIProps {
	onCloseSession: () => void;
	userActions: MenuProps;
}

export const ControlUserInformationUI = ({ userActions = { items: [] }, onCloseSession }: ControlUserInformationUIProps) => {
	const { userInformation, module } = useAppLayoutStore();
	const roles = userInformation?.roles ?? [];
	const userName = userInformation?.name ?? 'Usuario';
	const roleName = module
		? roles.find(role => role.moduleId === module.id)?.name ?? 'Sin rol específico'
		: roles[0]?.name ?? 'Sin rol específico';

	const newUserActions: MenuProps = {
		...userActions,
		items: [
			...(userActions.items ?? []),
			{
				key: 'close-session',
				label: 'Cerrar sesión',
				danger: true,
				onClick: onCloseSession,
				icon: <LogoutOutlined />,
			},
		],
	};

	return (
		<div className="flex min-w-0 shrink items-center md:gap-1">
			<div className={USER_INFO_WRAPPER_CLASSNAME}>
				<Tooltip title={userName} placement="bottom">
					<strong className="block truncate whitespace-nowrap text-xs leading-tight text-white-100 cursor-pointer" title={userName}>
						{userName}
					</strong>
				</Tooltip>
				<div className="min-w-0 w-fit max-w-full overflow-hidden rounded border-solid border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 flex items-start justify-start">
					<span className=" block truncate text-end text-[11px] font-semibold leading-tight text-amber-400/90" title={roleName}>
						{roleName}
					</span>
				</div>
			</div>
			<Dropdown menu={newUserActions} placement="bottomRight">
				<Button type="text" size="small" icon={<UserIcon className="h-5 w-5 text-white-100" />} />
			</Dropdown>
		</div>
	);
};