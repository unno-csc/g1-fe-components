import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Space, Typography } from 'antd';
import { SafetyCertificateTwoTone } from '@ant-design/icons';
import { z } from 'zod';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import {
	FormFileUploader,
	type IFormFileUploaderProps,
	type TFormFileUploaderVariantColor,
} from '../../components/FormFileUploader';

const { Text } = Typography;

const singleFileSchema = z.object({
	certificate: z.instanceof(File, { message: 'Debe seleccionar un archivo de firma electrónica' }),
});

type SingleFormValues = z.infer<typeof singleFileSchema>;

const multipleFilesSchema = z.object({
	documents: z
		.array(z.instanceof(File))
		.min(1, 'Debe cargar al menos un documento')
		.max(5, 'No puede cargar más de 5 documentos'),
});

type MultipleFormValues = z.infer<typeof multipleFilesSchema>;

const BoundSingleFileUploader = (
	props: Omit<IFormFileUploaderProps<SingleFormValues>, 'control'>,
) => {
	const { control } = useFormContext<SingleFormValues>();
	return <FormFileUploader<SingleFormValues> {...props} control={control} />;
};

const BoundMultipleFileUploader = (
	props: Omit<IFormFileUploaderProps<MultipleFormValues>, 'control'>,
) => {
	const { control } = useFormContext<MultipleFormValues>();
	return <FormFileUploader<MultipleFormValues> {...props} control={control} />;
};

const SingleFormWrapper = ({
	children,
	defaultValues,
	mode = 'onBlur',
}: {
	children: ReactNode;
	defaultValues?: Partial<SingleFormValues>;
	mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
}) => {
	const methods = useForm<SingleFormValues>({
		resolver: zodResolver(singleFileSchema),
		defaultValues: { certificate: undefined, ...defaultValues },
		mode,
	});

	const onSubmit = (data: SingleFormValues) => {
		// eslint-disable-next-line no-console
		console.log('Archivo enviado:', data.certificate?.name, data.certificate?.size);
	};

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit)} className="w-[480px]">
				<Space direction="vertical" className="w-full" size="middle">
					{children}
					<Button htmlType="submit" type="primary" block>
						Guardar Certificado
					</Button>
				</Space>
			</form>
		</FormProvider>
	);
};

const MultipleFormWrapper = ({
	children,
	defaultValues,
	mode = 'onBlur',
}: {
	children: ReactNode;
	defaultValues?: Partial<MultipleFormValues>;
	mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
}) => {
	const methods = useForm<MultipleFormValues>({
		resolver: zodResolver(multipleFilesSchema),
		defaultValues: { documents: [], ...defaultValues },
		mode,
	});

	const onSubmit = (data: MultipleFormValues) => {
		// eslint-disable-next-line no-console
		console.log(
			'Documentos enviados:',
			data.documents.map(file => ({ name: file.name, size: file.size })),
		);
	};

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit)} className="w-[480px]">
				<Space direction="vertical" className="w-full" size="middle">
					{children}
					<Button htmlType="submit" type="primary" block>
						Guardar Documentos
					</Button>
				</Space>
			</form>
		</FormProvider>
	);
};

const meta: Meta<typeof BoundSingleFileUploader> = {
	title: 'components/Form/FormFileUploader',
	component: BoundSingleFileUploader,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Componente genérico de carga de archivos (single y multiple) integrado con react-hook-form y Ant Design Dragger. Permite controlar la paleta temática mediante `variantColor` e iconos personalizados mediante `icon` y `listIcon`.',
			},
		},
	},
	argTypes: {
		label: { control: 'text', description: 'Etiqueta del campo' },
		description: { control: 'text', description: 'Texto secundario explicativo' },
		dropzoneText: { control: 'text', description: 'Texto principal de la zona de arrastre' },
		accept: {
			control: 'text',
			description: 'Extensiones o tipos MIME permitidos (ej: .p12,.pfx, .xml, .zip)',
		},
		maxSizeMB: {
			control: { type: 'number', min: 1, max: 100 },
			description: 'Tamaño máximo en MB por archivo',
		},
		variantColor: {
			control: 'select',
			options: ['amber', 'blue', 'green', 'red', 'gray', 'primary'] satisfies TFormFileUploaderVariantColor[],
			description: 'Paleta de color y acento visual del uploader',
		},
		multiple: { control: 'boolean', description: 'Permitir selección de múltiples archivos' },
		maxFiles: {
			control: { type: 'number', min: 1, max: 20 },
			description: 'Límite máximo de archivos en modo múltiple',
		},
		optional: { control: 'boolean', description: 'Indica si el campo es opcional' },
		disabled: { control: 'boolean', description: 'Deshabilita la interacción' },
		readOnly: { control: 'boolean', description: 'Modo solo lectura' },
	},
};

