import { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { InputSearch } from '../../components/InputSearch';

describe('InputSearch component', () => {
	it('renders correctly with default props and matches snapshot', () => {
		const { container } = render(<InputSearch placeholder="Buscar algo..." />);
		const input = screen.getByPlaceholderText('Buscar algo...');
		expect(input).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it('renders with label and connects htmlFor and id', () => {
		render(<InputSearch label="Buscar usuario" id="custom-search-id" />);
		const label = screen.getByText('Buscar usuario');
		const input = screen.getByRole('textbox');

		expect(label).toHaveAttribute('for', 'custom-search-id');
		expect(input).toHaveAttribute('id', 'custom-search-id');
	});

	it('supports legacy title prop for backward compatibility', () => {
		render(<InputSearch title="Título de búsqueda" />);
		expect(screen.getByText('Título de búsqueda')).toBeInTheDocument();
	});

	it('supports optional indicator in label', () => {
		render(<InputSearch label="Filtro opcional" optional />);
		expect(screen.getByText('(Opcional)')).toBeInTheDocument();
	});

	it('displays initial value from defaultValue in uncontrolled mode', () => {
		render(<InputSearch defaultValue="Valor por defecto" />);
		const input = screen.getByRole('textbox') as HTMLInputElement;
		expect(input.value).toBe('Valor por defecto');
	});

	it('displays value in controlled mode and updates when prop changes', () => {
		const ControlledWrapper = () => {
			const [text, setText] = useState('Inicial');
			return (
				<div>
					<InputSearch value={text} onChange={e => setText(e.target.value)} />
					<button onClick={() => setText('Actualizado')}>Cambiar</button>
				</div>
			);
		};

		render(<ControlledWrapper />);
		const input = screen.getByRole('textbox') as HTMLInputElement;
		expect(input.value).toBe('Inicial');

		fireEvent.click(screen.getByText('Cambiar'));
		expect(input.value).toBe('Actualizado');
	});

	it('calls onChange and onSearch when user types', async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		const handleSearch = vi.fn();

		render(
			<InputSearch
				placeholder="Buscar..."
				onChange={handleChange}
				onSearch={handleSearch}
			/>
		);

		const input = screen.getByPlaceholderText('Buscar...');
		await user.type(input, 'test');

		expect(handleChange).toHaveBeenCalled();
		expect(handleSearch).toHaveBeenCalledWith('test');
		expect(input).toHaveValue('test');
	});

	it('calls onSearch on Enter key press', () => {
		const handleSearch = vi.fn();
		const handlePressEnter = vi.fn();

		render(
			<InputSearch
				defaultValue="consulta"
				onSearch={handleSearch}
				onPressEnter={handlePressEnter}
				searchTrigger="both"
			/>
		);

		const input = screen.getByRole('textbox');
		fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

		expect(handlePressEnter).toHaveBeenCalled();
		expect(handleSearch).toHaveBeenCalledWith('consulta');
	});

	it('respects searchTrigger="enter" by not calling onSearch on change', async () => {
		const user = userEvent.setup();
		const handleSearch = vi.fn();

		render(
			<InputSearch
				placeholder="Buscar..."
				onSearch={handleSearch}
				searchTrigger="enter"
			/>
		);

		const input = screen.getByPlaceholderText('Buscar...');
		await user.type(input, 'a');

		expect(handleSearch).not.toHaveBeenCalled();

		fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
		expect(handleSearch).toHaveBeenCalledWith('a');
	});

	it('respects searchTrigger="change" by calling onSearch on change but not on enter', async () => {
		const user = userEvent.setup();
		const handleSearch = vi.fn();

		render(
			<InputSearch
				placeholder="Buscar..."
				onSearch={handleSearch}
				searchTrigger="change"
			/>
		);

		const input = screen.getByPlaceholderText('Buscar...');
		await user.type(input, 'x');

		expect(handleSearch).toHaveBeenCalledWith('x');
		handleSearch.mockClear();

		fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
		expect(handleSearch).not.toHaveBeenCalled();
	});

	it('renders clear icon and clears value when allowClear is enabled', async () => {
		const user = userEvent.setup();
		const handleSearch = vi.fn();
		const handleChange = vi.fn();

		const { container } = render(
			<InputSearch
				defaultValue="texto para borrar"
				allowClear
				onSearch={handleSearch}
				onChange={handleChange}
			/>
		);

		const input = screen.getByRole('textbox') as HTMLInputElement;
		expect(input.value).toBe('texto para borrar');

		// In AntD, allowClear renders an icon with role="button" or class ant-input-clear-icon
		const clearIcon = container.querySelector('.ant-input-clear-icon');
		expect(clearIcon).toBeInTheDocument();

		if (clearIcon) {
			await user.click(clearIcon);
		}

		expect(input.value).toBe('');
		expect(handleSearch).toHaveBeenCalledWith('');
		expect(handleChange).toHaveBeenCalled();
	});

	it('preserves input focus and cursor when loading toggles from false to true', () => {
		const { rerender } = render(<InputSearch loading={false} placeholder="Buscar..." />);
		const input = screen.getByPlaceholderText('Buscar...');
		act(() => {
			input.focus();
		});
		expect(document.activeElement).toBe(input);

		act(() => {
			rerender(<InputSearch loading={true} placeholder="Buscar..." />);
		});
		expect(document.activeElement).toBe(input);
	});

	it('renders clear icon inside suffix without phantom spinner when allowClear is enabled', () => {
		const { container } = render(<InputSearch allowClear defaultValue="prueba" />);
		const clearIcon = container.querySelector('.ant-input-clear-icon');
		expect(clearIcon).toBeInTheDocument();

		// Ensure no phantom spinner is present when loading is false
		const spinner = container.querySelector('.ant-spin');
		expect(spinner).toBeNull();
	});

	it('shows loading spinner in suffix when loading is true', () => {
		const { container } = render(<InputSearch loading defaultValue="buscando..." />);
		const spinner = container.querySelector('.ant-spin');
		expect(spinner).toBeInTheDocument();

		const suffix = container.querySelector('.ant-input-suffix');
		expect(suffix).toBeInTheDocument();
	});

	it('renders custom suffix and retains it', () => {
		render(<InputSearch suffix={<span data-testid="custom-icon">🔍</span>} />);
		expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
	});

	it('displays error message and sets error aria attributes', () => {
		const { container } = render(
			<InputSearch
				id="search-input"
				label="Campo con error"
				error="Valor de búsqueda inválido"
			/>
		);

		const errorLabel = screen.getByText('Valor de búsqueda inválido');
		expect(errorLabel).toBeInTheDocument();
		expect(errorLabel).toHaveAttribute('id', 'search-input-error');

		const input = screen.getByRole('textbox');
		expect(input).toHaveAttribute('aria-invalid', 'true');
		expect(input).toHaveAttribute('aria-describedby', 'search-input-error');

		const wrapper = container.querySelector('.ant-input-affix-wrapper');
		expect(wrapper).toHaveClass('ant-input-status-error');
	});

	it('applies textTransform="uppercase"', async () => {
		const user = userEvent.setup();
		const handleSearch = vi.fn();

		render(
			<InputSearch
				textTransform="uppercase"
				placeholder="Escribe aquí"
				onSearch={handleSearch}
			/>
		);

		const input = screen.getByPlaceholderText('Escribe aquí');
		await user.type(input, 'auto');

		expect(input).toHaveValue('AUTO');
		expect(handleSearch).toHaveBeenCalledWith('AUTO');
	});

	it('applies textTransform="lowercase"', async () => {
		const user = userEvent.setup();
		const handleSearch = vi.fn();

		render(
			<InputSearch
				textTransform="lowercase"
				placeholder="Escribe aquí"
				onSearch={handleSearch}
			/>
		);

		const input = screen.getByPlaceholderText('Escribe aquí');
		await user.type(input, 'MOTOR');

		expect(input).toHaveValue('motor');
		expect(handleSearch).toHaveBeenCalledWith('motor');
	});

	it('disables input when disabled prop is true', () => {
		render(<InputSearch disabled placeholder="Deshabilitado" />);
		const input = screen.getByPlaceholderText('Deshabilitado');
		expect(input).toBeDisabled();
	});

	it('updates event.target.value when textTransform is active and onChange is provided', async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();

		render(<InputSearch textTransform="uppercase" onChange={handleChange} placeholder="Transform" />);
		const input = screen.getByPlaceholderText('Transform');
		await user.type(input, 'abc');

		expect(handleChange).toHaveBeenCalled();
		expect(input).toHaveValue('ABC');
	});

	it('updates internalValue when defaultValue changes in uncontrolled mode', () => {
		const { rerender } = render(<InputSearch defaultValue="Primer valor" />);
		const input = screen.getByRole('textbox') as HTMLInputElement;
		expect(input.value).toBe('Primer valor');

		rerender(<InputSearch defaultValue="Segundo valor" />);
		expect(input.value).toBe('Segundo valor');
	});
});
