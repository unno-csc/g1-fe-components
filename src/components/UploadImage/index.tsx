import { useEffect, useState } from 'react';
import { CloseCircleFilled, CloudUploadOutlined, CopyOutlined, LoadingOutlined, SaveOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import type { GetProp, UploadProps } from 'antd';
import { ImagePreview } from '../ImagePreview';
import { useNotification } from '@/hooks';

export type UploadImageFileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
const ACCEPTED_IMAGE_EXTENSIONS = '.png,.jpg,.jpeg,.gif,.webp';

const getBase64 = (file: UploadImageFileType): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = error => reject(error);
	});

const formatBytes = (bytes = 0) => {
	if (!bytes) return '0 B';

	const sizes = ['B', 'KB', 'MB', 'GB'];
	const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);
	const value = bytes / 1024 ** unitIndex;

	return `${value >= 10 || unitIndex === 0 ? value.toFixed(0) : value.toFixed(2)} ${sizes[unitIndex]}`;
};

const getButtonClassName = (variant: 'primary' | 'secondary', disabled?: boolean) => {
	const sizeClass = 'itsa-btn--md';
	const variantClass = variant === 'primary' ? 'itsa-btn--primary' : 'itsa-btn--secondary';
	const nativeButtonResetClassName = 'appearance-none px-4 py-2 shadow-none outline-none focus:outline-none focus:shadow-none';
	const borderClassName = variant === 'secondary' ? 'border' : 'border-0';
	const baseClassName = ['itsa-btn', sizeClass, variantClass, nativeButtonResetClassName, borderClassName].filter(Boolean).join(' ');

	return disabled ? [baseClassName, 'itsa-btn--disabled', 'rounded-[12px]'].join(' ') : baseClassName;
};

const fallbackCopyToClipboard = (value: string) => {
	const textArea = document.createElement('textarea');
	textArea.value = value;
	textArea.setAttribute('readonly', '');
	textArea.style.position = 'fixed';
	textArea.style.left = '-9999px';
	textArea.style.opacity = '0';

	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	const wasCopied = document.execCommand('copy');
	document.body.removeChild(textArea);

	return wasCopied;
};

export interface IUploadImageProps {
	saveImage?: (file: UploadImageFileType) => void | Promise<void>;
	cancel?: () => void;
	loadings?: boolean;
	preview?: string;
	keyS3ImagenSaved?: string;
	confirmarGuardar?: boolean;
	title?: string;
	subtitle?: string;
}

