import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Radio } from '../../components/Radio/Radio';

describe('Radio component', () => {
	it('renders single radio item correctly', async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();
		const { container } = render(
			<Radio onChange={handleChange} value="terms">
				Acepto términos y condiciones
			</Radio>
		);

		const radio = screen.getByRole('radio', { name: /acepto términos y condiciones/i });
		expect(radio).toBeInTheDocument();
		expect(radio).not.toBeChecked();

		await user.click(radio);
		expect(handleChange).toHaveBeenCalledTimes(1);
		expect(container).toMatchSnapshot();
	});

	it('renders radio group with compound Radio items and allows selection', async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();

		const { container } = render(
			<Radio.Group onChange={handleChange} defaultValue={false}>
				<Radio value={false}>Venta Normal</Radio>
				<Radio value={true}>Consignación</Radio>
			</Radio.Group>
		);

		const normalOption = screen.getByRole('radio', { name: /venta normal/i });
		const consignmentOption = screen.getByRole('radio', { name: /consignación/i });

		expect(normalOption).toBeChecked();
		expect(consignmentOption).not.toBeChecked();

		await user.click(consignmentOption);
		expect(handleChange).toHaveBeenCalledTimes(1);
		expect(consignmentOption).toBeChecked();
		expect(container).toMatchSnapshot();
	});

	it('renders radio options array and allows selection', async () => {
		const user = userEvent.setup();
		const { container } = render(
			<Radio.Group
				options={[
					{ label: 'Option 1', value: 1 },
					{ label: 'Option 2', value: 2 },
				]}
				defaultValue={1}
			/>
		);

		const option2 = screen.getByLabelText('Option 2');
		expect(option2).toBeInTheDocument();
		await user.click(option2);
		expect(option2).toBeChecked();
		expect(container).toMatchSnapshot();
	});

	it('supports legacy usage with label, options and value props directly on Radio', async () => {
		const user = userEvent.setup();
		const handleChange = vi.fn();

		const { container } = render(
			<Radio
				label="Modo de visualización"
				options={[
					{ label: 'Detalle', value: 'detail' },
					{ label: 'Lista', value: 'list' },
				]}
				onChange={handleChange}
				value="detail"
			/>
		);

		expect(screen.getByText('Modo de visualización')).toBeInTheDocument();
		const listOption = screen.getByLabelText('Lista');
		expect(listOption).toBeInTheDocument();
		await user.click(listOption);
		expect(handleChange).toHaveBeenCalledTimes(1);
		expect(container).toMatchSnapshot();
	});

	it('renders Radio.Button items correctly', () => {
		const handleChange = vi.fn();

		const { container } = render(
			<Radio.Group onChange={handleChange} defaultValue="s">
				<Radio.Button value="s">Pequeño</Radio.Button>
				<Radio.Button value="m">Mediano</Radio.Button>
				<Radio.Button value="l">Grande</Radio.Button>
			</Radio.Group>
		);

		const mediumButton = screen.getByRole('radio', { name: /mediano/i });
		expect(mediumButton).not.toBeChecked();

		fireEvent.click(screen.getByText('Mediano'));
		expect(handleChange).toHaveBeenCalledTimes(1);
		expect(mediumButton).toBeChecked();
		expect(container).toMatchSnapshot();
	});

	it('handles disabled state on individual radio and radio group', () => {
		const handleChange = vi.fn();

		render(
			<Radio.Group onChange={handleChange} disabled defaultValue="a">
				<Radio value="a">Opción A</Radio>
				<Radio value="b">Opción B</Radio>
			</Radio.Group>
		);

		const optionB = screen.getByRole('radio', { name: /opción b/i });
		expect(optionB).toBeDisabled();

		fireEvent.click(optionB);
		expect(handleChange).not.toHaveBeenCalled();
	});

	it('renders with warning variant correctly', () => {
		const { container } = render(
			<Radio.Group variant="warning" defaultValue="warn">
				<Radio value="warn" variant="warning">
					Advertencia
				</Radio>
			</Radio.Group>
		);

		const group = container.querySelector('.itsa-radio--warning');
		expect(group).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});
});
