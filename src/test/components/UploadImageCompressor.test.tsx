import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UploadImageCompressor } from '../../components/UploadImageCompressor';

const { mockOpenNotificationWithIcon } = vi.hoisted(() => ({
	mockOpenNotificationWithIcon: vi.fn(),
}));

vi.mock('../../hooks/useNotification/useNotification', () => ({
	useNotification: () => ({
		openNotificationWithIcon: mockOpenNotificationWithIcon,
	}),
}));

vi.mock('@/hooks/useControlActions/useControlActions', () => ({
	useControlActions: () => ({ programId: 1, fnApiValidatePermissionAction: vi.fn() }),
}));

vi.mock('@/hooks', async (importOriginal) => {
	const actual = await importOriginal<any>();
	return {
		...actual,
		useControlActions: () => ({ programId: 1, fnApiValidatePermissionAction: vi.fn() }),
	};
});

vi.mock('../../hooks', async (importOriginal) => {
	const actual = await importOriginal<any>();
	return {
		...actual,
		useNotification: () => ({
			openNotificationWithIcon: mockOpenNotificationWithIcon,
		}),
	};
});

vi.mock('@/store', () => ({
	useUserActionPermissions: () => ({ userActionPermissions: [] }),
	useAppLayoutStore: () => ({}),
}));

vi.mock('@/hooks/useOnlineStatus/useOnlineStatus', () => ({
	useOnlineStatus: () => true,
}));

vi.mock('../../utils/imageUtils', () => ({
	compressImage: vi.fn().mockImplementation((file) => Promise.resolve(file)),
}));

// Mock ant design components to simplify testing
vi.mock('antd', async (importOriginal) => {
	const actual = await importOriginal<any>();
	const React = require('react');
	return {
		...actual,
		Image: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
		Upload: {
			...actual.Upload,
			Dragger: ({ children, onChange, maxCount, accept, disabled }: any) => {
				return (
					<div
						data-testid="upload-dragger"
						data-disabled={disabled}
						onClick={() => {
							if (!disabled) {
								const mockFile = new File(['dummy content'], 'test.png', { type: 'image/png' });
								Object.defineProperty(mockFile, 'size', { value: 1024 * 1024 }); // 1MB

								const uploadFile = {
									uid: '1',
									name: 'test.png',
									status: 'done',
									originFileObj: mockFile,
									size: mockFile.size,
								};

								onChange({ fileList: [uploadFile] });
							}
						}}
					>
						{children}
					</div>
				);
			},
		},
	};
});

describe('UploadImageCompressor component', () => {
	const mockOnSaveSuccess = vi.fn();
	const mockOnCancel = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		global.URL.createObjectURL = vi.fn(() => 'mocked-url');
	});

	it('renders correctly with available slots', () => {
		render(
			<UploadImageCompressor
				onSaveSuccess={mockOnSaveSuccess}
				onCancel={mockOnCancel}
				currentImageCount={0}
				maxImages={5}
				maxSizeMB={2}
			/>
		);

		expect(screen.getByText(/Máximo 5 imágenes/i)).toBeInTheDocument();
		expect(screen.getByText(/Disponibles: 5/i)).toBeInTheDocument();
		expect(screen.getByText(/Arrastra tus imágenes aquí/i)).toBeInTheDocument();
	});

	it('disables dragger when no slots available', () => {
		render(
			<UploadImageCompressor
				onSaveSuccess={mockOnSaveSuccess}
				onCancel={mockOnCancel}
				currentImageCount={5}
				maxImages={5}
				maxSizeMB={2}
			/>
		);

		expect(screen.getByText(/Disponibles: 0/i)).toBeInTheDocument();
		expect(screen.getByText(/Límite de imágenes alcanzado/i)).toBeInTheDocument();
		const dragger = screen.getByTestId('upload-dragger');
		expect(dragger).toHaveAttribute('data-disabled', 'true');
	});

	it('calls onCancel when cancel button is clicked', () => {
		render(
			<UploadImageCompressor
				onSaveSuccess={mockOnSaveSuccess}
				onCancel={mockOnCancel}
				currentImageCount={0}
			/>
		);

		const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
		fireEvent.click(cancelButton);

		expect(mockOnCancel).toHaveBeenCalledTimes(1);
	});

	it('disables save button when trying to save without selecting images', async () => {
		render(
			<UploadImageCompressor
				onSaveSuccess={mockOnSaveSuccess}
				onCancel={mockOnCancel}
				currentImageCount={0}
			/>
		);

		const saveButton = screen.getByRole('button', { name: /Procesar imágenes/i });
		expect(saveButton).toBeDisabled();
		expect(mockOnSaveSuccess).not.toHaveBeenCalled();
	});

	it('processes images when clicking dragger and saving', async () => {
		render(
			<UploadImageCompressor
				onSaveSuccess={mockOnSaveSuccess}
				onCancel={mockOnCancel}
				currentImageCount={0}
			/>
		);

		// Trigger file selection via mocked Dragger click
		const dragger = screen.getByTestId('upload-dragger');
		fireEvent.click(dragger);

		// Verify image is added to list
		expect(screen.getByText('test.png')).toBeInTheDocument();

		// Save
		const saveButton = screen.getByRole('button', { name: /Procesar imágenes/i });
		fireEvent.click(saveButton);

		await waitFor(() => {
			expect(mockOnSaveSuccess).toHaveBeenCalledTimes(1);
		});
	});
});
