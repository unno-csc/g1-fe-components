import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { UploadImageCompressor } from '../../components/UploadImageCompressor';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal/Modal';
import { useNotification } from '../../hooks';

const UploadImageCompressorStoryWrapper = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentCount, setCurrentCount] = useState(0);
	const { openNotificationWithIcon } = useNotification();

	const handleOpen = () => setIsModalOpen(true);
	const handleClose = () => setIsModalOpen(false);

	const handleSaveSuccess = (files: File[]) => {
		openNotificationWithIcon({
			type: 'success',
			message: 'Imágenes procesadas',
			description: `Se han procesado ${files.length} imágenes correctamente.`,
		});
		setCurrentCount((prev) => prev + files.length);
		handleClose();
	};

	return (
		<div className="flex min-h-[100vh] flex-col items-center justify-center bg-[#f5f5f5] p-8 gap-4">
			<div className="text-center">
				<p className="mb-4 text-gray-700">Imágenes subidas actualmente: {currentCount}</p>
				<Button type="primary" onClick={handleOpen} label="Subir nuevas imágenes" />
			</div>

			<Modal
				open={isModalOpen}
				onCancel={handleClose}
				title="Subir y Comprimir Imágenes"
				footer={null}
				width={800}
				destroyOnClose
			>
				<UploadImageCompressor
					onSaveSuccess={handleSaveSuccess}
					onCancel={handleClose}
					currentImageCount={currentCount}
					maxImages={3}
					maxSizeMB={1}
				/>
			</Modal>
		</div>
	);
};

const meta: Meta<typeof UploadImageCompressorStoryWrapper> = {
	title: 'Components/UploadImageCompressor',
	component: UploadImageCompressorStoryWrapper,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'Componente genérico para subir múltiples imágenes con validación de límite de cantidad y tamaño, y compresión nativa mediante Canvas API. En este ejemplo, el componente se abre dentro de un Modal.',
			},
		},
	},
};

export default meta;

type Story = StoryObj<typeof UploadImageCompressorStoryWrapper>;

export const Default: Story = {
	name: 'Default (Dentro de un Modal)',
};
