import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Space, Typography } from 'antd';
import { z } from 'zod';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { PdfFileUploader, type IPdfFileUploaderProps } from '../../components/PdfFileUploader';

const { Text } = Typography;

const schema = z.object({
	files: z
		.array(z.instanceof(File))
		.min(1, 'Debe cargar al menos un archivo PDF')
		.max(5, 'No puede cargar mas de 5 archivos PDF'),
});

type FormValues = z.infer<typeof schema>;

const BoundPdfFileUploader = (props: Omit<IPdfFileUploaderProps<FormValues>, 'control'>) => {
	const { control } = useFormContext<FormValues>();
	return <PdfFileUploader<FormValues> {...props} control={control} />;
};

function RHFForm({
	children,
	defaultValues,
	mode = 'onBlur',
}: {
	children: ReactNode;
	defaultValues?: Partial<FormValues>;
	mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
}) {
	const methods = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: { files: [], ...defaultValues },
		mode,
	});

	const onSubmit = (data: FormValues) => {
		// eslint-disable-next-line no-console
		console.log(
			'PDF enviados:',
			data.files.map(file => ({ name: file.name, size: file.size, type: file.type })),
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
}

const meta: Meta<typeof BoundPdfFileUploader> = {
	title: 'components/Form/PdfFileUploader',
	component: BoundPdfFileUploader,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Componente para subir multiples archivos PDF integrado con react-hook-form. Incluye zona de arrastre, validacion de tipo y tamano, listado de archivos y eliminacion individual.',
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
type Story = StoryObj<typeof BoundPdfFileUploader>;

export const Default: Story = {
	args: {
		name: 'files',
		label: 'Archivos PDF',
	},
	render: args => (
		<RHFForm>
			<BoundPdfFileUploader {...args} />
		</RHFForm>
	),
};

export const CustomDescription: Story = {
	name: 'Con descripcion personalizada',
	args: {
		name: 'files',
		label: 'Contratos digitalizados',
		description: 'Solo documentos PDF firmados | Max. 3 archivos | 5 MB c/u',
		maxFiles: 3,
		maxSizeMB: 5,
	},
	render: args => (
		<RHFForm>
			<BoundPdfFileUploader {...args} />
		</RHFForm>
	),
};

export const Disabled: Story = {
	args: {
		name: 'files',
		label: 'Archivos PDF',
		disabled: true,
	},
	render: args => (
		<RHFForm>
			<BoundPdfFileUploader {...args} />
		</RHFForm>
	),
};

export const ShowErrorOnSubmit: Story = {
	name: 'Validacion sin archivos',
	args: {
		name: 'files',
		label: 'PDF requeridos',
	},
	render: args => (
		<RHFForm mode="onSubmit">
			<BoundPdfFileUploader {...args} />
			<Text type="secondary" style={{ fontSize: 12 }}>
				Haz clic en &quot;Enviar&quot; sin cargar archivos para ver el error.
			</Text>
		</RHFForm>
	),
};