export const UploadImage = ({
	saveImage,
	cancel,
	loadings = false,
	preview,
	keyS3ImagenSaved,
	confirmarGuardar = false,
	title = 'Subir Imagen a S3',
	subtitle = `Arrastra una imagen o haz clic para seleccionar. También puedes pegar con Ctrl+V. Máximo ${MAX_FILE_SIZE_MB}MB.`,
}: IUploadImageProps) => {
	const [selectedFile, setSelectedFile] = useState<UploadImageFileType>();
	const [localPreview, setLocalPreview] = useState<string>();
	const { openNotificationWithIcon } = useNotification();
	const previewSrc = localPreview ?? preview;
	const hasPendingFile = Boolean(selectedFile);

	useEffect(() => {
		if (keyS3ImagenSaved) {
			setSelectedFile(undefined);
		}
	}, [keyS3ImagenSaved]);

	const resetSelection = () => {
		setSelectedFile(undefined);
		setLocalPreview(undefined);
	};

	const handleCopyKey = async () => {
		if (!keyS3ImagenSaved) return;

		try {
			if (navigator.clipboard && window.isSecureContext) {
				await navigator.clipboard.writeText(keyS3ImagenSaved);
				openNotificationWithIcon({ type: 'success', message: 'Key copiada correctamente' });
				return;
			}

			const wasCopied = fallbackCopyToClipboard(keyS3ImagenSaved);
			if (wasCopied) {
				openNotificationWithIcon({ type: 'success', message: 'Key copiada correctamente' });
				return;
			}

			openNotificationWithIcon({ type: 'error', message: 'No se pudo copiar la key' });
		} catch {
			const wasCopied = fallbackCopyToClipboard(keyS3ImagenSaved);
			if (wasCopied) {
				openNotificationWithIcon({ type: 'success', message: 'Key copiada correctamente' });
				return;
			}

			openNotificationWithIcon({ type: 'error', message: 'No se pudo copiar la key' });
		}
	};

	const processFile = (file: UploadImageFileType) => {
		const isValidType = ACCEPTED_IMAGE_TYPES.includes(file.type);
		if (!isValidType) {
			openNotificationWithIcon({ type: 'error', message: 'Solo se permiten archivos PNG, JPG, GIF o WebP' });
			return false;
		}

		const isValidSize = file.size / 1024 / 1024 <= MAX_FILE_SIZE_MB;
		if (!isValidSize) {
			openNotificationWithIcon({ type: 'error', message: `La imagen debe pesar máximo ${MAX_FILE_SIZE_MB}MB` });
			return false;
		}

		setSelectedFile(file);
		void getBase64(file)
			.then(setLocalPreview)
			.catch(() => {
				openNotificationWithIcon({ type: 'error', message: 'No se pudo generar la vista previa' });
			});

		return true;
	};

	const handleBeforeUpload: UploadProps['beforeUpload'] = file => {
		const isValid = processFile(file);
		if (!isValid) {
			return Upload.LIST_IGNORE;
		}

		return false;
	};

	useEffect(() => {
		const handlePaste = (event: ClipboardEvent) => {
			if (loadings) return;

			const clipboardItems = Array.from(event.clipboardData?.items ?? []);
			const imageItem = clipboardItems.find(item => item.type.startsWith('image/'));
			const pastedFile = imageItem?.getAsFile();

			if (!pastedFile) return;

			event.preventDefault();

			const fileName = `pasted-image-${Date.now()}.${pastedFile.type.split('/')[1] ?? 'png'}`;
			const normalizedFile = new File([pastedFile], fileName, {
				type: pastedFile.type,
				lastModified: Date.now(),
			}) as UploadImageFileType;

			processFile(normalizedFile);
		};

		document.addEventListener('paste', handlePaste);

		return () => {
			document.removeEventListener('paste', handlePaste);
		};
	}, [loadings]);

	const handleSave = async () => {
		if (!selectedFile) {
			openNotificationWithIcon({ type: 'warning', message: 'Selecciona una imagen antes de guardar' });
			return;
		}

		if (!saveImage) {
			openNotificationWithIcon({ type: 'warning', message: 'No se configuró la acción para guardar la imagen' });
			return;
		}

		if (confirmarGuardar) {
			const confirmed = window.confirm('¿Deseas guardar esta imagen en S3?');
			if (!confirmed) return;
		}

		await saveImage(selectedFile);
	};

	const uploader = (
		<Upload.Dragger
			showUploadList={false}
			beforeUpload={handleBeforeUpload}
			pastable
			maxCount={1}
			disabled={loadings}
			accept={ACCEPTED_IMAGE_EXTENSIONS}
			className="!rounded-2xl !border-gray-300 !bg-white"
		>
			<div className="flex min-h-[220px] flex-col items-center justify-center gap-3 px-6 py-8 text-center">
				<div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl text-gray-500">
					{loadings ? <LoadingOutlined /> : <CloudUploadOutlined />}
				</div>
				<div className="space-y-1">
					<p className="text-xl font-semibold text-gray-800">Arrastra tu imagen aquí</p>
					<p className="text-sm text-gray-500">o haz clic para seleccionar o pegar</p>
				</div>
				<p className="text-sm text-gray-400">PNG, JPG, GIF, WebP hasta {MAX_FILE_SIZE_MB}MB</p>
			</div>
		</Upload.Dragger>
	);

	return (
		<div className="flex w-full max-w-[440px] flex-col gap-4 rounded-2xl bg-white text-gray-800">
			<div className="space-y-1">
				<h3 className="text-[18px] font-semibold leading-7">{title}</h3>
				<p className="text-sm text-gray-500">{subtitle}</p>
			</div>

			{previewSrc ? (
				<div className="space-y-3">
					<div className="relative rounded-2xl border border-gray-200 p-2">
						<ImagePreview
							src={previewSrc}
							alt="Vista previa de la imagen"
							minHeight={260}
							className="border-0 bg-white"
							imageClassName="max-h-[260px] object-contain"
						/>

						{hasPendingFile && (
							<button
								type="button"
								onClick={resetSelection}
								className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-sm transition hover:bg-red-600"
								disabled={loadings}
								aria-label="Quitar imagen seleccionada"
							>
								<CloseCircleFilled />
							</button>
						)}
					</div>

					{selectedFile && (
						<div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
							<div className="truncate text-sm font-medium text-gray-800">{selectedFile.name}</div>
							<div className="text-sm text-gray-500">{formatBytes(selectedFile.size)}</div>
						</div>
					)}

					{!hasPendingFile && (
						<Upload
							showUploadList={false}
							beforeUpload={handleBeforeUpload}
							pastable
							maxCount={1}
							disabled={loadings}
							accept={ACCEPTED_IMAGE_EXTENSIONS}
						>
							<button type="button" className={getButtonClassName('secondary', loadings)} disabled={loadings}>
								Cambiar imagen
							</button>
						</Upload>
					)}
				</div>
			) : (
				uploader
			)}

			{keyS3ImagenSaved && (
				<div className="space-y-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
					<p className="text-sm font-medium text-green-700">Key de imagen guardada</p>
					<div className="flex items-center gap-3 rounded-xl border border-green-200 bg-white px-3 py-2">
						<div className="min-w-0 flex-1">
							<p className="text-xs text-gray-500">Key S3</p>
							<p className="truncate font-mono text-sm text-gray-700">{keyS3ImagenSaved}</p>
						</div>
						<button
							type="button"
							onClick={() => {
								void handleCopyKey();
							}}
							className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
						>
							<CopyOutlined />
							Copiar
						</button>
					</div>
				</div>
			)}

			<div className="flex flex-wrap justify-end gap-2">
				{hasPendingFile ? (
					<>
						<button type="button" onClick={resetSelection} className={getButtonClassName('secondary', loadings)} disabled={loadings}>
							Limpiar
						</button>
						<button
							type="button"
							onClick={() => {
								void handleSave();
							}}
							className={getButtonClassName('primary', loadings || !saveImage)}
							disabled={loadings || !saveImage}
						>
							{loadings ? <LoadingOutlined /> : <SaveOutlined />}
							<span>Guardar en S3</span>
						</button>
					</>
				) : (
					cancel && (
						<button type="button" onClick={cancel} className={getButtonClassName('secondary', loadings)} disabled={loadings}>
							Cancelar
						</button>
					)
				)}
			</div>
		</div>
	);
};
