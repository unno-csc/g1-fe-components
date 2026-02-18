import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { StackedCards } from '../../components/StackedCards';

const meta: Meta<typeof StackedCards> = {
	title: 'Components/StackedCards',
	component: StackedCards,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: 'Componente de stacked cards para mostrar una lista de cards.',
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof StackedCards>;

export const Default: Story = {
	args: {
		cards: [],
	},
};

export const CustomCards: Story = {
	render: () => (
		<div className="flex min-h-0 h-full w-full items-center justify-center pt-24">
			<div className="felx-1 min-h-0 h-full w-full items-center justify-center ">
				<StackedCards
					cards={[
						{
							id: 1,
							title: 'Documento 1',
							buttonTitle: 'Acción',
							onButtonClick: () => alert('Acción en documento 1'),
							content: <div className="flex flex-col gap-1">
								<small>Documento 1</small>
							</div>,
						},
						{
							id: 2,
							title: 'Documento 2',
							buttonTitle: 'Acción',
							onButtonClick: () => alert('Acción en documento 1'),
							content: <div className="flex flex-col gap-1">
								<small>Documento 2</small>
							</div>,
						},
						{
							id: 3,
							title: 'Documento 3',
							buttonTitle: 'Acción',
							onButtonClick: () => alert('Acción en documento 1'),
							content: <div className="flex flex-col gap-1">
								<small>Documento 3</small>
							</div>,
						},
					]}
				/>
			</div>
		</div>
	),
};
