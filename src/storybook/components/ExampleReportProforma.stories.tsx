import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ExampleReport } from '../../components/Reports/ExampleProforma/ExampleReport';

const meta: Meta<typeof ExampleReport> = {
	title: 'Components/Reports/ExampleProforma',
	component: ExampleReport,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: 'Ejemplo de reporte Proforma con header, contenido y footer.',
			},
		},
	},
};

export default meta;

type Story = StoryObj<typeof ExampleReport>;

export const Default: Story = {
	render: () => (
		<div className="h-[100vh] bg-white p-4">
			<ExampleReport />
		</div>
	),
};
