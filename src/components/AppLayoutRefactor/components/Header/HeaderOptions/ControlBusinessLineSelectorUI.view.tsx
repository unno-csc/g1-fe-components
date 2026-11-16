import { SettingOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import { useMemo } from 'react';
import { renderTruncatedHeaderSelectLabel } from '../utils/headerSelectLabel';
import { useAppLayoutStore } from '../../store';
import {
	HEADER_SELECT_CLASSNAME,
	MOBILE_SELECT_WRAPPER_CLASSNAME,
	MOBILE_TREE_SELECT_CLASSNAME,
	POPUP_STYLES,
	SELECT_WRAPPER_CLASSNAME,
	SELECT_WRAPPER_STYLE,
} from '@/constants';
import { IProgram } from '@/interfaces';

export interface ControlBusinessLineSelectorUIProps {
	loadingAppLayout: boolean;
	menuItemsNavigate: (program: IProgram) => void;
}

export const ControlBusinessLineSelectorUI = ({
	loadingAppLayout = false,
	menuItemsNavigate,
}: ControlBusinessLineSelectorUIProps) => {
	const { subAgency, module, selectModule } = useAppLayoutStore();

	const modulesAgency = useMemo(() => subAgency?.modules ?? [], [subAgency]);

	const moduleOptions = useMemo(
		() =>
			modulesAgency.map(mod => ({
				value: mod.id.toString(),
				label: mod.name,
			})),
		[modulesAgency],
	);

	const onSelect = (moduleId: string) => {
		selectModule(Number(moduleId));
		const homeProgram: IProgram = {
			id: 0,
			name: 'Home',
			path: '/home',
			icon: 'home',
			root: true,
			roleId: 0,
		};
		menuItemsNavigate(homeProgram);
	};

	const currentModuleValue = module !== undefined ? String(module.id) : undefined;
	const currentModuleLabel = module?.name ?? 'Línea de negocio';

	const selectProps = {
		options: moduleOptions,
		onChange: onSelect,
		value: currentModuleValue,
		size: 'middle' as const,
		loading: loadingAppLayout,
		popupMatchSelectWidth: false,
		styles: POPUP_STYLES,
	};

	return (
		<>
			<div className={`hidden md:block ${SELECT_WRAPPER_CLASSNAME}`} style={SELECT_WRAPPER_STYLE}>
				<Select
					{...selectProps}
					placeholder="Sin módulos asignados"
					className={HEADER_SELECT_CLASSNAME}
					labelRender={renderTruncatedHeaderSelectLabel}
				/>
			</div>

			<div className={MOBILE_SELECT_WRAPPER_CLASSNAME} title={currentModuleLabel}>
				<span
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center text-sm text-gray-700 transition-colors group-hover:text-warning group-focus-within:text-warning"
				>
					<SettingOutlined />
				</span>
				<Select {...selectProps} suffixIcon={null} placement="bottomRight" className={MOBILE_TREE_SELECT_CLASSNAME} />
			</div>
		</>
	);
};
