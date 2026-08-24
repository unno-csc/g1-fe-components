import { memo, useId, useMemo, useState, type ReactNode } from 'react';
import { Upload } from 'antd';
import type { UploadProps } from 'antd';
import type { RcFile, UploadFile } from 'antd/es/upload';
import {
	CheckCircleFilled,
	CloudUploadOutlined,
	DeleteOutlined,
	FileOutlined,
	WarningFilled,
} from '@ant-design/icons';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import classNames from 'classnames';
import { FormLabel } from '@/components/FormLabel';
import { FormLabelError } from '@/components/FormLabelError';
import { useFormConfig } from '@/components/FormConfigProvider';

export type TFormFileUploaderVariantColor = 'amber' | 'blue' | 'green' | 'red' | 'gray' | 'primary';

export interface IFormFileUploaderProps<TFieldValues extends FieldValues> {
	accept?: string;
	className?: string;
	control: Control<TFieldValues>;
	description?: string;
	disabled?: boolean;
	dropzoneText?: string;
	errorCustom?: string;
	existingFileName?: string;
	existingFileUrl?: string;
	hideDropzoneWhenFull?: boolean;
	icon?: ReactNode;
	label?: string;
	listIcon?: ReactNode;
	maxFiles?: number;
	maxSizeMB?: number;
	multiple?: boolean;
	name: Path<TFieldValues>;
	onExistingFileClick?: () => void;
	onFileChange?: (file: File | File[] | null) => void;
	optional?: boolean;
	readOnly?: boolean;
	showDirtyState?: boolean;
	variantColor?: TFormFileUploaderVariantColor;
}

interface IVariantTheme {
	accentTextClassName: string;
	badgeClassName: string;
	badgeIcon: ReactNode;
	dropzoneIcon: ReactNode;
	iconContainerClassName: string;
	itemHoverClassName: string;
	itemIconContainerClassName: string;
	listIcon: ReactNode;
}

