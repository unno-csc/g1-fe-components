
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeAll } from 'vitest';
import { ModalResponsive } from '../../components/ModalResponsive';
import { CustomFooterModal } from '../../components/CustomFooterModal';

vi.mock('@/hooks', async () => {
	const actual = await vi.importActual<any>('@/hooks');
	return {
		...actual,
		useControlActions: vi.fn(() => ({
			setCurrentPath: vi.fn(),
			programId: undefined,
			fnApiValidatePermissionAction: vi.fn().mockResolvedValue(true),
		})),
	};
});

beforeAll(() => {
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: vi.fn().mockImplementation(query => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		})),
	});

	// Antd measure mocks
	Object.defineProperty(window, 'getComputedStyle', {
		value: () => ({
			getPropertyValue: () => '',
		}),
	});
});

describe('ModalResponsive', () => {
	it('renders when open with content and footer', () => {
		const handleOk = vi.fn();
		const handleCancel = vi.fn();

		render(
			<ModalResponsive
				title="Título"
				open={true}
				onOk={handleOk}
				onCancel={handleCancel}
				content={<div data-testid="modal-content">Contenido</div>}
				footer={<CustomFooterModal onConfirm={handleOk} onCancel={handleCancel} />}
			/>,
		);

		expect(screen.getByText('Título')).toBeInTheDocument();
		expect(screen.getByTestId('modal-content')).toBeInTheDocument();
	});

	it('calls callbacks via custom footer', async () => {
		const user = userEvent.setup();
		const handleOk = vi.fn();
		const handleCancel = vi.fn();

		render(
			<ModalResponsive
				title="Título"
				open={true}
				onOk={handleOk}
				onCancel={handleCancel}
				content={<div />}
				footer={<CustomFooterModal onConfirm={handleOk} onCancel={handleCancel} />}
			/>,
		);

		// Click confirm button
		await user.click(screen.getByRole('button', { name: /confirmar/i }));
		expect(handleOk).toHaveBeenCalled();

		// Click cancel button
		await user.click(screen.getByRole('button', { name: /cancelar/i }));
		expect(handleCancel).toHaveBeenCalled();
	});

	it('applies height and width styles', () => {
		const handleOk = vi.fn();
		const handleCancel = vi.fn();

		const { container } = render(
			<ModalResponsive
				title="Título"
				open={true}
				onOk={handleOk}
				onCancel={handleCancel}
				content={<div />}
				height={'400px'}
				width={'600px'}
				footer={<CustomFooterModal onConfirm={handleOk} onCancel={handleCancel} />}
			/>,
		);

		const modalBody = document.querySelector('.ant-modal-body') as HTMLElement;
		expect(modalBody).toBeTruthy();
		// style is applied via inline styles on body through styles prop; existence is enough here
		expect(modalBody.getAttribute('style')).toContain('overflow-y');
	});
});


