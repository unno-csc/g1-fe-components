import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form';
import { FormFileUploader, type IFormFileUploaderProps } from '../../components/FormFileUploader';

type SingleFormValues = {
	file: File | null;
};

type MultipleFormValues = {
	files: File[];
};

const SingleFileWatcher = () => {
	const { control } = useFormContext<SingleFormValues>();
	const file = useWatch({ control, name: 'file' });
	return <span data-testid="single-file-name">{file ? file.name : 'no-file'}</span>;
};

const MultipleFilesWatcher = () => {
	const { control } = useFormContext<MultipleFormValues>();
	const files = useWatch({ control, name: 'files' });
	return <span data-testid="multiple-files-count">{files?.length ?? 0}</span>;
};

const SingleTestHarness = (props: Partial<IFormFileUploaderProps<SingleFormValues>> & { withWatcher?: boolean }) => {
	const { withWatcher = false, ...uploaderProps } = props;
	const methods = useForm<SingleFormValues>({
		defaultValues: { file: null },
		mode: 'onBlur',
	});

	return (
		<FormProvider {...methods}>
			<FormFileUploader<SingleFormValues>
				name="file"
				label="Firma Electrónica"
				control={methods.control}
				{...uploaderProps}
			/>
			{withWatcher && <SingleFileWatcher />}
		</FormProvider>
	);
};

const MultipleTestHarness = (
	props: Partial<IFormFileUploaderProps<MultipleFormValues>> & { withWatcher?: boolean },
) => {
	const { withWatcher = false, ...uploaderProps } = props;
	const methods = useForm<MultipleFormValues>({
		defaultValues: { files: [] },
		mode: 'onBlur',
	});

	return (
		<FormProvider {...methods}>
			<FormFileUploader<MultipleFormValues>
				name="files"
				label="Documentos"
				multiple
				control={methods.control}
				{...uploaderProps}
			/>
			{withWatcher && <MultipleFilesWatcher />}
		</FormProvider>
	);
};