const getVariantTheme = (
	variantColor: TFormFileUploaderVariantColor,
	customDropzoneIcon?: ReactNode,
	customListIcon?: ReactNode,
): IVariantTheme => {
	switch (variantColor) {
		case 'blue':
			return {
				accentTextClassName: 'text-blue-600',
				badgeClassName: 'border-blue-200 bg-blue-50 text-blue-700',
				badgeIcon: <FileOutlined style={{ fontSize: 11 }} />,
				dropzoneIcon: customDropzoneIcon ?? (
					<CloudUploadOutlined style={{ fontSize: 32, color: '#2279A2' }} />
				),
				iconContainerClassName: 'border-blue-100 bg-blue-50 group-hover:bg-blue-100',
				itemHoverClassName: 'hover:border-blue-300 hover:bg-blue-50/40',
				itemIconContainerClassName: 'border-blue-100 bg-blue-50 text-blue-600',
				listIcon: customListIcon ?? <FileOutlined style={{ fontSize: 16 }} />,
			};
		case 'green':
			return {
				accentTextClassName: 'text-green-600',
				badgeClassName: 'border-green-200 bg-green-50 text-green-700',
				badgeIcon: <FileOutlined style={{ fontSize: 11 }} />,
				dropzoneIcon: customDropzoneIcon ?? (
					<CloudUploadOutlined style={{ fontSize: 32, color: '#2C962F' }} />
				),
				iconContainerClassName: 'border-green-100 bg-green-50 group-hover:bg-green-100',
				itemHoverClassName: 'hover:border-green-300 hover:bg-green-50/40',
				itemIconContainerClassName: 'border-green-100 bg-green-50 text-green-700',
				listIcon: customListIcon ?? <FileOutlined style={{ fontSize: 16 }} />,
			};
		case 'red':
			return {
				accentTextClassName: 'text-red-600',
				badgeClassName: 'border-red-200 bg-red-50 text-red-700',
				badgeIcon: <FileOutlined style={{ fontSize: 11 }} />,
				dropzoneIcon: customDropzoneIcon ?? (
					<CloudUploadOutlined style={{ fontSize: 32, color: '#E53935' }} />
				),
				iconContainerClassName: 'border-red-100 bg-red-50 group-hover:bg-red-100',
				itemHoverClassName: 'hover:border-red-300 hover:bg-red-50/40',
				itemIconContainerClassName: 'border-red-100 bg-red-50 text-red-600',
				listIcon: customListIcon ?? <FileOutlined style={{ fontSize: 16 }} />,
			};
		case 'primary':
			return {
				accentTextClassName: 'text-primary-600',
				badgeClassName: 'border-primary-200 bg-primary-50 text-primary-600',
				badgeIcon: <FileOutlined style={{ fontSize: 11 }} />,
				dropzoneIcon: customDropzoneIcon ?? (
					<CloudUploadOutlined style={{ fontSize: 32, color: '#f25162' }} />
				),
				iconContainerClassName: 'border-primary-100 bg-primary-50 group-hover:bg-primary-100',
				itemHoverClassName: 'hover:border-primary-300 hover:bg-primary-50/40',
				itemIconContainerClassName: 'border-primary-100 bg-primary-50 text-primary-600',
				listIcon: customListIcon ?? <FileOutlined style={{ fontSize: 16 }} />,
			};
		case 'gray':
			return {
				accentTextClassName: 'text-gray-700',
				badgeClassName: 'border-gray-200 bg-gray-50 text-gray-700',
				badgeIcon: <FileOutlined style={{ fontSize: 11 }} />,
				dropzoneIcon: customDropzoneIcon ?? (
					<CloudUploadOutlined style={{ fontSize: 32, color: '#4A5D85' }} />
				),
				iconContainerClassName: 'border-gray-200 bg-gray-50 group-hover:bg-gray-100',
				itemHoverClassName: 'hover:border-gray-300 hover:bg-gray-50/40',
				itemIconContainerClassName: 'border-gray-200 bg-gray-50 text-gray-600',
				listIcon: customListIcon ?? <FileOutlined style={{ fontSize: 16 }} />,
			};
		case 'amber':
		default:
			return {
				accentTextClassName: 'text-amber-600',
				badgeClassName: 'border-amber-200 bg-amber-50 text-amber-700',
				badgeIcon: <FileOutlined style={{ fontSize: 11 }} />,
				dropzoneIcon: customDropzoneIcon ?? (
					<CloudUploadOutlined style={{ fontSize: 32, color: '#F9A825' }} />
				),
				iconContainerClassName: 'border-amber-200 bg-amber-50 group-hover:bg-amber-100',
				itemHoverClassName: 'hover:border-amber-300 hover:bg-amber-50/40',
				itemIconContainerClassName: 'border-amber-200 bg-amber-50 text-amber-600',
				listIcon: customListIcon ?? <FileOutlined style={{ fontSize: 16 }} />,
			};
	}
};

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

const isAcceptedFileType = (file: Pick<File, 'name' | 'type'>, accept?: string): boolean => {
	if (!accept || accept.trim() === '' || accept === '*') return true;

	const mimeTypesAndExts = accept
		.split(',')
		.map(item => item.trim().toLowerCase())
		.filter(Boolean);

	const fileType = (file.type || '').toLowerCase();
	const fileExt = getFileExtension(file.name);

	return mimeTypesAndExts.some(pattern => {
		if (pattern.startsWith('.')) {
			return fileExt === pattern;
		}

		if (pattern.endsWith('/*')) {
			const baseType = pattern.replace('/*', '');
			return fileType.startsWith(`${baseType}/`);
		}

		return fileType === pattern;
	});
};

const isWithinSizeLimit = (file: Pick<File, 'size'>, maxSizeMB?: number): boolean => {
	if (!maxSizeMB || maxSizeMB <= 0) return true;
	return file.size / (1024 * 1024) <= maxSizeMB;
};

