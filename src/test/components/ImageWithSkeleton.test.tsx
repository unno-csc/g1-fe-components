import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ImageWithSkeleton } from '../../components/ImageWithSkeleton';

vi.mock('antd', () => ({
	Image: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
	Skeleton: {
		Image: ({ style }: any) => <div data-testid="skeleton-image" style={style} />,
	},
}));

describe('ImageWithSkeleton component', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders Skeleton when src is empty', () => {
		const { container } = render(<ImageWithSkeleton src="" alt="Test image" />);

		expect(screen.getByTestId('skeleton-image')).toBeInTheDocument();
		expect(screen.queryByRole('img')).not.toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it('renders Image when src is provided', () => {
		const { container } = render(<ImageWithSkeleton src="test.jpg" alt="Test image" />);

		const image = screen.getByRole('img');
		expect(image).toBeInTheDocument();
		expect(image).toHaveAttribute('src', 'test.jpg');
		expect(image).toHaveAttribute('alt', 'Test image');
		expect(container).toMatchSnapshot();
	});

	it('applies custom dimensions', () => {
		render(<ImageWithSkeleton src="test.jpg" alt="Test image" width="300px" height="200px" />);

		const image = screen.getByRole('img');
		expect(image).toHaveStyle({ width: '300px', height: '200px' });
	});
});
