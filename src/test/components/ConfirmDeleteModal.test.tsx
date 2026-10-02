import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ConfirmDeleteModal } from '../../components/ConfirmDeleteModal';

vi.mock('@/hooks', async () => {
	const actual = await vi.importActual<Record<string, unknown>>('@/hooks');
	return {
		...actual,
		useControlActions: vi.fn(() => ({
			setCurrentPath: vi.fn(),
			programId: undefined,
			fnApiValidatePermissionAction: vi.fn().mockResolvedValue(true),
		})),
	};
});

describe('ConfirmDeleteModal component', () => {
	it('renders correctly when open and matches snapshot', () => {
		const { baseElement } = render(
			<ConfirmDeleteModal
				open={true}
				onConfirm={vi.fn()}
				onCancel={vi.fn()}
			/>
		);

		expect(screen.getByText('Confirmar Eliminación')).toBeInTheDocument();
		expect(
			screen.getByText('¿Está seguro que desea eliminar el siguiente registro?')
		).toBeInTheDocument();
		expect(baseElement).toMatchSnapshot();
	});

	it('does not render modal content when open is false', () => {
		render(
			<ConfirmDeleteModal
				open={false}
				onConfirm={vi.fn()}
				onCancel={vi.fn()}
			/>
		);

		expect(screen.queryByText('Confirmar Eliminación')).not.toBeInTheDocument();
	});

	it('renders custom title, entityName and custom message', () => {
		render(
			<ConfirmDeleteModal
				open={true}
				title="Eliminar usuario"
				entityName="usuario"
				message="¿Desea dar de baja este usuario?"
				onConfirm={vi.fn()}
				onCancel={vi.fn()}
			/>
		);

		expect(screen.getByText('Eliminar usuario')).toBeInTheDocument();
		expect(screen.getByText('¿Desea dar de baja este usuario?')).toBeInTheDocument();
	});

	it('uses entityName in default message when message is not provided', () => {
		render(
			<ConfirmDeleteModal
				open={true}
				entityName="producto"
				onConfirm={vi.fn()}
				onCancel={vi.fn()}
			/>
		);

		expect(
			screen.getByText('¿Está seguro que desea eliminar el siguiente producto?')
		).toBeInTheDocument();
	});

	it('renders optional children between the message and details', () => {
		render(
			<ConfirmDeleteModal
				open={true}
				onConfirm={vi.fn()}
				onCancel={vi.fn()}
				details={[{ label: 'Código', value: 'PROD-001' }]}
			>
				<div data-testid="custom-children-element">
					<span>Advertencia de dependencias</span>
				</div>
			</ConfirmDeleteModal>
		);

		const message = screen.getByText('¿Está seguro que desea eliminar el siguiente registro?');
		const childrenElem = screen.getByTestId('custom-children-element');
		const detailLabel = screen.getByText('Código:');

		expect(childrenElem).toBeInTheDocument();
		expect(screen.getByText('Advertencia de dependencias')).toBeInTheDocument();

		// Verify DOM order: message before children, children before details
		expect(message.compareDocumentPosition(childrenElem) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
		expect(childrenElem.compareDocumentPosition(detailLabel) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
	});

	it('renders details list when provided', () => {
		render(
			<ConfirmDeleteModal
				open={true}
				onConfirm={vi.fn()}
				onCancel={vi.fn()}
				details={[
					{ label: 'Nombre', value: 'Juan Pérez' },
					{ label: 'Rol', value: 'Administrador' },
				]}
			/>
		);

		expect(screen.getByText('Nombre:')).toBeInTheDocument();
		expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
		expect(screen.getByText('Rol:')).toBeInTheDocument();
		expect(screen.getByText('Administrador')).toBeInTheDocument();
	});

	it('does not render details container when details is empty', () => {
		const { container } = render(
			<ConfirmDeleteModal
				open={true}
				onConfirm={vi.fn()}
				onCancel={vi.fn()}
				details={[]}
			/>
		);

		expect(container.querySelector('.bg-gray-50')).not.toBeInTheDocument();
	});

	it('calls onConfirm when confirm button is clicked', () => {
		const handleConfirm = vi.fn();
		render(
			<ConfirmDeleteModal
				open={true}
				confirmLabel="Sí, eliminar"
				onConfirm={handleConfirm}
				onCancel={vi.fn()}
			/>
		);

		const confirmBtn = screen.getByRole('button', { name: 'Sí, eliminar' });
		fireEvent.click(confirmBtn);

		expect(handleConfirm).toHaveBeenCalledTimes(1);
	});

	it('calls onCancel when cancel button is clicked', () => {
		const handleCancel = vi.fn();
		render(
			<ConfirmDeleteModal
				open={true}
				cancelLabel="No, cancelar"
				onConfirm={vi.fn()}
				onCancel={handleCancel}
			/>
		);

		const cancelBtn = screen.getByRole('button', { name: 'No, cancelar' });
		fireEvent.click(cancelBtn);

		expect(handleCancel).toHaveBeenCalledTimes(1);
	});

	it('disables confirm button when isLoading is true', () => {
		render(
			<ConfirmDeleteModal
				open={true}
				isLoading={true}
				confirmLabel="Eliminar"
				onConfirm={vi.fn()}
				onCancel={vi.fn()}
			/>
		);

		const confirmBtn = screen.getByRole('button', { name: /eliminar/i });
		expect(confirmBtn).toBeDisabled();
	});
});
