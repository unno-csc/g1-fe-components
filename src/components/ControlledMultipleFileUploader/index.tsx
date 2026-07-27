import { useId, type ReactNode } from 'react';
import { Upload } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import {
	CheckCircleFilled,
	CloudUploadOutlined,
	DeleteOutlined,
	WarningFilled,
} from '@ant-design/icons';
import type { RcFile } from 'antd/es/upload';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { FormLabel } from '@/components/FormLabel';
import { FormLabelError } from '@/components/FormLabelError';

const { Dragger } = Upload;

const formatBytes = (bytes: number): string => {
	if (bytes === 0) return '0 B';

	const base = 1024;
	const units = ['B', 'KB', 'MB', 'GB'];
	const unitIndex = Math.floor(Math.log(bytes) / Math.log(base));

	return `${parseFloat((bytes / Math.pow(base, unitIndex)).toFixed(1))} ${units[unitIndex]}`;
};

const getFileUid = (file: Pick<File, 'name' | 'size' | 'lastModified'>): string =>
	`${file.name}-${file.size}-${file.lastModified}`;

const getFileExtension = (fileName: string): string => {
	const dotIndex = fileName.lastIndexOf('.');
	return dotIndex >= 0 ? fileName.slice(dotIndex).toLowerCase() : '';
};

const isAcceptedFileType = (
	file: Pick<RcFile, 'name' | 'type'>,
	acceptedMimeTypes: string[],
	acceptedExtensions: string[],
): boolean => {
	const fileType = file.type.toLowerCase();
	const fileExtension = getFileExtension(file.name);

	return acceptedMimeTypes.includes(fileType) || acceptedExtensions.includes(fileExtension);
};

const sanitizeFiles = (fileList: UploadFile<File>[], maxFiles: number): File[] => {
	const uniqueFiles = new Map<string, File>();

	for (const uploadFile of fileList) {
		if (!uploadFile.originFileObj) continue;

		const currentFile = uploadFile.originFileObj as File;
		uniqueFiles.set(getFileUid(currentFile), currentFile);
	}

	return Array.from(uniqueFiles.values()).slice(0, maxFiles);
};

export interface IMultipleFileUploaderVariantConfig {
	accept: string;
	acceptedExtensions: string[];
	acceptedMimeTypes: string[];
	accentTextClassName: string;
	badgeClassName: string;
	buildDefaultDescription: (params: { maxFiles: number; maxSizeMB: number }) => string;
	getBadgeIcon: () => ReactNode;
	getDropzoneIcon: (isAtMax: boolean) => ReactNode;
	getListIcon: () => ReactNode;
	iconContainerClassName: string;
	itemHoverClassName: string;
	itemIconContainerClassName: string;
}

interface IControlledMultipleFileUploaderProps<TFieldValues extends FieldValues> {
	config: IMultipleFileUploaderVariantConfig;
	control: Control<TFieldValues>;
	description?: string;
	disabled?: boolean;
	hideDropzoneWhenFull?: boolean;
	label: string;
	maxFiles?: number;
	maxSizeMB?: number;
	name: Path<TFieldValues>;
	optional?: boolean;
	readOnly?: boolean;
}

