import type { Meta, StoryObj } from '@storybook/react';
import { StackedCards } from '.';

const meta: Meta<typeof StackedCards> = {
	title: 'Components/StackedCards',
	component: StackedCards,
	parameters: {
		layout: 'fullscreen',
	},
};

export default meta;
type Story = StoryObj<typeof StackedCards>;

export const Default: Story = {};

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


// import type { Meta, StoryObj } from '@storybook/react';
// import { StackedCards } from '.';

// const meta: Meta<typeof StackedCards> = {
// 	title: 'Components/StackedCards',
// 	component: StackedCards,
// 	parameters: {
// 		layout: 'fullscreen',
// 	},
// };

// export default meta;
// type Story = StoryObj<typeof StackedCards>;

// export const Default: Story = {};

// export const CustomCards: Story = {
// 	render: () => (
// 		<div className="p-8">
// 			<StackedCards
// 				className="w-full"
// 				height={144}
// 				maxWidth={340}
// 				showFooterControls
// 				stackDirection="upLeft"
// 				maxVisible={3}
// 				enableInternalState
// 				emptyStateText="No hay tarjetas"
// 				cards={[
// 					{
// 						id: 1,
// 						title: 'Primera tarjeta',
// 						buttonTitle: 'Acción',
// 						onButtonClick: () => alert('Acción en tarjeta 1'),
// 						typeButton: 'secondary',
// 						removeButtonAriaLabel: 'Quitar orden de compra',
// 						line1: 'Primera tarjeta con contenido',
// 						line2: 'Link de ejemplo (texto)',
// 						line3: 'Detalle adicional opcional',
// 					},
// 					{
// 						id: 2,
// 						title: 'Segunda tarjeta',
// 						line1: 'Segunda tarjeta con contenido',
// 						line2: 'Segunda línea opcional',
// 					},
// 					{
// 						id: 3,
// 						title: 'Tercera tarjeta',
// 						line1: 'Tercera tarjeta con contenido',
// 						line2: 'Puedes renderizar solo texto aquí.',
// 					},
// 					{
// 						id: 4,
// 						title: 'Cuarta tarjeta',
// 						line1: 'Cuarta tarjeta con contenido',
// 						line2: 'Segunda línea',
// 						line3: 'Tercera línea',
// 					},
// 					{
// 						id: 5,
// 						title: 'Quinta tarjeta',
// 						line1: 'Quinta tarjeta con contenido',
// 						line2: 'Segunda línea',
// 					},
// 					{
// 						id: 6,
// 						title: 'Sexta tarjeta',
// 						line1: 'Sexta tarjeta con contenido',
// 						line2: 'Segunda línea',
// 						line3: 'Tercera línea',
// 					},
// 				]}
// 			/>
// 		</div>
// 	),
// };

