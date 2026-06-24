import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ImageGallerySection } from '../../components/ImageGallerySection';
import { IGenericLocalImage } from '../../components/UploadImageCompressor';

vi.mock('antd', async (importOriginal) => {
	const actual = await importOriginal<any>();
	return {
		...actual,
		Image: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
		Skeleton: {
			Image: ({ style }: any) => <div data-testid="skeleton-image" style={style} />,
		},
	};
});

vi.mock('@/hooks', async (importOriginal) => {
	const actual = await importOriginal<any>();
	return {
		...actual,
		useControlActions: () => ({ programId: 1, fnApiValidatePermissionAction: vi.fn() }),
		useUserActionPermissions: () => ({ userActionPermissions: [] }),
		useOnlineStatus: () => true,
	};
});

describe('ImageGallerySection component', () => {
	const mockOnAddImage = vi.fn();
	const mockOnRemoveImage = vi.fn();

	const mockImages: IGenericLocalImage[] = [
		{ id: '1', previewUrl: 'test1.jpg', label: 'Image 1', file: new File([''], 'test1.jpg', { type: 'image/jpeg' }) },
		{ id: '2', previewUrl: 'test2.jpg', label: 'Image 2', file: new File([''], 'test2.jpg', { type: 'image/jpeg' }) },
	];

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders empty state when no images are provided', () => {
		const { container } = render(
			<ImageGallerySection images={[]} onAddImage={mockOnAddImage} onRemoveImage={mockOnRemoveImage} />
		);

		expect(screen.getByText('No hay imágenes cargadas todavía.')).toBeInTheDocument();
		expect(screen.getByText('0/10 imágenes')).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it('renders custom empty message', () => {
		render(
			<ImageGallerySection
				images={[]}
				onAddImage={mockOnAddImage}
				onRemoveImage={mockOnRemoveImage}
				emptyMessage="No photos"
			/>
		);

		expect(screen.getByText('No photos')).toBeInTheDocument();
	});

	it('renders images correctly', () => {
		const { container } = render(
			<ImageGallerySection images={mockImages} onAddImage={mockOnAddImage} onRemoveImage={mockOnRemoveImage} maxImages={5} />
		);

		expect(screen.getByText('2/5 imágenes')).toBeInTheDocument();
		expect(screen.getByText('Image 1')).toBeInTheDocument();
		expect(screen.getByText('Image 2')).toBeInTheDocument();
		
		const images = screen.getAllByAltText(/Imagen/i);
		expect(images).toHaveLength(2);
		expect(images[0]).toHaveAttribute('src', 'test1.jpg');
		
		expect(container).toMatchSnapshot();
	});

	it('renders skeletons when isLoadingImages is true', () => {
		const { container } = render(
			<ImageGallerySection
				images={[]}
				onAddImage={mockOnAddImage}
				onRemoveImage={mockOnRemoveImage}
				isLoadingImages={true}
				maxImages={3}
			/>
		);

		const skeletons = screen.getAllByTestId('skeleton-image');
		expect(skeletons).toHaveLength(3);
		expect(container).toMatchSnapshot();
	});

	it('calls onAddImage when clicking the button', () => {
		render(
			<ImageGallerySection images={[]} onAddImage={mockOnAddImage} onRemoveImage={mockOnRemoveImage} />
		);

		const addButton = screen.getByRole('button', { name: /Subir imagen/i });
		fireEvent.click(addButton);
		
		expect(mockOnAddImage).toHaveBeenCalledTimes(1);
	});

	it('calls onRemoveImage when clicking delete on an image', () => {
		render(
			<ImageGallerySection images={mockImages} onAddImage={mockOnAddImage} onRemoveImage={mockOnRemoveImage} />
		);

		const deleteButtons = screen.getAllByRole('button', { name: /Quitar imagen/i });
		expect(deleteButtons).toHaveLength(2);
		
		fireEvent.click(deleteButtons[0]);
		expect(mockOnRemoveImage).toHaveBeenCalledWith(0);
	});
});
