import { IModule, IProgram, ISubmodule } from '@/interfaces';
import { useSidebarStore } from '@/hooks';
import { ButtonActiveModule } from './ButtonActiveModule';
import { ButtonInactiveModule } from './ButtonInactiveModule';
import { useMemo, useState, useEffect, useRef } from 'react';
import { ButtonAntd } from '@/components/ButtonAntd';
import { ButtonActiveSubmodule } from './ButtonActiveSubmodule';
import { ButtonInactiveSubmodule } from './ButtonInactiveSubmodule';
import { Input } from 'antd';
import { getIcon } from '@/helpers/menu/menuDataTransformer';
import { RightOutlined, SearchOutlined, SettingOutlined, DownOutlined } from '@ant-design/icons';
import { useAppLayoutStore } from '@/store';

export interface IHomeProps {
	handleNavigateProgram: (program: IProgram) => void;
}

export const Home = ({ handleNavigateProgram }: IHomeProps) => {
	const collapsed = useSidebarStore(state => state.collapsed);
	const currentModule = useAppLayoutStore(state => state.module);
	const selectModule = useAppLayoutStore(state => state.selectModule);
	const currentSubmodule = useAppLayoutStore(state => state.currentSubmodule);
	const selectSubmodule = useAppLayoutStore(state => state.selectSubmodule);
	const subAgency = useAppLayoutStore(state => state.subAgency);
	const modules = subAgency?.modules ?? [];
	const submodules = currentModule?.submodules ?? [];
	const [searchBySubmoduleId, setSearchBySubmoduleId] = useState<Record<ISubmodule['id'], string>>({});
	const [openGroupIds, setOpenGroupIds] = useState<Record<ISubmodule['id'], Record<string | number, boolean>>>({});
	const tabsContainerRef = useRef<HTMLDivElement | null>(null);
	const tabRefs = useRef<Record<ISubmodule['id'], HTMLDivElement | null>>({});
	const [indicator, setIndicator] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
	const recomputeIndicator = () => {
		if (!currentSubmodule) return;
		const el = tabRefs.current[currentSubmodule.id];
		const container = tabsContainerRef.current;
		if (!el || !container) return;
		setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
	};

	useEffect(() => {
		// Usar un timeout para asegurar que el DOM se actualice completamente
		const timer = setTimeout(() => {
			recomputeIndicator();
		}, 100);
		
		const onResize = () => {
			setTimeout(() => recomputeIndicator(), 0);
		};
		
		window.addEventListener('resize', onResize);
		return () => {
			window.removeEventListener('resize', onResize);
			clearTimeout(timer);
		};
	}, [currentSubmodule, submodules, collapsed]);

	const buttonHeader = (module: IModule) => {
		if (module.id === currentModule?.id) {
			return <ButtonActiveModule name={module.name} icon={module.icon} onclick={() => selectModule(module.id)} />;
		}

		return <ButtonInactiveModule name={module.name} icon={module.icon} onclick={() => selectModule(module.id)} />;
	};

	const uniqueById = <T extends { id: number },>(items: T[] = []) => {
		const seen = new Set<number>();
		return items.filter(item => {
			if (seen.has(item.id)) return false;
			seen.add(item.id);
			return true;
		});
	};

	const programs = (programs: IProgram[], isNested = false) => {
		const paddingClass = isNested ? 'pl-2 sm:pl-3' : '';
		return programs.map(program => {
			const iconNode = program.icon
				? getIcon(program.icon, 'w-4 h-4 sm:w-5 sm:h-5 text-gray-600')
				: <span className="inline-block w-4 h-4 sm:w-5 sm:h-5 rounded-sm bg-gray-100 border border-gray-300" />;
			return (
				<div key={`${isNested ? 'nested' : 'root'}-${program.id}`} className={`${paddingClass} border-b border-gray-200 last:border-b-0`}>
					<ButtonAntd
						type="text"
						size="small"
						className="group flex items-center justify-start w-full gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 !h-auto !border-b-1 !border-b-gray-200 !bg-transparent hover:!bg-gray-50 rounded-none shadow-none"
						onClick={() => handleNavigateProgram(program)}
					>
						<span className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 text-gray-700">
							{iconNode}
						</span>
						<span className="text-xs sm:text-sm text-gray-800 truncate">{program.name}</span>
					</ButtonAntd>
				</div>
			);
		});
	};

	const groups = (groups: ISubmodule[]) => {
		return groups.map((group, idx) => {
			const subId = currentSubmodule?.id;
			const open = subId !== undefined ? (openGroupIds[subId]?.[group.id] ?? idx === 0) : idx === 0;
			const toggle = () => {
				if (subId === undefined) return;
				setOpenGroupIds(prev => ({
					...prev,
					[subId]: {
						...(prev[subId] ?? {}),
						[group.id]: !open,
					},
				}));
			};
			return (
				<div key={group.id}>
					<ButtonAntd
						type="text"
						size="small"
						className="w-full flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 border border-gray-100 rounded-md"
						onClick={toggle}
					>
						<div className="flex items-center gap-1.5 sm:gap-2 text-gray-800">
							<SettingOutlined className="text-gray-600 text-xs sm:text-sm" />
							<strong className="text-xs sm:text-sm">{group.name}</strong>
						</div>
						{open ? (
							<DownOutlined className="text-gray-400 text-[10px] sm:text-xs" />
						) : (
							<RightOutlined className="text-gray-400 text-[10px] sm:text-xs" />
						)}
					</ButtonAntd>
					{open && <div className="pt-0.5 sm:pt-1 pb-1 sm:pb-2">{programs(uniqueById(group.programs ?? []), true)}</div>}
				</div>
			);
		});
	};

	const filterRootPrograms = (items: IProgram[] = []) => {
		return items.filter(program => Boolean(program && program.root !== false));
	};

	const contentSubmodule = (submodule: ISubmodule) => {
		const query = (searchBySubmoduleId[submodule.id] ?? '').toLowerCase().trim();
		const basePrograms = filterRootPrograms(submodule.programs ?? []);
		const baseGroups = (submodule.groups ?? []).map(group => ({
			...group,
			programs: filterRootPrograms(group.programs ?? []),
		}));

		const visiblePrograms = query
			? basePrograms.filter(program => program.name.toLowerCase().includes(query))
			: basePrograms;

		const visibleProgramsUnique = uniqueById(visiblePrograms);

		const visibleGroups = query
			? baseGroups
					.map(group => {
						const groupMatches = group.name.toLowerCase().includes(query);
						const filteredGroupPrograms = (group.programs ?? []).filter(p => p.name.toLowerCase().includes(query));
						return groupMatches ? { ...group, programs: uniqueById(group.programs ?? []) } : { ...group, programs: uniqueById(filteredGroupPrograms) };
					})
					.filter(group => group.name.toLowerCase().includes(query) || (group.programs?.length ?? 0) > 0)
			: baseGroups;

		const groupedIds = new Set<IProgram['id']>();
		visibleGroups.forEach(group => group.programs.forEach(program => groupedIds.add(program.id)));
		const visibleProgramsDedup = visibleProgramsUnique.filter(program => !groupedIds.has(program.id));

		return (
			<div className="flex-1 p-1 sm:p-2 min-h-0 h-full w-full overflow-y-auto">
				<div className="space-y-0.5 sm:space-y-1">
					<div>{programs(visibleProgramsDedup)}</div>
					<div>{groups(visibleGroups)}</div>
				</div>
			</div>
		);
	};

	const buttonSubmodule = (submodule: ISubmodule) => {
		if (submodule.id === currentSubmodule?.id) {
			return (
				<ButtonActiveSubmodule
					name={submodule.name}
					icon={submodule.icon ?? ''}
					onclick={() => {
						selectSubmodule(submodule.id);
					}}
				/>
			);
		}
		return (
			<ButtonInactiveSubmodule
				name={submodule.name}
				icon={submodule.icon ?? ''}
				onclick={() => {
					selectSubmodule(submodule.id);
				}}
			/>
		);
	};

	const titlePopover = (submodule: ISubmodule) => {
		return (
			<div className="w-full">
				<Input
					placeholder="Buscar Módulo"
					allowClear
					suffix={<SearchOutlined className="text-gray-400" />}
					value={searchBySubmoduleId[submodule.id] ?? ''}
					onChange={e => setSearchBySubmoduleId(prev => ({ ...prev, [submodule.id]: e.target.value }))}
				/>
			</div>
		);
	};

	const currentSubmoduleContent = useMemo(() => {
		if (!currentSubmodule) return null;
		return contentSubmodule(currentSubmodule);
	}, [currentSubmodule, submodules, openGroupIds, searchBySubmoduleId]);

	return (
		<div className="flex-1 h-full w-full flex flex-col">
			<div className="w-full">
				<div className="flex flex-col w-full overflow-x-auto overflow-y-hidden">
					<div className="flex flex-row flex-wrap gap-1.5 sm:gap-2 md:!gap-3 lg:!gap-4 justify-center py-3 sm:py-3 px-2">
						{modules.map(module => (
							<div key={module.id}>{buttonHeader(module)}</div>
						))}
					</div>
				</div>
			</div>

			<div className="w-full pt-1 sm:pt-2">
				<div
					onScroll={recomputeIndicator}
					className="w-full overflow-x-auto"
				>
					<div
						ref={tabsContainerRef}
						className="relative flex flex-row flex-nowrap justify-center items-center min-w-full w-max px-2 pb-1"
					>
						{submodules.map(submodule => (
							<div
								key={submodule.id}
								ref={el => (tabRefs.current[submodule.id] = el)}
								className="shrink-0"
							>
								{buttonSubmodule(submodule)}
							</div>
						))}
						<div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[1px] bg-gray-200 z-0" />
						<div
							className="pointer-events-none absolute bottom-0 h-[2px] bg-primary-700 transition-all duration-300 ease-out z-10"
							style={{ left: indicator.left, width: indicator.width }}
						/>
					</div>
				</div>
			</div>

			<div className="w-full border-t border-gray-200 flex-1 flex flex-col min-h-0">
				<div className="mt-1.5 sm:mt-2 px-1 sm:px-0">{currentSubmodule && titlePopover(currentSubmodule)}</div>

				<div className="flex-1 min-h-0 w-full pt-1.5 sm:pt-2 pb-1 sm:pb-2 overflow-y-auto">
					<div className="flex-1 min-h-0">{currentSubmoduleContent}</div>
				</div>
			</div>
		</div>
	);
};
