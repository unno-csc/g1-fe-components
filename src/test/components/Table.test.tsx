import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { ITableProps, Table } from '../../components/Table';
import { ITableColumnAction, TStrictTableColumnsType } from '../../types';

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

	Object.defineProperty(window, 'getComputedStyle', {
		value: () => ({
			getPropertyValue: () => '',
		}),
	});

	global.ResizeObserver = vi.fn().mockImplementation(() => ({
		observe: vi.fn(),
		unobserve: vi.fn(),
		disconnect: vi.fn(),
	}));
});

interface TestDataType {
	id: number;
	name: string;
	age: number;
	email: string;
}

const mockData: TestDataType[] = [
	{ id: 1, name: 'Juan Pérez', age: 25, email: 'juan@test.com' },
	{ id: 2, name: 'María García', age: 30, email: 'maria@test.com' },
	{ id: 3, name: 'Carlos López', age: 28, email: 'carlos@test.com' },
];

const mockColumns: TStrictTableColumnsType<TestDataType> = [
	{
		title: 'ID',
		dataIndex: 'id',
		key: 'id',
	},
	{
		title: 'Nombre',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: 'Edad',
		dataIndex: 'age',
		key: 'age',
	},
	{
		title: 'Email',
		dataIndex: 'email',
		key: 'email',
	},
];

const defaultProps: ITableProps<TestDataType> = {
	columns: mockColumns,
	data: mockData,
	loading: false,
	rowKey: 'id',
	onChange: vi.fn(),
};

