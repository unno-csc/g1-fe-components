import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
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