export const ControlledMultipleFileUploader = <TFieldValues extends FieldValues>({
	config,
	control,
	description,
	disabled = false,
	hideDropzoneWhenFull = false,
	label,
	maxFiles = 10,
	maxSizeMB = 10,
	name,
	optional = false,
	readOnly = false,
}: IControlledMultipleFileUploaderProps<TFieldValues>) => {
	const id = useId();
	const errorId = `${id}-error`;

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => {
				const errorMessage = fieldState.error?.message as string | undefined;
				const files = Array.isArray(field.value) ? (field.value as File[]) : [];
				const isAtMax = files.length >= maxFiles;
				const shouldHideDropzone = hideDropzoneWhenFull && isAtMax;

				const uploadFileList: UploadFile<File>[] = files.map(file => ({
					uid: getFileUid(file),
					name: file.name,
					originFileObj: file as RcFile,
					size: file.size,
					status: 'done',
					type: file.type,
				}));

				const beforeUpload = (file: RcFile): boolean | typeof Upload.LIST_IGNORE => {
					if (readOnly) return Upload.LIST_IGNORE;

					const isValidType = isAcceptedFileType(
						file,
						config.acceptedMimeTypes,
						config.acceptedExtensions,
					);
					if (!isValidType) return Upload.LIST_IGNORE;

					const isWithinSize = file.size / 1024 / 1024 <= maxSizeMB;
					if (!isWithinSize) return Upload.LIST_IGNORE;

					if (isAtMax) return Upload.LIST_IGNORE;

					return false;
				};

				const handleChange: UploadProps['onChange'] = ({ fileList }) => {
					const nextFiles = sanitizeFiles(
						fileList.filter(file =>
							file.originFileObj
								? isAcceptedFileType(
										file.originFileObj as RcFile,
										config.acceptedMimeTypes,
										config.acceptedExtensions,
								  ) && (file.originFileObj as File).size / 1024 / 1024 <= maxSizeMB
								: false,
						),
						maxFiles,
					);

					field.onChange(nextFiles);
				};

				const removeFile = (index: number) => {
					field.onChange(files.filter((_, currentIndex) => currentIndex !== index));
				};

				return (
					<div className="flex flex-col gap-1">
						<FormLabel label={label} htmlFor={id} optional={optional} />

						{!shouldHideDropzone && (
							<Dragger
								id={id}
								accept={config.accept}
								className="group"
								multiple
								showUploadList={false}
								disabled={disabled || isAtMax}
								fileList={uploadFileList}
								beforeUpload={beforeUpload}
								onChange={handleChange}
								openFileDialogOnClick={!disabled && !isAtMax && !readOnly}
								style={{
									borderColor: errorMessage !== undefined ? '#ef4444' : undefined,
									pointerEvents: readOnly ? 'none' : undefined,
								}}
							>
								<div className="flex flex-col items-center gap-3 px-4 py-5">
									<div className="relative">
										<div
											className={`flex h-16 w-16 items-center justify-center rounded-2xl border shadow-sm transition-colors duration-200 ${
												isAtMax
													? 'border-gray-200 bg-gray-50'
													: config.iconContainerClassName
											}`}
										>
											{config.getDropzoneIcon(isAtMax)}
										</div>
										{files.length > 0 && !isAtMax && (
											<div className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 shadow">
												<CheckCircleFilled style={{ fontSize: 11, color: 'white' }} />
											</div>
										)}
										{isAtMax && (
											<div className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 shadow">
												<WarningFilled style={{ fontSize: 11, color: 'white' }} />
											</div>
										)}
									</div>

									<div className="space-y-1 text-center">
										{isAtMax ? (
											<p className="text-sm font-semibold text-gray-400">
												Limite de {maxFiles} archivos alcanzado
											</p>
										) : (
											<p className="text-sm font-semibold text-gray-700">
												<span className={config.accentTextClassName}>Haz clic</span> o arrastra tus
												archivos aqui
											</p>
										)}
										<p className="text-xs text-gray-400">
											{description ??
												config.buildDefaultDescription({
													maxFiles,
													maxSizeMB,
												})}
										</p>
									</div>

									<div className="flex items-center gap-2">
										{!isAtMax && (
											<div className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1">
												<CloudUploadOutlined style={{ fontSize: 12, color: '#6b7280' }} />
												<span className="text-xs text-gray-500">Subir archivos</span>
											</div>
										)}
										{files.length > 0 && (
											<div
												className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 ${config.badgeClassName}`}
											>
												{config.getBadgeIcon()}
												<span className="text-xs font-medium">
													{files.length} {files.length === 1 ? 'archivo' : 'archivos'}
												</span>
											</div>
										)}
									</div>
								</div>
							</Dragger>
						)}

						{errorMessage !== undefined && <FormLabelError label={errorMessage} id={errorId} />}

						{files.length > 0 && (
							<ul className="m-0 mt-1 flex list-none flex-col gap-1.5 p-0">
								{files.map((file, index) => (
									<li
										key={getFileUid(file)}
										className={`group flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 shadow-sm transition-all duration-150 ${config.itemHoverClassName}`}
									>
										<div
											className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${config.itemIconContainerClassName}`}
										>
											{config.getListIcon()}
										</div>

										<div className="min-w-0 flex-1">
											<p
												className="truncate text-sm font-medium leading-tight text-gray-700"
												title={file.name}
											>
												{file.name}
											</p>
											<p className="mt-0.5 text-xs text-gray-400">{formatBytes(file.size)}</p>
										</div>

										<span className="mr-1 shrink-0 font-mono text-xs text-gray-300 group-hover:hidden">
											{String(index + 1).padStart(2, '0')}
										</span>

										{!disabled && !readOnly && (
											<button
												type="button"
												onClick={() => removeFile(index)}
												className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition-all duration-150 hover:bg-red-50 hover:text-red-500 group-hover:flex"
												aria-label={`Eliminar ${file.name}`}
											>
												<DeleteOutlined style={{ fontSize: 14 }} />
											</button>
										)}
									</li>
								))}
							</ul>
						)}
					</div>
				);
			}}
		/>
	);
};
