import React, { useEffect, useState } from 'react';
import type { StoryObj } from '@storybook/react';
import { Title } from '../../components/Title';

type PackageJson = {
	name?: string;
	version?: string;
	description?: string;
	repository?: { url?: string } | string;
	homepage?: string;
};

const meta = {
	title: 'Version',
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: 'Detalle de la versión actual del paquete.'
			}
		}
	}
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Inicio: Story = {
	render: () => {
		const [info, setInfo] = useState<PackageJson | null>(null);
		useEffect(() => {
			(async () => {
				try {
					const mod = await import('../../../package.json');
					// Vite returns the JSON object directly; some toolchains use default
					const data = (mod as any).default ?? (mod as any);
					setInfo(data as PackageJson);
				} catch {
					setInfo({ name: '@unno-csc/g1-fe-components', version: 'desconocida' });
				}
			})();
		}, []);

		const repositoryUrl = typeof info?.repository === 'string' ? (info?.repository as string) : info?.repository?.url;

		return (
			<div className="max-w-xl w-full p-6 rounded-lg border border-gray-200 bg-white shadow-sm text-gray-800">
				<h2 className="text-xl font-semibold mb-2">{info?.name ?? 'Cargando…'}</h2>
				<div className="space-y-2">
					<div>
						<Title title={`Versión: ${info?.version ?? 'Cargando…'}`} level={4} />
						<Title title={'Instalación:'} type='secondary' level={4} />
						<Title title={'yarn add @unno-csc/g1-fe-components@latest'} level={4} />
					</div>
					
				</div>
			</div>
		);
	}
};


