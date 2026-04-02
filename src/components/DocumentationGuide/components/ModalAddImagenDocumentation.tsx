import { useEffect, useMemo, useRef, useState } from 'react';
import { CloseOutlined, CopyOutlined, DeleteOutlined, LoadingOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { Image, Upload, message } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { useUploadImages } from '@/store/useUploadImages';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const buildImageSrc = (baseUrl?: string, imageKey?: string, imageUrl?: string) => {
    if (imageUrl) {
        return imageUrl;
    }

    if (!baseUrl || !imageKey) {
        return undefined;
    }

    if (/^https?:\/\//i.test(imageKey)) {
        return imageKey;
    }

    const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

    if (/\/files\/?$/i.test(normalizedBaseUrl)) {
        return `${normalizedBaseUrl}?key=${encodeURIComponent(imageKey)}`;
    }

    return `${normalizedBaseUrl}${imageKey}`;
};

export interface IModalAddImagenDocumentationProps {
    onUpload?: UploadProps['onChange'];
    imageUrl?: string;
    baseUrl?: string;
    imageKey?: string;
    loading?: boolean;
    onDeleteImage?: () => void;
    onSaveImage?: (file?: FileType) => void | Promise<void>;
    onCancel?: () => void;
}

export const ModalAddImagenDocumentation = ({
    onUpload,
    imageUrl,
    baseUrl,
    imageKey,
    loading = false,
    onDeleteImage,
    onSaveImage,
    onCancel,
}: IModalAddImagenDocumentationProps) => {
    const { imageKey: storeImageKey } = useUploadImages();
    const previousImageKeyRef = useRef<string | undefined>();
    const [localPreviewUrl, setLocalPreviewUrl] = useState<string>();
    const [selectedFile, setSelectedFile] = useState<FileType>();

    const resolvedImageKey = imageKey ?? storeImageKey;
    const persistedImageUrl = useMemo(
        () => buildImageSrc(baseUrl, resolvedImageKey, imageUrl),
        [baseUrl, imageUrl, resolvedImageKey],
    );
    const resolvedImageUrl = localPreviewUrl ?? persistedImageUrl;
    const hasImage = Boolean(resolvedImageUrl);
    const hasPendingChanges = Boolean(localPreviewUrl);
    const hasSavedImage = Boolean(persistedImageUrl || resolvedImageKey);

    useEffect(() => {
        if (localPreviewUrl && resolvedImageKey && resolvedImageKey !== previousImageKeyRef.current) {
            setLocalPreviewUrl(undefined);
            setSelectedFile(undefined);
        }

        previousImageKeyRef.current = resolvedImageKey;
    }, [localPreviewUrl, resolvedImageKey]);

    const handleBeforeUpload = (file: FileType) => {
        setSelectedFile(file);
        void getBase64(file)
            .then(setLocalPreviewUrl)
            .catch(() => {
                message.error('No se pudo previsualizar la imagen');
            });

        return false;
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>{loading ? 'Cargando...' : 'Cargar imagen'}</div>
        </button>
    );

    const handleCopyValue = async (value?: string, successMessage = 'Copiado al portapapeles') => {
        if (!value) return;

        try {
            await navigator.clipboard.writeText(value);
            message.success(successMessage);
        } catch {
            message.error('No se pudo copiar el valor');
        }
    };

    const handleDelete = () => {
        setLocalPreviewUrl(undefined);
        setSelectedFile(undefined);
        onDeleteImage?.();
    };

    const handleCancel = () => {
        setLocalPreviewUrl(undefined);
        setSelectedFile(undefined);
        onCancel?.();
    };

    const handleSave = async () => {
        if (!selectedFile) {
            message.warning('Primero selecciona una imagen');
            return;
        }

        if (onSaveImage) {
            await onSaveImage(selectedFile);
            return;
        }

        if (onUpload) {
            const uploadFile: UploadFile<FileType> = {
                uid: `${selectedFile.name}-${selectedFile.lastModified}`,
                name: selectedFile.name,
                status: 'done',
                percent: 100,
                originFileObj: selectedFile,
                size: selectedFile.size,
                type: selectedFile.type,
            };

            await onUpload({
                file: uploadFile,
                fileList: [uploadFile],
            } as Parameters<NonNullable<UploadProps['onChange']>>[0]);
        }
    };

    const getLibraryButtonClassName = (type: 'primary' | 'secondary', disabled?: boolean) => {
        const sizeClass = 'itsa-btn--md';
        const variantClass = type === 'primary' ? 'itsa-btn--primary' : 'itsa-btn--secondary';
        const nativeButtonResetClassName = 'appearance-none px-4 py-2 shadow-none outline-none focus:outline-none focus:shadow-none';
        const borderClassName = type === 'secondary' ? 'border' : 'border-0';
        const baseClassName = ['itsa-btn', sizeClass, variantClass, nativeButtonResetClassName, borderClassName].filter(Boolean).join(' ');

        return disabled ? [baseClassName, 'itsa-btn--disabled', 'rounded-[12px]'].join(' ') : baseClassName;
    };
    const getLibraryButtonStyle = (type: 'primary' | 'secondary') =>
        type === 'secondary' ? { borderColor: 'currentColor' } : undefined;

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            {!hasImage ? (
                <Upload
                    {...({
                        listType: 'picture-card',
                        showUploadList: false,
                        beforeUpload: handleBeforeUpload,
                        pastable: true,
                        maxCount: 1,
                        disabled: loading,
                        accept: 'image/*',
                    } as UploadProps)}
                >
                    {uploadButton}
                </Upload>
            ) : (
                <div className="flex w-full max-w-md flex-col gap-3">
                    <div className="overflow-hidden rounded-md border border-gray-200 bg-gray-50 p-2">
                        <Image
                            alt="Imagen de documentacion"
                            src={resolvedImageUrl}
                            width="100%"
                            className="max-h-[320px] object-contain"
                            style={{ width: '100%', objectFit: 'contain' }}
                            preview={{
                                movable: true,
                                mask: <span className="text-xs">Click para ampliar</span>,
                            }}
                        />
                    </div>

                    <div className="flex flex-wrap justify-end gap-2">
                        {hasPendingChanges && onSaveImage && (
                            <button
                                type="button"
                                className={getLibraryButtonClassName('primary', loading)}
                                onClick={() => {
                                    void handleSave();
                                }}
                                disabled={loading}
                            >
                                <div className="flex items-center gap-2">
                                    <SaveOutlined />
                                    <span>Guardar imagen</span>
                                </div>
                            </button>
                        )}

                        {hasPendingChanges && !onSaveImage && onUpload && (
                            <button
                                type="button"
                                className={getLibraryButtonClassName('primary', loading)}
                                onClick={() => {
                                    void handleSave();
                                }}
                                disabled={loading}
                            >
                                <div className="flex items-center gap-2">
                                    <SaveOutlined />
                                    <span>Guardar imagen</span>
                                </div>
                            </button>
                        )}

                        {hasPendingChanges && (
                            <button
                                type="button"
                                className={getLibraryButtonClassName('secondary', loading)}
                                style={getLibraryButtonStyle('secondary')}
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                <div className="flex items-center gap-2">
                                    <CloseOutlined />
                                    <span>Cancelar</span>
                                </div>
                            </button>
                        )}

                        {!hasPendingChanges && hasSavedImage && onDeleteImage && (
                            <button
                                type="button"
                                className={getLibraryButtonClassName('secondary', loading)}
                                style={getLibraryButtonStyle('secondary')}
                                onClick={handleDelete}
                                disabled={loading}
                            >
                                <div className="flex items-center gap-2">
                                    <DeleteOutlined />
                                    <span>Eliminar imagen</span>
                                </div>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {hasSavedImage && (
                <div className="w-full max-w-md rounded-md border border-green-200 bg-green-50 p-3">
                    <p className="text-sm font-medium text-green-700">Imagen guardada correctamente</p>

                    {resolvedImageKey && (
                        <button
                            type="button"
                            className="mt-2 flex w-full items-center justify-between gap-3 rounded border border-dashed border-green-300 bg-white px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-green-100"
                            onClick={() => handleCopyValue(resolvedImageKey, 'Key copiada al portapapeles')}
                            title="Click para copiar key"
                        >
                            <div className="min-w-0">
                                <span className="block text-xs text-gray-500">Key de la imagen</span>
                                <span className="block truncate font-mono">{resolvedImageKey}</span>
                            </div>
                            <CopyOutlined />
                        </button>
                    )}

                    {persistedImageUrl && (
                        <button
                            type="button"
                            className="mt-2 flex w-full items-center justify-between gap-3 rounded border border-dashed border-green-300 bg-white px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-green-100"
                            onClick={() => handleCopyValue(persistedImageUrl, 'URL copiada al portapapeles')}
                            title="Click para copiar URL"
                        >
                            <div className="min-w-0">
                                <span className="block text-xs text-gray-500">URL de muestra</span>
                                <span className="block truncate font-mono">{persistedImageUrl}</span>
                            </div>
                            <CopyOutlined />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};