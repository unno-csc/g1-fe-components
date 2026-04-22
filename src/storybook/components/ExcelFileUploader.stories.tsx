import type { Meta, StoryObj } from '@storybook/react';
import { Button, Space, Typography } from 'antd';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { ExcelFileUploader, IExcelFileUploaderProps } from '../../components/ExcelFileUploader';

const { Text } = Typography;

// ---------- Schema y tipos ----------
const schema = z.object({
	files: z
		.array(z.instanceof(File))
		.min(1, 'Debe cargar al menos un archivo')
		.max(5, 'No puede cargar más de 5 archivos'),
});

type FormValues = z.infer<typeof schema>;

// ---------- Bound wrapper ----------
const BoundExcelFileUploader = (props: Omit<IExcelFileUploaderProps<FormValues>, 'control'>) => {
	const { control } = useFormContext<FormValues>();
	return <ExcelFileUploader<FormValues> {...props} control={control} />;
};

// ---------- RHF Form wrapper ----------
const RHFForm: React.FC<{
	children: React.ReactNode;
	defaultValues?: Partial<FormValues>;
	mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
}> = ({ children, defaultValues, mode = 'onBlur' }) => {
	const methods = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: { files: [], ...defaultValues },
		mode,
	});

	const onSubmit = (data: FormValues) => {
		// eslint-disable-next-line no-console
		console.log(
			'Archivos enviados:',
			data.files.map((f) => ({ name: f.name, size: f.size, type: f.type })),
		);
	};

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit)} style={{ width: 480 }}>
				<Space direction="vertical" style={{ width: '100%' }} size="middle">
					{children}
					<Button htmlType="submit" type="primary" block>
						Enviar
					</Button>
				</Space>
			</form>
		</FormProvider>
	);
};

// ---------- Meta ----------
const meta: Meta<typeof BoundExcelFileUploader> = {
	title: 'components/Form/ExcelFileUploader',
	component: BoundExcelFileUploader,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Componente para subir múltiples archivos Excel (.xls / .xlsx) integrado con react-hook-form. Incluye zona de arrastre, validación de tipo y tamaño, lista de archivos con indicador de progreso y eliminación individual.',
			},
		},
	},
	argTypes: {
		label: { control: 'text' },
		description: { control: 'text' },
		maxFiles: { control: { type: 'number', min: 1, max: 20 } },
		maxSizeMB: { control: { type: 'number', min: 1, max: 100 } },
		optional: { control: 'boolean' },
		disabled: { control: 'boolean' },
	},
};

export default meta;
type Story = StoryObj<typeof BoundExcelFileUploader>;

// ---------- Default ----------
export const Default: Story = {
	name: 'Default',
	args: {
		name: 'files',
		label: 'Archivos Excel',
	},
	render: (args) => (
		<RHFForm>
			<BoundExcelFileUploader {...args} />
		</RHFForm>
	),
};

// ---------- Opcional ----------
export const Optional: Story = {
	name: 'Campo opcional',
	args: {
		name: 'files',
		label: 'Archivos adjuntos',
		optional: true,
	},
	render: (args) => (
		<RHFForm>
			<BoundExcelFileUploader {...args} />
		</RHFForm>
	),
};

// ---------- Descripción personalizada ----------
export const CustomDescription: Story = {
	name: 'Con descripción personalizada',
	args: {
		name: 'files',
		label: 'Importar reportes de ventas',
		description: 'Solo archivos .xlsx generados desde el sistema ERP · Máx. 3 archivos · 5 MB c/u',
		maxFiles: 3,
		maxSizeMB: 5,
	},
	render: (args) => (
		<RHFForm>
			<BoundExcelFileUploader {...args} />
		</RHFForm>
	),
};

// ---------- Límite reducido ----------
export const SingleFile: Story = {
	name: 'Máximo 1 archivo',
	args: {
		name: 'files',
		label: 'Plantilla de importación',
		maxFiles: 1,
	},
	render: (args) => (
		<RHFForm>
			<BoundExcelFileUploader {...args} />
		</RHFForm>
	),
};

// ---------- Deshabilitado ----------
export const Disabled: Story = {
	name: 'Deshabilitado',
	args: {
		name: 'files',
		label: 'Archivos Excel',
		disabled: true,
	},
	render: (args) => (
		<RHFForm>
			<BoundExcelFileUploader {...args} />
		</RHFForm>
	),
};

// ---------- Error al enviar ----------
export const ShowErrorOnSubmit: Story = {
	name: 'Validación: error al enviar sin archivos',
	args: {
		name: 'files',
		label: 'Archivos de importación',
	},
	render: (args) => (
		<RHFForm mode="onSubmit">
			<BoundExcelFileUploader {...args} />
			<Text type="secondary" style={{ fontSize: 12 }}>
				Haz clic en &quot;Enviar&quot; sin cargar archivos para ver el error de validación.
			</Text>
		</RHFForm>
	),
};