export default meta;
type SingleStory = StoryObj<typeof BoundSingleFileUploader>;
type MultipleStory = StoryObj<typeof BoundMultipleFileUploader>;

export const Default: SingleStory = {
	name: 'Firma Electrónica (Amber / Default)',
	args: {
		name: 'certificate',
		label: 'Certificado de Firma Electrónica',
		accept: '.p12,.pfx',
		maxSizeMB: 20,
		variantColor: 'amber',
		dropzoneText: 'Haga clic o arrastre el archivo de firma electrónica aquí',
	},
	render: args => (
		<SingleFormWrapper>
			<BoundSingleFileUploader {...args} />
		</SingleFormWrapper>
	),
};

export const CustomCertificateIcon: SingleStory = {
	name: 'Con Icono Personalizado de Certificado',
	args: {
		name: 'certificate',
		label: 'Certificado Digital Seguro',
		accept: '.p12,.pfx',
		maxSizeMB: 20,
		variantColor: 'amber',
		icon: <SafetyCertificateTwoTone twoToneColor="#F9A825" style={{ fontSize: 32 }} />,
		dropzoneText: 'Cargue su certificado de firma electrónica',
	},
	render: args => (
		<SingleFormWrapper>
			<BoundSingleFileUploader {...args} />
		</SingleFormWrapper>
	),
};

export const BlueVariant: SingleStory = {
	name: 'Variante Azul (Documentos Generales)',
	args: {
		name: 'certificate',
		label: 'Documento Principal',
		accept: '.pdf,.doc,.docx',
		maxSizeMB: 10,
		variantColor: 'blue',
		dropzoneText: 'Subir documento principal',
	},
	render: args => (
		<SingleFormWrapper>
			<BoundSingleFileUploader {...args} />
		</SingleFormWrapper>
	),
};

export const WithExistingFile: SingleStory = {
	name: 'Modo Edición con Archivo Existente',
	args: {
		name: 'certificate',
		label: 'Certificado de Firma Electrónica',
		accept: '.p12,.pfx',
		variantColor: 'amber',
		existingFileName: 'firma_digital_daniel_collaguazo.p12',
		existingFileUrl: 'https://example.com/firma.p12',
		onExistingFileClick: () => {
			// eslint-disable-next-line no-console
			console.log('Descargando o visualizando archivo existente...');
		},
	},
	render: args => (
		<SingleFormWrapper>
			<BoundSingleFileUploader {...args} />
			<Text type="secondary" className="text-xs">
				Muestra el certificado ya cargado. Al hacer clic en el botón de eliminar, permite subir uno
				nuevo.
			</Text>
		</SingleFormWrapper>
	),
};

export const ValidationError: SingleStory = {
	name: 'Validación en Submit',
	args: {
		name: 'certificate',
		label: 'Certificado Requerido',
		accept: '.p12,.pfx',
		variantColor: 'amber',
	},
	render: args => (
		<SingleFormWrapper mode="onSubmit">
			<BoundSingleFileUploader {...args} />
			<Text type="secondary" className="text-xs">
				Haz clic en &quot;Guardar Certificado&quot; sin seleccionar un archivo para ver el mensaje de
				validación.
			</Text>
		</SingleFormWrapper>
	),
};

export const Disabled: SingleStory = {
	name: 'Deshabilitado',
	args: {
		name: 'certificate',
		label: 'Certificado Digital',
		accept: '.p12,.pfx',
		disabled: true,
	},
	render: args => (
		<SingleFormWrapper>
			<BoundSingleFileUploader {...args} />
		</SingleFormWrapper>
	),
};

export const ReadOnly: SingleStory = {
	name: 'Solo Lectura',
	args: {
		name: 'certificate',
		label: 'Certificado Digital',
		existingFileName: 'firma_empresa_activa.p12',
		readOnly: true,
	},
	render: args => (
		<SingleFormWrapper>
			<BoundSingleFileUploader {...args} />
		</SingleFormWrapper>
	),
};

export const MultipleFiles: MultipleStory = {
	name: 'Múltiples Archivos (.xml, .zip, .pdf)',
	args: {
		name: 'documents',
		label: 'Comprobantes y Anexos',
		multiple: true,
		accept: '.xml,.zip,.pdf',
		maxFiles: 5,
		maxSizeMB: 15,
		variantColor: 'amber',
		dropzoneText: 'Haga clic o arrastre comprobantes electrónicos (.xml, .zip, .pdf)',
	},
	render: args => (
		<MultipleFormWrapper>
			<BoundMultipleFileUploader {...args} />
		</MultipleFormWrapper>
	),
};
