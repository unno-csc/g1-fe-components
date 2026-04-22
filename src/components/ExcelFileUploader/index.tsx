import { memo } from 'react';
import { FileExcelTwoTone } from '@ant-design/icons';
import type { Control, FieldValues, Path } from 'react-hook-form';
import {
	ControlledMultipleFileUploader,
	type IMultipleFileUploaderVariantConfig,
} from '@/components/ControlledMultipleFileUploader';

export interface IExcelFileUploaderProps<TFieldValues extends FieldValues> {
	control: Control<TFieldValues>;
	description?: string;
	disabled?: boolean;
	label: string;
	maxFiles?: number;
	maxSizeMB?: number;
	name: Path<TFieldValues>;
	optional?: boolean;
}

const excelFileUploaderVariantConfig: IMultipleFileUploaderVariantConfig = {
	accept: '.xls,.xlsx',
	acceptedExtensions: ['.xls', '.xlsx'],
	acceptedMimeTypes: [
		'application/vnd.ms-excel',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	],
	accentTextClassName: 'text-green-600',
	badgeClassName: 'border-green-200 bg-green-50 text-green-700',
	buildDefaultDescription: ({ maxFiles, maxSizeMB }) =>
		`Archivos Excel (.xls, .xlsx) | Max. ${maxFiles} archivos | ${maxSizeMB} MB c/u`,
	getBadgeIcon: () => (
		<FileExcelTwoTone twoToneColor={['#217346', '#107C41']} style={{ fontSize: 11 }} />
	),
	getDropzoneIcon: isAtMax => (
		<FileExcelTwoTone
			twoToneColor={isAtMax ? ['#9ca3af', '#d1d5db'] : ['#217346', '#107C41']}
			style={{ fontSize: 36 }}
		/>
	),
	getListIcon: () => (
		<FileExcelTwoTone twoToneColor={['#217346', '#107C41']} style={{ fontSize: 16 }} />
	),
	iconContainerClassName: 'border-green-100 bg-green-50 group-hover:bg-green-100',
	itemHoverClassName: 'hover:border-green-300 hover:bg-green-50/40',
	itemIconContainerClassName: 'border-green-100 bg-green-50',
};

const ExcelFileUploaderComponent = <TFieldValues extends FieldValues>(
	props: IExcelFileUploaderProps<TFieldValues>,
) => <ControlledMultipleFileUploader {...props} config={excelFileUploaderVariantConfig} />;

export const ExcelFileUploader = memo(
	ExcelFileUploaderComponent,
) as typeof ExcelFileUploaderComponent & { displayName?: string };

ExcelFileUploader.displayName = 'ExcelFileUploader';