const FormFileUploaderComponent = <TFieldValues extends FieldValues>({
	accept,
	className,
	control,
	description,
	disabled = false,
	dropzoneText,
	errorCustom,
	existingFileName,
	existingFileUrl,
	hideDropzoneWhenFull = false,
	icon,
	label,
	listIcon,
	maxFiles = 10,
	maxSizeMB = 20,
	multiple = false,
	name,
	onExistingFileClick,
	onFileChange,
	optional,
	readOnly = false,
	showDirtyState,
	variantColor = 'amber',
}: IFormFileUploaderProps<TFieldValues>) => {
	const id = useId();
	const errorId = `${id}-error`;
	const { showDirtyState: contextShowDirtyState } = useFormConfig();
	const isDirtyStateActive = showDirtyState ?? contextShowDirtyState;

	const [isExistingRemoved, setIsExistingRemoved] = useState(false);

	const theme = useMemo(
		() => getVariantTheme(variantColor, icon, listIcon),
		[variantColor, icon, listIcon],
	);

	const defaultDescription = useMemo(() => {
		if (description) return description;

		if (multiple) {
			const formats = accept ? `Formatos soportados: ${accept}` : 'Todos los formatos';
			return `${formats} | Máx. ${maxFiles} archivos | ${maxSizeMB} MB c/u`;
		}

		if (accept && maxSizeMB) {
			return `Formatos soportados: ${accept} (Máx: ${maxSizeMB} MB)`;
		}

		if (accept) {
			return `Formatos soportados: ${accept}`;
		}

		if (maxSizeMB) {
			return `Tamaño máximo: ${maxSizeMB} MB`;
		}

		return 'Haga clic o arrastre para seleccionar';
	}, [accept, description, maxFiles, maxSizeMB, multiple]);

	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => {
				const errorMessage = errorCustom ?? (fieldState.error?.message as string | undefined);
				const isInteractivityDisabled = disabled || readOnly;

				if (!multiple) {
					const rawValue = field.value as unknown;
					const isFileInstance = rawValue instanceof File;
					const currentFile = isFileInstance ? (rawValue as File) : null;

					const hasSelectedFile = isFileInstance && currentFile !== null;
					const hasExistingFile =
						!isExistingRemoved && !hasSelectedFile && Boolean(existingFileName || existingFileUrl);
					const hasFile = hasSelectedFile || hasExistingFile;

					const displayedFileName = hasSelectedFile
						? currentFile?.name
						: (existingFileName ?? (existingFileUrl ? 'Archivo cargado' : undefined));

					const displayedFileSize =
						hasSelectedFile && currentFile ? formatBytes(currentFile.size) : undefined;

					const handleClearSingleFile = () => {
						if (isInteractivityDisabled) return;
						if (hasExistingFile) {
							setIsExistingRemoved(true);
						}
						field.onChange(null);
						onFileChange?.(null);
					};

					const beforeUploadSingle = (file: RcFile): boolean | typeof Upload.LIST_IGNORE => {
						if (isInteractivityDisabled) return Upload.LIST_IGNORE;

						const isValidType = isAcceptedFileType(file, accept);
						if (!isValidType) return Upload.LIST_IGNORE;

						const isWithinSize = isWithinSizeLimit(file, maxSizeMB);
						if (!isWithinSize) return Upload.LIST_IGNORE;

						return false;
					};

					const handleChangeSingle: UploadProps['onChange'] = info => {
						if (isInteractivityDisabled) return;

						const fileList = info.fileList;
						const lastFile = fileList[fileList.length - 1];

						if (!lastFile) {
							field.onChange(null);
							onFileChange?.(null);
							return;
						}

						const fileObj =
							(lastFile.originFileObj as File | undefined) ?? (lastFile as unknown as File);

						if (fileObj instanceof File) {
							if (isAcceptedFileType(fileObj, accept) && isWithinSizeLimit(fileObj, maxSizeMB)) {
								setIsExistingRemoved(true);
								field.onChange(fileObj);
								onFileChange?.(fileObj);
							}
						}
					};

					return (
						<div
							className={classNames(
								'flex flex-col gap-1',
								{ 'dirty-field': isDirtyStateActive && fieldState.isDirty },
								className,
							)}
						>
							{label && <FormLabel label={label} htmlFor={id} optional={optional} />}

							{!hasFile ? (
								<Upload.Dragger
									id={id}
									accept={accept}
									multiple={false}
									showUploadList={false}
									disabled={isInteractivityDisabled}
									beforeUpload={beforeUploadSingle}
									onChange={handleChangeSingle}
									openFileDialogOnClick={!isInteractivityDisabled}
									aria-invalid={Boolean(errorMessage)}
									aria-describedby={errorMessage ? errorId : undefined}
									className="group"
								>
									<div className="flex flex-col items-center gap-3 px-4 py-5">
										<div className="relative">
											<div
												className={`flex h-16 w-16 items-center justify-center rounded-2xl border shadow-sm transition-colors duration-200 ${theme.iconContainerClassName}`}
											>
												{theme.dropzoneIcon}
											</div>
										</div>

										<div className="space-y-1 text-center">
											<p className="text-sm font-semibold text-gray-700">
												{dropzoneText ? (
													dropzoneText
												) : (
													<>
														<span className={theme.accentTextClassName}>Haz clic</span> o arrastra
														tu archivo aquí
													</>
												)}
											</p>
											<p className="text-xs text-gray-400">{defaultDescription}</p>
										</div>

										<div className="flex items-center gap-2">
											<div className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1">
												<CloudUploadOutlined style={{ fontSize: 12, color: '#6b7280' }} />
												<span className="text-xs text-gray-500">Subir archivo</span>
											</div>
										</div>
									</div>
								</Upload.Dragger>
							) : (
								<ul className="m-0 flex list-none flex-col gap-1.5 p-0">
									<li
										className={`group flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 shadow-sm transition-all duration-150 ${theme.itemHoverClassName}`}
									>
										<div
											className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${theme.itemIconContainerClassName}`}
										>
											{theme.listIcon}
										</div>

										<div className="min-w-0 flex-1">
											{hasExistingFile && onExistingFileClick ? (
												<button
													type="button"
													onClick={onExistingFileClick}
													className={`w-full truncate text-left text-sm font-medium leading-tight underline-offset-2 hover:underline ${theme.accentTextClassName}`}
													title={displayedFileName}
												>
													{displayedFileName}
												</button>
											) : (
												<p
													className="truncate text-sm font-medium leading-tight text-gray-700"
													title={displayedFileName}
												>
													{displayedFileName}
												</p>
											)}
											{displayedFileSize && (
												<p className="mt-0.5 text-xs text-gray-400">{displayedFileSize}</p>
											)}
										</div>

										{!isInteractivityDisabled && (
											<button
												type="button"
												className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition-all duration-150 hover:bg-red-50 hover:text-red-500 group-hover:flex focus:outline-none"
												onClick={event => {
													event.preventDefault();
													event.stopPropagation();
													handleClearSingleFile();
												}}
												aria-label="Quitar archivo"
												title="Quitar archivo"
											>
												<DeleteOutlined style={{ fontSize: 14 }} />
											</button>
										)}
									</li>
								</ul>
							)}

							{errorMessage && <FormLabelError label={errorMessage} id={errorId} />}
						</div>
					);
				}

				const files: File[] = Array.isArray(field.value)
					? (field.value.filter((item: unknown): item is File => item instanceof File))
					: [];
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

				const beforeUploadMultiple = (file: RcFile): boolean | typeof Upload.LIST_IGNORE => {
					if (isInteractivityDisabled || isAtMax) return Upload.LIST_IGNORE;

					const isValidType = isAcceptedFileType(file, accept);
					if (!isValidType) return Upload.LIST_IGNORE;

					const isWithinSize = isWithinSizeLimit(file, maxSizeMB);
					if (!isWithinSize) return Upload.LIST_IGNORE;

					return false;
				};

				const handleChangeMultiple: UploadProps['onChange'] = ({ fileList }) => {
					if (isInteractivityDisabled) return;

					const uniqueMap = new Map<string, File>();

					for (const uploadItem of fileList) {
						const fileObj =
							(uploadItem.originFileObj as File | undefined) ?? (uploadItem as unknown as File);
						if (fileObj instanceof File) {
							if (isAcceptedFileType(fileObj, accept) && isWithinSizeLimit(fileObj, maxSizeMB)) {
								uniqueMap.set(getFileUid(fileObj), fileObj);
							}
						}
					}

					const nextFiles = Array.from(uniqueMap.values()).slice(0, maxFiles);
					field.onChange(nextFiles);
					onFileChange?.(nextFiles);
				};

				const handleRemoveMultipleFile = (indexToRemove: number) => {
					if (isInteractivityDisabled) return;
					const nextFiles = files.filter((_, index) => index !== indexToRemove);
					field.onChange(nextFiles);
					onFileChange?.(nextFiles);
				};

				return (
					<div
						className={classNames(
							'flex flex-col gap-1',
							{ 'dirty-field': isDirtyStateActive && fieldState.isDirty },
							className,
						)}
					>
						{label && <FormLabel label={label} htmlFor={id} optional={optional} />}

						{!shouldHideDropzone && (
							<Upload.Dragger
								id={id}
								accept={accept}
								multiple
								showUploadList={false}
								disabled={isInteractivityDisabled || isAtMax}
								fileList={uploadFileList}
								beforeUpload={beforeUploadMultiple}
								onChange={handleChangeMultiple}
								openFileDialogOnClick={!isInteractivityDisabled && !isAtMax}
								aria-invalid={Boolean(errorMessage)}
								aria-describedby={errorMessage ? errorId : undefined}
								className="group"
							>
								<div className="flex flex-col items-center gap-3 px-4 py-5">
									<div className="relative">
										<div
											className={`flex h-16 w-16 items-center justify-center rounded-2xl border shadow-sm transition-colors duration-200 ${
												isAtMax ? 'border-gray-200 bg-gray-50' : theme.iconContainerClassName
											}`}
										>
											{theme.dropzoneIcon}
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
												Límite de {maxFiles} archivos alcanzado
											</p>
										) : (
											<p className="text-sm font-semibold text-gray-700">
												{dropzoneText ? (
													dropzoneText
												) : (
													<>
														<span className={theme.accentTextClassName}>Haz clic</span> o arrastra
														tus archivos aquí
													</>
												)}
											</p>
										)}
										<p className="text-xs text-gray-400">{defaultDescription}</p>
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
												className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 ${theme.badgeClassName}`}
											>
												{theme.badgeIcon}
												<span className="text-xs font-medium">
													{files.length} {files.length === 1 ? 'archivo' : 'archivos'}
												</span>
											</div>
										)}
									</div>
								</div>
							</Upload.Dragger>
						)}

						{errorMessage && <FormLabelError label={errorMessage} id={errorId} />}

						{files.length > 0 && (
							<ul className="m-0 mt-1 flex list-none flex-col gap-1.5 p-0">
								{files.map((file, index) => (
									<li
										key={getFileUid(file)}
										className={`group flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 shadow-sm transition-all duration-150 ${theme.itemHoverClassName}`}
									>
										<div
											className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${theme.itemIconContainerClassName}`}
										>
											{theme.listIcon}
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

										{!isInteractivityDisabled && (
											<button
												type="button"
												className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition-all duration-150 hover:bg-red-50 hover:text-red-500 group-hover:flex focus:outline-none"
												onClick={() => handleRemoveMultipleFile(index)}
												aria-label={`Eliminar ${file.name}`}
												title={`Eliminar ${file.name}`}
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

export const FormFileUploader = memo(
	FormFileUploaderComponent,
) as typeof FormFileUploaderComponent & {
	displayName?: string;
};

FormFileUploader.displayName = 'FormFileUploader';
