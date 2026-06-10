import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form';
import { PdfFileUploader } from '../../components/PdfFileUploader';

type FormValues = {
	files: File[];
};

const FilesCounter = () => {
	const { control } = useFormContext<FormValues>();
	const files = useWatch({
		control,
		name: 'files',
	});

	return <span data-testid="files-count">{files?.length ?? 0}</span>;
};

function TestHarness({ withCounter = false }: { withCounter?: boolean }) {
	const methods = useForm<FormValues>({
		defaultValues: {
			files: [],
		},
		mode: 'onBlur',
		reValidateMode: 'onBlur',
	});

	return (
		<FormProvider {...methods}>
			<PdfFileUploader<FormValues> name="files" label="Archivos PDF" control={methods.control} />
			{withCounter && <FilesCounter />}
		</FormProvider>
	);
}

describe('PdfFileUploader component', () => {
	it('renders label and dropzone texts', () => {
		render(<TestHarness />);

		expect(screen.getByText('Archivos PDF')).toBeInTheDocument();
		expect(screen.getByText(/Haz clic/i)).toBeInTheDocument();
		expect(screen.getByText(/Archivos PDF \(.pdf\)/i)).toBeInTheDocument();
	});

	it('adds a valid pdf file to the form state', async () => {
		const user = userEvent.setup();
		const { container } = render(<TestHarness withCounter />);
		const input = container.querySelector('input[type="file"]') as HTMLInputElement;
		const pdfFile = new File(['pdf-content'], 'contrato.pdf', { type: 'application/pdf' });

		await user.upload(input, pdfFile);

		await waitFor(() => {
			expect(screen.getByTestId('files-count')).toHaveTextContent('1');
		});

		expect(screen.getByText('contrato.pdf')).toBeInTheDocument();
		expect(screen.getByText('1 archivo')).toBeInTheDocument();
	});

	it('ignores files that are not pdf', async () => {
		const user = userEvent.setup();
		const { container } = render(<TestHarness withCounter />);
		const input = container.querySelector('input[type="file"]') as HTMLInputElement;
		const invalidFile = new File(['text-content'], 'nota.txt', { type: 'text/plain' });

		await user.upload(input, invalidFile);

		await waitFor(() => {
			expect(screen.getByTestId('files-count')).toHaveTextContent('0');
		});

		expect(screen.queryByText('nota.txt')).not.toBeInTheDocument();
	});
});

describe('PdfFileUploader — modo edicion', () => {
	function EditHarness({
		existingFileName,
		existingFileUrl,
		onExistingFileClick,
		disabled,
	}: {
		existingFileName?: string;
		existingFileUrl?: string;
		onExistingFileClick?: () => void;
		disabled?: boolean;
	}) {
		const methods = useForm<FormValues>({
			defaultValues: { files: [] },
		});

		return (
			<FormProvider {...methods}>
				<PdfFileUploader<FormValues>
					name="files"
					label="Archivos PDF"
					control={methods.control}
					existingFileName={existingFileName}
					existingFileUrl={existingFileUrl}
					onExistingFileClick={onExistingFileClick}
					disabled={disabled}
				/>
			</FormProvider>
		);
	}

	it('muestra el nombre del archivo existente cuando se pasa existingFileName', () => {
		render(<EditHarness existingFileName="contrato.pdf" />);

		expect(screen.getByText('contrato.pdf')).toBeInTheDocument();
		expect(screen.queryByText(/Haz clic/i)).not.toBeInTheDocument();
	});

	it('muestra el boton Cambiar cuando hay archivo existente y no esta deshabilitado', () => {
		render(<EditHarness existingFileName="contrato.pdf" />);

		expect(screen.getByRole('button', { name: 'Cambiar' })).toBeInTheDocument();
	});

	it('al hacer clic en Cambiar muestra el uploader', async () => {
		const user = userEvent.setup();
		render(<EditHarness existingFileName="contrato.pdf" />);

		await user.click(screen.getByRole('button', { name: 'Cambiar' }));

		expect(screen.getByText(/Haz clic/i)).toBeInTheDocument();
		expect(screen.queryByText('contrato.pdf')).not.toBeInTheDocument();
	});

	it('llama a onExistingFileClick al hacer clic en el nombre del archivo', async () => {
		const user = userEvent.setup();
		const onExistingFileClick = vi.fn();
		render(
			<EditHarness existingFileName="contrato.pdf" onExistingFileClick={onExistingFileClick} />,
		);

		await user.click(screen.getByText('contrato.pdf'));

		expect(onExistingFileClick).toHaveBeenCalledTimes(1);
	});

	it('no muestra el boton Cambiar cuando esta deshabilitado', () => {
		render(<EditHarness existingFileName="contrato.pdf" disabled />);

		expect(screen.queryByRole('button', { name: 'Cambiar' })).not.toBeInTheDocument();
	});

	it('muestra el uploader normal cuando no se pasan props de archivo existente', () => {
		render(<EditHarness />);

		expect(screen.getByText(/Haz clic/i)).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: 'Cambiar' })).not.toBeInTheDocument();
	});

	it('muestra texto por defecto cuando hay existingFileUrl pero no existingFileName', () => {
		render(<EditHarness existingFileUrl="https://example.com/file.pdf" />);

		expect(screen.getByText('Archivo cargado')).toBeInTheDocument();
	});
});
