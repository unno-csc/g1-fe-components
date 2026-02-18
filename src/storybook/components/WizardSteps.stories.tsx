import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import type { StepsProps } from 'antd';
import { WizardSteps } from '../../components/WizardSteps/WizardSteps';

const meta = {
	title: 'Components/WizardSteps',
	component: WizardSteps,
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component:
					'Control de navegación secuencial con soporte multiestilo. Permite alternar entre ' +
					'un diseño de indicadores en flecha (estilo "itsa-panel") y las variantes ' +
					'estándar de Ant Design (default, navigation e inline), facilitando la ' +
					'adaptación al flujo de usuario.',
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		current: {
			control: { type: 'number', min: 0, max: 3 },
			description: 'Índice del paso actual (base 0)',
			table: {
				type: { summary: 'number' },
				defaultValue: { summary: '0' },
			},
		},
		type: {
			control: { type: 'select' },
			options: ['default', 'navigation', 'inline', 'itsa-panel'],
			description:
				'Tipo de visualización del componente. "itsa-panel" aplica estilo chevron personalizado, otros tipos usan estilos de Ant Design',
			table: {
				type: { summary: 'string' },
				defaultValue: { summary: 'default' },
			},
		},
		height: {
			control: { type: 'number', min: 32, max: 80 },
			description: 'Altura del componente en píxeles. Solo aplicable para tipo "itsa-panel"',
			table: {
				type: { summary: 'number' },
				defaultValue: { summary: '48' },
			},
		},
		arrowWidth: {
			control: { type: 'number', min: 16, max: 40 },
			description: 'Ancho de la flecha/chevron en píxeles. Solo aplicable para tipo "itsa-panel"',
			table: {
				type: { summary: 'number' },
				defaultValue: { summary: '24' },
			},
		},
		items: {
			description: 'Array de elementos de paso con título y estado',
			table: {
				type: { summary: 'StepsProps["items"]' },
			},
		},
		onChange: {
			description: 'Callback ejecutado cuando el usuario hace clic en un paso',
			table: {
				type: { summary: '(stepIndex: number) => void' },
			},
		},
		className: {
			description: 'Clase CSS adicional para personalización',
			table: {
				type: { summary: 'string' },
			},
		},
	},
} satisfies Meta<typeof WizardSteps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		current: 0,
		type: 'itsa-panel',
		items: [
			{ title: 'Cliente', status: 'process' },
			{ title: 'Vehículo', status: 'wait' },
			{ title: 'Datos', status: 'wait' },
			{ title: 'Finalizar', status: 'wait' },
		],
	},
};

export const Interactive: Story = {
	args: {
		current: 0,
		type: 'itsa-panel',
		items: [],
	},
	render: () => {
		const [currentStep, setCurrentStep] = useState(0);

		const steps: StepsProps['items'] = [
			{
				title: 'Cliente',
				status: currentStep > 0 ? 'finish' : currentStep === 0 ? 'process' : 'wait',
			},
			{
				title: 'Vehículo',
				status: currentStep > 1 ? 'finish' : currentStep === 1 ? 'process' : 'wait',
			},
			{
				title: 'Datos',
				status: currentStep > 2 ? 'finish' : currentStep === 2 ? 'process' : 'wait',
			},
			{
				title: 'Finalizar',
				status: currentStep === 3 ? 'process' : 'wait',
			},
		];

		const handleStepChange = (step: number) => {
			console.log('Navegando al paso:', step);
			setCurrentStep(step);
		};

		return (
			<div className="space-y-6">
				<WizardSteps type="itsa-panel" current={currentStep} items={steps} onChange={handleStepChange} />

				<div className="bg-white p-6 rounded-lg shadow">
					<h3 className="text-lg font-semibold mb-4">Paso Actual: {currentStep + 1}</h3>
					<p className="text-gray-600">Contenido del paso "{steps[currentStep]?.title}"</p>

					<div className="mt-6 flex gap-4">
						<button
							onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
							disabled={currentStep === 0}
							className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Anterior
						</button>
						<button
							onClick={() => setCurrentStep(prev => Math.min(3, prev + 1))}
							disabled={currentStep === 3}
							className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Siguiente
						</button>
					</div>
				</div>
			</div>
		);
	},
};

export const WithError: Story = {
	args: {
		current: 1,
		type: 'itsa-panel',
		items: [
			{ title: 'Información', status: 'finish' },
			{ title: 'Validación', status: 'error' },
			{ title: 'Confirmación', status: 'wait' },
			{ title: 'Completado', status: 'wait' },
		],
	},
};

export const ManySteps: Story = {
	args: {
		current: 2,
		type: 'itsa-panel',
		items: [
			{ title: 'Paso 1', status: 'finish' },
			{ title: 'Paso 2', status: 'finish' },
			{ title: 'Paso 3', status: 'process' },
			{ title: 'Paso 4', status: 'wait' },
			{ title: 'Paso 5', status: 'wait' },
			{ title: 'Paso 6', status: 'wait' },
		],
	},
};

export const CustomSize: Story = {
	args: {
		current: 1,
		type: 'itsa-panel',
		height: 60,
		arrowWidth: 32,
		items: [
			{ title: 'Inicio', status: 'finish' },
			{ title: 'Proceso', status: 'process' },
			{ title: 'Final', status: 'wait' },
		],
	},
};

export const Compact: Story = {
	args: {
		current: 0,
		type: 'itsa-panel',
		height: 36,
		arrowWidth: 18,
		items: [
			{ title: 'Step 1', status: 'process' },
			{ title: 'Step 2', status: 'wait' },
			{ title: 'Step 3', status: 'wait' },
		],
	},
};

export const LongTitles: Story = {
	args: {
		current: 1,
		type: 'itsa-panel',
		items: [
			{ title: 'Información del Cliente y Datos Personales', status: 'finish' },
			{ title: 'Selección de Vehículo y Configuración', status: 'process' },
			{ title: 'Verificación de Documentos y Requisitos', status: 'wait' },
			{ title: 'Finalización y Confirmación del Proceso', status: 'wait' },
		],
	},
};

export const TypeDefault: Story = {
	args: {
		current: 1,
		type: 'default',
		labelPlacement: "vertical",
		items: [
			{ title: 'Información', status: 'finish', description: 'Datos básicos' },
			{ title: 'Validación', status: 'process', description: 'Revisión' },
			{ title: 'Confirmación', status: 'wait', description: 'Verificación final' },
			{ title: 'Completado', status: 'wait', description: 'Proceso terminado' },
		],
	},
};

export const TypeNavigation: Story = {
	args: {
		current: 2,
		type: 'navigation',
		items: [
			{ title: 'Paso 1', status: 'finish' },
			{ title: 'Paso 2', status: 'finish' },
			{ title: 'Paso 3', status: 'process' },
			{ title: 'Paso 4', status: 'wait' },
		],
	},
};

export const TypeInline: Story = {
	args: {
		current: 0,
		type: 'inline',
		items: [
			{ title: 'Inicio', status: 'process' },
			{ title: 'Proceso', status: 'wait' },
			{ title: 'Final', status: 'wait' },
		],
	},
};
