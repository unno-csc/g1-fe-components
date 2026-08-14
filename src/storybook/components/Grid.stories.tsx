import React from 'react';
import type { StoryObj } from '@storybook/react';
import { Grid, useBreakpoint } from '../../components/Grid';

const meta = {
	title: 'Components/Grid',
	tags: ['autodocs'],
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Módulo `Grid` y hook `useBreakpoint` adaptados de Ant Design para el ERP Motor1.\n\nPermite consultar los breakpoints activos de la pantalla en tiempo real para adaptar layouts y componentes de forma responsiva.\n\n```tsx\nimport { Grid, useBreakpoint } from "@unno-csc/g1-fe-components";\n\n// Opción 1: Mediante objeto Grid\nconst screens = Grid.useBreakpoint();\nconst isMdUp = screens.md ?? true;\n\n// Opción 2: Mediante hook directo\nconst screens = useBreakpoint();\n```',
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

// Componente demostrativo para renderizar en Storybook
const BreakpointsDemo = () => {
	const screens = Grid.useBreakpoint();
	const isMdUp = screens.md ?? true;

	const breakpointsList: Array<keyof typeof screens> = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

	return (
		<div className="flex flex-col gap-6 p-4 max-w-2xl bg-white-100 rounded-lg border border-gray-100 shadow-sm">
			<div>
				<h3 className="text-lg font-bold text-gray-900">Estado de Breakpoints en Tiempo Real</h3>
				<p className="text-sm text-gray-600 mt-1">
					Redimensiona la ventana del navegador para observar cómo cambian los valores reactivamente.
				</p>
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
				{breakpointsList.map(bp => {
					const isActive = Boolean(screens[bp]);
					return (
						<div
							key={bp}
							className={`p-3 rounded-md border text-center transition-all ${
								isActive
									? 'bg-primary-50 border-primary-400 text-primary-600 font-semibold shadow-xs'
									: 'bg-gray-50 border-gray-100 text-gray-400'
							}`}
						>
							<span className="text-xs uppercase tracking-wider block text-gray-500">Breakpoint</span>
							<span className="text-base uppercase">{bp}</span>
							<span className="text-xs block mt-1">
								{isActive ? 'Activo (true)' : 'Inactivo (false)'}
							</span>
						</div>
					);
				})}
			</div>

			<div className="p-4 rounded-md bg-gray-50 border border-gray-150">
				<h4 className="text-sm font-semibold text-gray-800">Evaluación Condicional Responsiva</h4>
				<div className="mt-2 flex items-center gap-2">
					<span className="text-sm text-gray-600">
						`const isMdUp = screens.md ?? true;` &rarr;
					</span>
					<span
						className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
							isMdUp ? 'bg-success text-white-100' : 'bg-warning text-gray-900'
						}`}
					>
						{isMdUp ? 'Escritorio / Tablet (MD o superior)' : 'Móvil (< MD)'}
					</span>
				</div>
			</div>
		</div>
	);
};

export const Default: Story = {
	render: () => <BreakpointsDemo />,
};
