import { render, screen } from '@testing-library/react';
import { Tag } from '../../components/Tag';

describe('Tag component', () => {
	it('renders with children and additional props', () => {
		const { container } = render(<Tag color="blue">Test Tag</Tag>);
		const tagElement = screen.getByText('Test Tag');
		expect(tagElement).toBeInTheDocument();
		expect(tagElement).toHaveClass('ant-tag-blue');
		expect(container).toMatchSnapshot();
	});

	it('passes extra props to AntTag', () => {
		const { container } = render(
			<Tag id="custom-id" data-testid="tag-testid">
				Content
			</Tag>,
		);
		const tag = screen.getByTestId('tag-testid');
		expect(tag).toBeInTheDocument();
		expect(tag.id).toBe('custom-id');
		expect(container).toMatchSnapshot();
	});
});