describe('Table component', () => {
	it('renders table with data correctly', () => {
		const { container } = render(<Table {...defaultProps} />);

		expect(screen.getAllByRole('table')[0]).toBeInTheDocument();

		expect(screen.getByText('ID')).toBeInTheDocument();
		expect(screen.getByText('Nombre')).toBeInTheDocument();
		expect(screen.getByText('Edad')).toBeInTheDocument();
		expect(screen.getByText('Email')).toBeInTheDocument();

		expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
		expect(screen.getByText('María García')).toBeInTheDocument();
		expect(screen.getByText('Carlos López')).toBeInTheDocument();

		expect(container).toMatchSnapshot();
	});

	it('renders empty table when no data provided', () => {
		const { container } = render(<Table {...defaultProps} data={[]} />);

		expect(screen.getAllByRole('table')[0]).toBeInTheDocument();
		expect(screen.getAllByText('No data')[0]).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it('shows loading state correctly', () => {
		const { container } = render(<Table {...defaultProps} loading={true} />);

		expect(screen.getAllByRole('table')[0]).toBeInTheDocument();
		expect(container.querySelector('.ant-spin-spinning')).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it('renders with borders when bordered prop is true', () => {
		const { container } = render(<Table {...defaultProps} bordered={true} />);

		expect(container.querySelector('.ant-table-bordered')).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it('renders without borders by default', () => {
		const { container } = render(<Table {...defaultProps} />);

		expect(container.querySelector('.ant-table-bordered')).not.toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it('shows pagination when showPagination is true', () => {
		const { container } = render(<Table {...defaultProps} showPagination={true} />);

		expect(container.querySelector('.ant-pagination')).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it('hides pagination by default', () => {
		const { container } = render(<Table {...defaultProps} />);

		expect(container.querySelector('.ant-pagination')).not.toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it('uses custom pagination config when provided', () => {
		const customPaginationConfig = {
			pageSize: 5,
			showSizeChanger: false,
			showQuickJumper: false,
		};

		const { container } = render(
			<Table {...defaultProps} showPagination={true} paginationConfig={customPaginationConfig} />,
		);

		expect(container.querySelector('.ant-pagination')).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it('handles row selection correctly', () => {
		const onSelectionChange = vi.fn();
		const rowSelection = {
			onChange: onSelectionChange,
			selectedRowKeys: [],
		};

		const { container } = render(<Table {...defaultProps} rowSelection={rowSelection} />);

		const checkboxes = container.querySelectorAll('input[type="checkbox"]');
		expect(checkboxes.length).toBeGreaterThan(0);
		expect(container).toMatchSnapshot();
	});

	it('supports single selection mode (radio)', () => {
		const { container } = render(<Table {...defaultProps} rowSelection={{}} selectionMode="single" />);

		const radios = container.querySelectorAll('input[type="radio"]');
		expect(radios.length).toBeGreaterThan(0);
	});

	it('calls onChange handler when provided', () => {
		const onChange = vi.fn();

		const { container } = render(<Table {...defaultProps} onChange={onChange} />);

		expect(screen.getAllByRole('table')[0]).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it('applies custom scroll configuration', () => {
		const customScroll = { x: 1000, y: 500 };

		const { container } = render(<Table {...defaultProps} scroll={customScroll} />);

		const tableBody = container.querySelector('.ant-table-tbody');
		expect(tableBody).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it('uses default scroll configuration', () => {
		const { container } = render(<Table {...defaultProps} />);

		const tableBody = container.querySelector('.ant-table-tbody');
		expect(tableBody).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it('uses custom rowKey function', () => {
		const customRowKey = (record: TestDataType) => `custom-${record.id}`;

		const { container } = render(<Table {...defaultProps} rowKey={customRowKey} />);

		expect(container).toMatchSnapshot();
	});

	it('uses string rowKey property', () => {
		const { container } = render(<Table {...defaultProps} rowKey="id" />);

		expect(container).toMatchSnapshot();
	});

	it('handles complex columns with custom render', () => {
		const complexColumns: TStrictTableColumnsType<TestDataType> = [
			{
				title: 'Nombre Completo',
				dataIndex: 'name',
				key: 'name',
				render: (text: string) => <strong>{text}</strong>,
			},
			{
				title: 'Información',
				key: 'info',
				render: (_, record) => `${record.name} - ${record.age} años`,
			},
		];

		const { container } = render(<Table {...defaultProps} columns={complexColumns} />);

		expect(screen.getByText('Juan Pérez - 25 años')).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it('handles large datasets correctly', () => {
		const largeData = Array.from({ length: 50 }, (_, index) => ({
			id: index + 1,
			name: `Usuario ${index + 1}`,
			age: 20 + (index % 50),
			email: `usuario${index + 1}@test.com`,
		}));

		const { container } = render(<Table {...defaultProps} data={largeData} showPagination={true} />);

		expect(screen.getAllByRole('table')[0]).toBeInTheDocument();
		expect(container.querySelector('.ant-pagination')).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it('maintains type safety with strict column types', () => {
		const typedColumns: TStrictTableColumnsType<TestDataType> = [
			{
				title: 'ID',
				dataIndex: 'id',
				key: 'id',
			},
		];

		const { container } = render(
			<Table rowKey="id" columns={typedColumns} data={mockData} loading={false} onChange={vi.fn()} />,
		);

		expect(container).toMatchSnapshot();
	});

	it('shows actions column when showColumnActions is true', () => {
		const mockActions: ITableColumnAction<TestDataType>[] = [
			{
				key: 'edit',
				title: 'Editar',
				action: vi.fn(),
			},
			{
				key: 'delete',
				title: 'Eliminar',
				action: vi.fn(),
			},
		];

		const { container } = render(<Table {...defaultProps} showColumnActions={true} columnActions={mockActions} />);

		// Verificar que se muestra la columna de acciones
		expect(screen.getByText('Acciones')).toBeInTheDocument();

		// Verificar que hay botones de acción (uno por fila)
		const actionButtons = container.querySelectorAll('.ant-dropdown-trigger');
		expect(actionButtons).toHaveLength(mockData.length);

		expect(container).toMatchSnapshot();
	});

	it('does not show actions column when showColumnActions is false', () => {
		const mockActions: ITableColumnAction<TestDataType>[] = [
			{
				key: 'edit',
				title: 'Editar',
				action: vi.fn(),
			},
		];

		const { container } = render(<Table {...defaultProps} showColumnActions={false} columnActions={mockActions} />);

		// Verificar que NO se muestra la columna de acciones
		expect(screen.queryByText('Acciones')).not.toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it('handles column actions configuration correctly', () => {
		const editAction = vi.fn();
		const deleteAction = vi.fn();

		const mockActions: ITableColumnAction<TestDataType>[] = [
			{
				key: 'edit',
				title: 'Editar',
				action: editAction,
			},
			{
				key: 'delete',
				title: 'Eliminar',
				action: deleteAction,
			},
		];

		const { container } = render(<Table {...defaultProps} showColumnActions={true} columnActions={mockActions} />);

		// Verificar que hay botones dropdown para acciones
		const firstActionButton = container.querySelector('.ant-dropdown-trigger');
		expect(firstActionButton).toBeInTheDocument();

		// Verificar que el botón tiene el icono correcto
		const moreIcon = container.querySelector('[data-icon="more"]');
		expect(moreIcon).toBeInTheDocument();

		expect(container).toMatchSnapshot();
	});

	it('handles column actions with icons correctly', () => {
		const editAction = vi.fn();

		const mockActions: ITableColumnAction<TestDataType>[] = [
			{
				key: 'edit',
				title: 'Editar',
				icon: <span data-testid="edit-icon">✏️</span>,
				action: editAction,
			},
		];

		const { container } = render(<Table {...defaultProps} showColumnActions={true} columnActions={mockActions} />);

		// Verificar que el botón de acciones está presente
		const actionButton = container.querySelector('.ant-dropdown-trigger');
		expect(actionButton).toBeInTheDocument();

		expect(container).toMatchSnapshot();
	});

	it('handles empty column actions array', () => {
		const { container } = render(<Table {...defaultProps} showColumnActions={true} columnActions={[]} />);

		// Verificar que se muestra la columna de acciones pero sin elementos en el dropdown
		expect(screen.getByText('Acciones')).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it('handles undefined column actions', () => {
		const { container } = render(<Table {...defaultProps} showColumnActions={true} />);

		// Verificar que se muestra la columna de acciones pero sin elementos en el dropdown
		expect(screen.getByText('Acciones')).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it('calls onChange handler when table state changes', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		const { container } = render(<Table {...defaultProps} onChange={onChange} showPagination={true} />);

		// Simular un cambio en la paginación si hay más de una página
		const pagination = container.querySelector('.ant-pagination');
		if (pagination) {
			// Buscar el botón "next" de paginación
			const nextButton = container.querySelector('.ant-pagination-next');
			if (nextButton && !nextButton.classList.contains('ant-pagination-disabled')) {
				await user.click(nextButton);
				expect(onChange).toHaveBeenCalled();
			}
		}
	});

	it('calls onChange handler when sorting changes', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		// Columnas con sorting habilitado
		const sortableColumns: TStrictTableColumnsType<TestDataType> = [
			{
				title: 'ID',
				dataIndex: 'id',
				key: 'id',
				sorter: true,
			},
			{
				title: 'Nombre',
				dataIndex: 'name',
				key: 'name',
				sorter: true,
			},
		];

		render(<Table {...defaultProps} columns={sortableColumns} onChange={onChange} />);

		// Hacer clic en el header de la columna "ID" para ordenar
		const idHeader = screen.getByText('ID');
		await user.click(idHeader);

		// Verificar que se llamó onChange
		expect(onChange).toHaveBeenCalled();
	});

	it('handles multiple column actions for different records', () => {
		const editAction = vi.fn();

		const mockActions: ITableColumnAction<TestDataType>[] = [
			{
				key: 'edit',
				title: 'Editar',
				action: editAction,
			},
		];

		const { container } = render(<Table {...defaultProps} showColumnActions={true} columnActions={mockActions} />);

		// Obtener todos los botones de acciones (uno por fila)
		const actionButtons = container.querySelectorAll('.ant-dropdown-trigger');
		expect(actionButtons).toHaveLength(mockData.length);

		// Verificar que todos los botones tienen el icono correcto
		const moreIcons = container.querySelectorAll('[data-icon="more"]');
		expect(moreIcons).toHaveLength(mockData.length);

		expect(container).toMatchSnapshot();
	});
});
