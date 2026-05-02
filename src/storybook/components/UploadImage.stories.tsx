import React, { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { UploadImage, UploadImageFileType } from '../../components/UploadImage';

interface UploadImageStoryWrapperProps {
	loadings?: boolean;
	preview?: string;
	keyS3ImagenSaved?: string;
	confirmarGuardar?: boolean;
	title?: string;
	subtitle?: string;
}

const DEFAULT_PREVIEW =
	'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80';

const UploadImageStoryWrapper = ({
	loadings = false,
	preview,
	keyS3ImagenSaved,
	confirmarGuardar = false,
	title,
	subtitle,
}: UploadImageStoryWrapperProps) => {
	const [isSaving, setIsSaving] = useState(loadings);
	const [savedKey, setSavedKey] = useState(keyS3ImagenSaved);
	const [savedPreview, setSavedPreview] = useState(preview);
	const localObjectUrlRef = useRef<string | null>(null);

	useEffect(() => {
		setIsSaving(loadings);
	}, [loadings]);

	useEffect(() => {
		setSavedKey(keyS3ImagenSaved);
	}, [keyS3ImagenSaved]);

	useEffect(() => {
		setSavedPreview(preview);
	}, [preview]);

	useEffect(() => {
		return () => {
			if (localObjectUrlRef.current) {
				URL.revokeObjectURL(localObjectUrlRef.current);
			}
		};
	}, []);

	const handleSaveImage = async (file: UploadImageFileType) => {
		setIsSaving(true);

		if (localObjectUrlRef.current) {
			URL.revokeObjectURL(localObjectUrlRef.current);
		}

		const nextPreview = URL.createObjectURL(file);
		localObjectUrlRef.current = nextPreview;
		setSavedPreview(nextPreview);

		await new Promise(resolve => setTimeout(resolve, 1200));

		const safeName = file.name.replace(/\s+/g, '-').toLowerCase();
		setSavedKey(`storybook/upload-image/${Date.now()}-${safeName}`);
		setIsSaving(false);
	};

	const handleCancel = () => {
		setSavedPreview(undefined);
		setSavedKey(undefined);
	};

	return (
		<div className="flex min-h-[100vh] items-start justify-center bg-[#f5f5f5] p-8">
			<UploadImage
				saveImage={handleSaveImage}
				cancel={handleCancel}
				loadings={isSaving}
				preview={savedPreview}
				keyS3ImagenSaved={savedKey}
				confirmarGuardar={confirmarGuardar}
				title={title}
				subtitle={subtitle}
			/>
		</div>
	);
};

const meta: Meta<typeof UploadImageStoryWrapper> = {
	title: 'Components/UploadImage',
	component: UploadImageStoryWrapper,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'Componente para previsualizar, confirmar y simular el guardado de una imagen en S3. La story genera una key mock para demostrar el flujo completo.',
			},
		},
	},
	argTypes: {
		loadings: { control: 'boolean' },
		preview: { control: 'text' },
		keyS3ImagenSaved: { control: 'text' },
		confirmarGuardar: { control: 'boolean' },
		title: { control: 'text' },
		subtitle: { control: 'text' },
	},
	args: {
		loadings: false,
		preview: undefined,
		keyS3ImagenSaved: undefined,
		confirmarGuardar: true,
		title: 'Subir Imagen a S3',
		subtitle: 'Arrastra una imagen o haz clic para seleccionar. También puedes pegar con Ctrl+V. Máximo 5MB.',
	},
};

export default meta;

type Story = StoryObj<typeof UploadImageStoryWrapper>;

export const Default: Story = {
	name: 'Default',
};

export const WithSavedImage: Story = {
	name: 'Con imagen guardada',
	args: {
		preview: DEFAULT_PREVIEW,
		keyS3ImagenSaved: 'documentation/guide/manual-ejemplo.png',
	},
};

export const WithoutConfirmation: Story = {
	name: 'Sin confirmación al guardar',
	args: {
		confirmarGuardar: false,
	},
};
