import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ConfirmDeleteModal, type IConfirmDeleteModalProps } from '../../components/ConfirmDeleteModal';
import { Button } from '../../components/Button';
import { Alert } from '../../components/Alert/Alert';

const meta: Meta<IConfirmDeleteModalProps> = {
	title: 'components/ConfirmDeleteModal',
	component: ConfirmDeleteModal,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					'Modal de confirmación para acciones de eliminación. Permite personalizar título, mensaje, detalles del registro, estado de carga y elementos hijos opcionales (`children`) situados entre el mensaje principal y los detalles.',
			},
		},
	},
	argTypes: {
		open: { control: 'boolean', description: 'Controla la visibilidad del modal' },
		title: { control: 'text', description: 'Título del modal' },
		entityName: { control: 'text', description: 'Nombre de la entidad a eliminar' },
		message: { control: 'text', description: 'Mensaje personalizado de confirmación' },
		confirmLabel: { control: 'text', description: 'Texto del botón de confirmación' },
		cancelLabel: { control: 'text', description: 'Texto del botón de cancelación' },
		isLoading: { control: 'boolean', description: 'Estado de carga durante la eliminación' },
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	name: 'Por defecto',
	render: () => {
		const [isOpen, setIsOpen] = useState(false);
		return (
			<div>
				<Button type="primary" label="Abrir modal de eliminación" onClick={() => setIsOpen(true)} />
				<ConfirmDeleteModal
					open={isOpen}
					entityName="vehículo"
					onConfirm={() => setIsOpen(false)}
					onCancel={() => setIsOpen(false)}
				/>
			</div>
		);
	},
};

export const WithDetails: Story = {
	name: 'Con detalles del registro',
	render: () => {
		const [isOpen, setIsOpen] = useState(false);
		return (
			<div>
				<Button type="primary" label="Eliminar repuesto" onClick={() => setIsOpen(true)} />
				<ConfirmDeleteModal
					open={isOpen}
					title="Eliminar repuesto"
					entityName="repuesto"
					details={[
						{ label: 'Código', value: 'REP-00124' },
						{ label: 'Descripción', value: 'Filtro de Aceite Sintético' },
						{ label: 'Precio', value: '$24.50' },
					]}
					onConfirm={() => setIsOpen(false)}
					onCancel={() => setIsOpen(false)}
				/>
			</div>
		);
	},
};

export const WithChildren: Story = {
	name: 'Con children personalizado',
	render: () => {
		const [isOpen, setIsOpen] = useState(false);
		return (
			<div>
				<Button type="primary" label="Eliminar con advertencia" onClick={() => setIsOpen(true)} />
				<ConfirmDeleteModal
					open={isOpen}
					title="Eliminar planificación de visitas"
					message="¿Está seguro que desea anular esta planificación mensual?"
					onConfirm={() => setIsOpen(false)}
					onCancel={() => setIsOpen(false)}
				>
					<div className="my-3">
						<Alert
							type="warning"
							message="Esta acción no se puede deshacer y desvinculará todas las visitas programadas."
							showIcon
						/>
					</div>
				</ConfirmDeleteModal>
			</div>
		);
	},
};

export const WithChildrenAndDetails: Story = {
	name: 'Con children y detalles',
	render: () => {
		const [isOpen, setIsOpen] = useState(false);
		return (
			<div>
				<Button type="primary" label="Eliminar cliente" onClick={() => setIsOpen(true)} />
				<ConfirmDeleteModal
					open={isOpen}
					title="Eliminar cliente"
					entityName="cliente"
					details={[
						{ label: 'Razón Social', value: 'Distribuidora Automotriz S.A.' },
						{ label: 'RUC', value: '1790012345001' },
					]}
					onConfirm={() => setIsOpen(false)}
					onCancel={() => setIsOpen(false)}
				>
					<div className="my-3 p-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded">
						<strong>Aviso:</strong> El cliente tiene 3 pedidos pendientes asociados.
					</div>
				</ConfirmDeleteModal>
			</div>
		);
	},
};

export const LoadingState: Story = {
	name: 'Estado de carga',
	render: () => {
		return (
			<ConfirmDeleteModal
				open={true}
				title="Eliminando registro..."
				isLoading={true}
				onConfirm={() => {}}
				onCancel={() => {}}
			/>
		);
	},
};
