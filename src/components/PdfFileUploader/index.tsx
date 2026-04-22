import { memo } from 'react';
import { FilePdfTwoTone } from '@ant-design/icons';
import type { Control, FieldValues, Path } from 'react-hook-form';
import {
	ControlledMultipleFileUploader,
	type IMultipleFileUploaderVariantConfig,
} from '@/components/ControlledMultipleFileUploader';

export interface IPdfFileUploaderProps<TFieldValues extends FieldValues> {
	control: Control<TFieldValues>;
	description?: string;
	disabled?: boolean;
	label: string;
	maxFiles?: number;
	maxSizeMB?: number;
	name: Path<TFieldValues>;
	optional?: boolean;
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

const PdfFileUploaderComponent = <TFieldValues extends FieldValues>(
	props: IPdfFileUploaderProps<TFieldValues>,
) => <ControlledMultipleFileUploader {...props} config={pdfFileUploaderVariantConfig} />;

export const PdfFileUploader = memo(
	PdfFileUploaderComponent,
) as typeof PdfFileUploaderComponent & { displayName?: string };

PdfFileUploader.displayName = 'PdfFileUploader';
