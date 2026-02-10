import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FileTextOutlined } from '@ant-design/icons';
import { Upload, Button, Space } from 'antd';
import type { RcFile } from 'antd/es/upload/interface';

export interface PdfMaintenanceProps {
	pdfUrl?: string | null;
	fileName?: string;
	onUpload?: (file: File) => void | Promise<void>;
	onUpdate?: (file: File) => void | Promise<void>;
	onDelete?: () => void | Promise<void>;
	accept?: string;
	disabled?: boolean;
}

const { Dragger } = Upload;

export const PdfMaintenance = ({
	pdfUrl,
	fileName,
	onUpload,
	onUpdate,
	onDelete,
	accept = 'application/pdf',
	disabled = false,
}: PdfMaintenanceProps) => {
	const uploadInputRef = useRef<HTMLInputElement>(null);
	const updateInputRef = useRef<HTMLInputElement>(null);
	const [tempPreviewUrl, setTempPreviewUrl] = useState<string | undefined>(undefined);
	const [showPreview, setShowPreview] = useState(false);

	const previewSrc = useMemo(() => tempPreviewUrl ?? pdfUrl ?? undefined, [tempPreviewUrl, pdfUrl]);

	useEffect(() => {
		return () => {
			if (tempPreviewUrl) URL.revokeObjectURL(tempPreviewUrl);
		};
	}, [tempPreviewUrl]);

	useEffect(() => {
		if (fileName === undefined) {
			setTempPreviewUrl(undefined);
			setShowPreview(false);
		}
	}, [fileName]);

	const handleFiles = useCallback(
		(fileList: FileList | null | undefined, action: 'upload' | 'update') => {
			const file = fileList?.item(0);
			if (!file) return;
			const objectUrl = URL.createObjectURL(file);

			setTempPreviewUrl(prev => {
				if (prev) URL.revokeObjectURL(prev);
				return objectUrl;
			});
			if (action === 'upload') onUpload?.(file);
			if (action === 'update') onUpdate?.(file);
		},
		[onUpload, onUpdate],
	);

	const handleBeforeUpload = (file: RcFile) => {
		const objectUrl = URL.createObjectURL(file);
		setTempPreviewUrl(prev => {
			if (prev) URL.revokeObjectURL(prev);
			return objectUrl;
		});

		if (previewSrc) {
			onUpdate?.(file);
		} else {
			onUpload?.(file);
		}

		return false;
	};

	const handleClear = useCallback(() => {
		setTempPreviewUrl(undefined);
		setShowPreview(false);
	}, []);

	return (
		<div className="flex flex-col gap-4">
			<Dragger
				name="file"
				multiple={false}
				accept={accept}
				disabled={disabled}
				showUploadList={false}
				beforeUpload={handleBeforeUpload}
				openFileDialogOnClick={!disabled}
			>
				<div className="flex flex-col items-center gap-2 py-10 text-gray-500">
					<div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
						<FileTextOutlined className="text-2xl" />
					</div>
					<div className="text-center">
						<div className="font-medium">Arrastra tu PDF aquí</div>
						<div className="text-xs">usa los botones de abajo</div>
						{fileName && <div className="text-xs font-semibold text-blue-600 mt-2"> {fileName}</div>}
					</div>
				</div>
			</Dragger>

			{previewSrc && (
				<div className="flex flex-col gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
							<FileTextOutlined className="text-lg text-blue-600" />
						</div>
						<div className="flex-1">
							<div className="text-sm font-medium text-gray-700">PDF cargado correctamente</div>
							<div className="text-xs text-gray-500">Haz clic en "Ver" para previsualizar</div>
						</div>
					</div>
					<Space className="w-full justify-end">
						<Button size="small" type="primary" onClick={() => setShowPreview(true)}>
							Ver
						</Button>
						<Button size="small" onClick={() => updateInputRef.current?.click()}>
							Cambiar
						</Button>
						<Button size="small" danger onClick={() => { handleClear(); onDelete?.(); }}>
							Eliminar
						</Button>
					</Space>
				</div>
			)}

			{showPreview && previewSrc && (
				<div className="rounded-lg border border-gray-200 p-4">
					<iframe
						src={previewSrc}
						title="PDF preview"
						style={{ border: '1px solid #d9dfe3', width: '100%', height: '600px' }}
						loading="lazy"
					/>
					<Button
						block
						className="mt-4"
						onClick={() => setShowPreview(false)}
					>
						Cerrar vista previa
					</Button>
				</div>
			)}

			<input
				ref={uploadInputRef}
				type="file"
				accept={accept}
				className="hidden"
				onChange={e => handleFiles(e.target.files ?? undefined, 'upload')}
			/>
			<input
				ref={updateInputRef}
				type="file"
				accept={accept}
				className="hidden"
				onChange={e => handleFiles(e.target.files ?? undefined, 'update')}
			/>
		</div>
	);
};