describe('FormFileUploader — Modo Single File (Default)', () => {
	it('renderiza correctamente el label, texto de zona de arrastre y formatos por defecto', () => {
		render(
			<SingleTestHarness
				accept=".p12,.pfx"
				maxSizeMB={20}
				dropzoneText="Haga clic o arrastre el archivo de firma electrónica aquí"
			/>,
		);

		expect(screen.getByText('Firma Electrónica')).toBeInTheDocument();
		expect(screen.getByText('Haga clic o arrastre el archivo de firma electrónica aquí')).toBeInTheDocument();
		expect(screen.getByText(/Formatos soportados: \.p12,\.pfx \(Máx: 20 MB\)/i)).toBeInTheDocument();
	});

	it('renderiza etiqueta opcional cuando optional es true', () => {
		render(<SingleTestHarness optional />);

		expect(screen.getByText('(Opcional)')).toBeInTheDocument();
	});

	it('carga un archivo válido (.p12) y actualiza el estado y la vista', async () => {
		const user = userEvent.setup();
		const handleFileChange = vi.fn();
		const { container } = render(
			<SingleTestHarness accept=".p12,.pfx" maxSizeMB={20} onFileChange={handleFileChange} withWatcher />,
		);

		const input = container.querySelector('input[type="file"]') as HTMLInputElement;
		const file = new File(['dummy-cert-content'], 'certificado_2026.p12', {
			type: 'application/x-pkcs12',
		});

		await user.upload(input, file);

		await waitFor(() => {
			expect(screen.getByTestId('single-file-name')).toHaveTextContent('certificado_2026.p12');
		});

		expect(screen.getAllByText('certificado_2026.p12').length).toBeGreaterThan(0);
		expect(handleFileChange).toHaveBeenCalledWith(file);
	});

	it('rechaza archivos que no cumplen con la extensión configurada en accept', async () => {
		const user = userEvent.setup();
		const handleFileChange = vi.fn();
		const { container } = render(
			<SingleTestHarness accept=".p12,.pfx" maxSizeMB={20} onFileChange={handleFileChange} withWatcher />,
		);

		const input = container.querySelector('input[type="file"]') as HTMLInputElement;
		const invalidFile = new File(['text'], 'documento.txt', { type: 'text/plain' });

		await user.upload(input, invalidFile);

		await waitFor(() => {
			expect(screen.getByTestId('single-file-name')).toHaveTextContent('no-file');
		});

		expect(screen.queryByText('documento.txt')).not.toBeInTheDocument();
		expect(handleFileChange).not.toHaveBeenCalled();
	});

	it('rechaza archivos que superan el tamaño máximo permitido', async () => {
		const user = userEvent.setup();
		const handleFileChange = vi.fn();
		const { container } = render(
			<SingleTestHarness accept=".p12" maxSizeMB={1} onFileChange={handleFileChange} withWatcher />,
		);

		const input = container.querySelector('input[type="file"]') as HTMLInputElement;
		// 2MB file
		const hugeFile = new File([new Uint8Array(2 * 1024 * 1024)], 'enorme.p12', {
			type: 'application/x-pkcs12',
		});

		await user.upload(input, hugeFile);

		await waitFor(() => {
			expect(screen.getByTestId('single-file-name')).toHaveTextContent('no-file');
		});

		expect(screen.queryByText('enorme.p12')).not.toBeInTheDocument();
	});

	it('permite quitar el archivo seleccionado mediante el botón de eliminar', async () => {
		const user = userEvent.setup();
		const handleFileChange = vi.fn();
		const { container } = render(<SingleTestHarness accept=".p12" onFileChange={handleFileChange} withWatcher />);

		const input = container.querySelector('input[type="file"]') as HTMLInputElement;
		const file = new File(['cert'], 'mi_firma.p12', { type: 'application/x-pkcs12' });

		await user.upload(input, file);

		await waitFor(() => {
			expect(screen.getByTestId('single-file-name')).toHaveTextContent('mi_firma.p12');
		});

		const deleteButton = screen.getByRole('button', { name: /quitar archivo/i });
		await user.click(deleteButton);

		await waitFor(() => {
			expect(screen.getByTestId('single-file-name')).toHaveTextContent('no-file');
		});

		expect(screen.queryByText('mi_firma.p12')).not.toBeInTheDocument();
		expect(screen.getByText(/Haz clic/i)).toBeInTheDocument();
		expect(handleFileChange).toHaveBeenLastCalledWith(null);
	});
});

describe('FormFileUploader — Modo Edición (Archivo Existente)', () => {
	it('muestra el nombre del archivo existente cuando se provee existingFileName', () => {
		render(
			<SingleTestHarness
				existingFileName="firma_antigua.p12"
				existingFileUrl="https://example.com/firma_antigua.p12"
			/>,
		);

		expect(screen.getByText('firma_antigua.p12')).toBeInTheDocument();
		expect(screen.queryByText(/Haga clic o arrastre el archivo aquí/i)).not.toBeInTheDocument();
	});

	it('ejecuta onExistingFileClick al hacer clic en el nombre del archivo existente', async () => {
		const user = userEvent.setup();
		const handleExistingFileClick = vi.fn();

		render(<SingleTestHarness existingFileName="firma_antigua.p12" onExistingFileClick={handleExistingFileClick} />);

		const fileLink = screen.getByRole('button', { name: 'firma_antigua.p12' });
		await user.click(fileLink);

		expect(handleExistingFileClick).toHaveBeenCalledTimes(1);
	});

	it('permite quitar el archivo existente para cargar uno nuevo', async () => {
		const user = userEvent.setup();
		render(<SingleTestHarness existingFileName="firma_antigua.p12" />);

		const deleteButton = screen.getByRole('button', { name: /quitar archivo/i });
		await user.click(deleteButton);

		expect(screen.queryByText('firma_antigua.p12')).not.toBeInTheDocument();
		expect(screen.getByText(/Haz clic/i)).toBeInTheDocument();
	});
});

