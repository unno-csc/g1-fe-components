import { memo, useState } from 'react';
import { FilePdfTwoTone } from '@ant-design/icons';
import type { Control, FieldValues, Path } from 'react-hook-form';
import {
	ControlledMultipleFileUploader,
	type IMultipleFileUploaderVariantConfig,
} from '@/components/ControlledMultipleFileUploader';
import { FormLabel } from '@/components/FormLabel';

export interface IPdfFileUploaderProps<TFieldValues extends FieldValues> {
	control: Control<TFieldValues>;
	description?: string;
	disabled?: boolean;
	existingFileUrl?: string;
	existingFileName?: string;
	hideDropzoneWhenFull?: boolean;
	label: string;
	maxFiles?: number;
	maxSizeMB?: number;
	name: Path<TFieldValues>;
	onExistingFileClick?: () => void;
	optional?: boolean;
	readOnly?: boolean;
}

const pdfFileUploaderVariantConfig: IMultipleFileUploaderVariantConfig = {
	accept: '.pdf,application/pdf',
	acceptedExtensions: ['.pdf'],
	acceptedMimeTypes: ['application/pdf'],
	accentTextClassName: 'text-red-600',
	badgeClassName: 'border-red-200 bg-red-50 text-red-700',
	buildDefaultDescription: ({ maxFiles, maxSizeMB }) =>
		`Archivos PDF (.pdf) | Max. ${maxFiles} archivos | ${maxSizeMB} MB c/u`,
	getBadgeIcon: () => (
		<FilePdfTwoTone twoToneColor={['#cf1322', '#ff4d4f']} style={{ fontSize: 11 }} />
	),
	getDropzoneIcon: isAtMax => (
		<FilePdfTwoTone
			twoToneColor={isAtMax ? ['#9ca3af', '#d1d5db'] : ['#cf1322', '#ff4d4f']}
			style={{ fontSize: 36 }}
		/>
	),
	getListIcon: () => (
		<FilePdfTwoTone twoToneColor={['#cf1322', '#ff4d4f']} style={{ fontSize: 16 }} />
	),
	iconContainerClassName: 'border-red-100 bg-red-50 group-hover:bg-red-100',
	itemHoverClassName: 'hover:border-red-300 hover:bg-red-50/40',
	itemIconContainerClassName: 'border-red-100 bg-red-50',
};

const PdfFileUploaderComponent = <TFieldValues extends FieldValues>({
	control,
	description,
	disabled = false,
	existingFileUrl: _existingFileUrl,
	existingFileName,
	hideDropzoneWhenFull,
	label,
	maxFiles,
	maxSizeMB,
	name,
	onExistingFileClick,
	optional,
	readOnly = false,
}: IPdfFileUploaderProps<TFieldValues>) => {
	const hasExisting = !!(existingFileName ?? _existingFileUrl);
	const [showUploader, setShowUploader] = useState(!hasExisting);

	if (!showUploader) {
		return (
			<div className="flex flex-col gap-1">
				<FormLabel label={label} optional={optional} />
				<ul className="m-0 flex list-none flex-col gap-1.5 p-0">
					<li className="group flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 shadow-sm transition-all duration-150 hover:border-red-300 hover:bg-red-50/40">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-100 bg-red-50">
							<FilePdfTwoTone twoToneColor={['#cf1322', '#ff4d4f']} style={{ fontSize: 16 }} />
						</div>

						<div className="min-w-0 flex-1">
							{onExistingFileClick ? (
								<button
									type="button"
									onClick={onExistingFileClick}
									className="w-full truncate text-left text-sm font-medium leading-tight text-red-600 underline-offset-2 hover:underline"
									title={existingFileName}
								>
									{existingFileName ?? 'Archivo cargado'}
								</button>
							) : (
								<p
									className="truncate text-sm font-medium leading-tight text-gray-700"
									title={existingFileName}
								>
									{existingFileName ?? 'Archivo cargado'}
								</p>
							)}
						</div>

						{!disabled && !readOnly && (
							<button
								type="button"
								onClick={() => setShowUploader(true)}
								className="shrink-0 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-500 transition-all duration-150 hover:border-red-300 hover:text-red-600"
							>
								Cambiar
							</button>
						)}
					</li>
				</ul>
			</div>
		);
	}

	return (
		<ControlledMultipleFileUploader
			control={control}
			description={description}
			disabled={disabled}
			hideDropzoneWhenFull={hideDropzoneWhenFull}
			label={label}
			maxFiles={maxFiles}
			maxSizeMB={maxSizeMB}
			name={name}
			optional={optional}
			readOnly={readOnly}
			config={pdfFileUploaderVariantConfig}
		/>
	);
};

export const PdfFileUploader = memo(
	PdfFileUploaderComponent,
) as typeof PdfFileUploaderComponent & { displayName?: string };

PdfFileUploader.displayName = 'PdfFileUploader';