describe('FormFileUploader — Modo Múltiples Archivos', () => {
	it('permite cargar múltiples archivos hasta el límite maxFiles', async () => {
		const user = userEvent.setup();
		const handleFileChange = vi.fn();
		const { container } = render(
			<MultipleTestHarness accept=".xml,.zip" maxFiles={3} onFileChange={handleFileChange} withWatcher />,
		);

		const input = container.querySelector('input[type="file"]') as HTMLInputElement;
		const file1 = new File(['xml1'], 'factura1.xml', { type: 'text/xml' });
		const file2 = new File(['xml2'], 'factura2.xml', { type: 'text/xml' });

		await user.upload(input, [file1, file2]);

		await waitFor(() => {
			expect(screen.getByTestId('multiple-files-count')).toHaveTextContent('2');
		});

		expect(screen.getByText('factura1.xml')).toBeInTheDocument();
		expect(screen.getByText('factura2.xml')).toBeInTheDocument();
	});

	it('permite eliminar un archivo específico de la lista en modo múltiple', async () => {
		const user = userEvent.setup();
		const { container } = render(<MultipleTestHarness accept=".xml" withWatcher />);

		const input = container.querySelector('input[type="file"]') as HTMLInputElement;
		const file1 = new File(['xml1'], 'doc1.xml', { type: 'text/xml' });
		const file2 = new File(['xml2'], 'doc2.xml', { type: 'text/xml' });

		await user.upload(input, [file1, file2]);

		await waitFor(() => {
			expect(screen.getByText('doc1.xml')).toBeInTheDocument();
			expect(screen.getByText('doc2.xml')).toBeInTheDocument();
		});

		const deleteDoc1Btn = screen.getByRole('button', { name: 'Eliminar doc1.xml' });
		await user.click(deleteDoc1Btn);

		await waitFor(() => {
			expect(screen.queryByText('doc1.xml')).not.toBeInTheDocument();
			expect(screen.getByText('doc2.xml')).toBeInTheDocument();
			expect(screen.getByTestId('multiple-files-count')).toHaveTextContent('1');
		});
	});
});

describe('FormFileUploader — Estados disabled, readOnly y Errores', () => {
	it('no muestra el botón de eliminar cuando disabled es true con archivo existente', () => {
		render(<SingleTestHarness existingFileName="firma.p12" disabled />);

		expect(screen.getByText('firma.p12')).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: /quitar archivo/i })).not.toBeInTheDocument();
	});

	it('no muestra el botón de eliminar cuando readOnly es true con archivo existente', () => {
		render(<SingleTestHarness existingFileName="firma.p12" readOnly />);

		expect(screen.getByText('firma.p12')).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: /quitar archivo/i })).not.toBeInTheDocument();
	});

	it('muestra mensaje de error personalizado cuando se provee errorCustom', () => {
		render(<SingleTestHarness errorCustom="El certificado ha expirado" />);

		expect(screen.getByText('El certificado ha expirado')).toBeInTheDocument();
	});

	it('soporta variantes de color personalizadas e icono central custom', () => {
		const CustomIcon = <span data-testid="custom-dropzone-icon">Custom Icon</span>;
		const CustomListIcon = <span data-testid="custom-list-icon">Custom List Icon</span>;

		render(
			<SingleTestHarness
				variantColor="blue"
				icon={CustomIcon}
				listIcon={CustomListIcon}
				existingFileName="documento.pdf"
			/>,
		);

		expect(screen.getByTestId('custom-list-icon')).toBeInTheDocument();
		expect(screen.getByText('documento.pdf')).toBeInTheDocument();
	});

	it('renderiza correctamente las diferentes variantes de color del tema', () => {
		const colors = ['green', 'red', 'primary', 'gray', 'amber'] as const;

		for (const color of colors) {
			const { unmount } = render(
				<SingleTestHarness variantColor={color} label={`Uploader ${color}`} />,
			);
			expect(screen.getByText(`Uploader ${color}`)).toBeInTheDocument();
			expect(screen.getByText(/Haz clic/i)).toBeInTheDocument();
			unmount();
		}
	});
});
