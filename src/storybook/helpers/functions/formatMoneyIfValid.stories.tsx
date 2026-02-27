import React from 'react';
import { formatMoneyIfValid } from '../../../helpers/functions';

const meta = {
	title: 'Helpers/Functions/formatMoneyIfValid',
	tags: ['autodocs'],
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				component: `
Funcion para formatear montos validos con separador de miles y 2 decimales.
Incluye redondeo estandar y control de ruido flotante.
        `,
			},
		},
	},
	argTypes: {
		initialValue: {
			control: 'text',
			description: 'Valor inicial para probar',
			defaultValue: '48.60000000000002',
		},
	},
};

export default meta;

export const Playground = ({ initialValue = '48.60000000000002' }: { initialValue?: string }) => {
	const [value, setValue] = React.useState(initialValue);

	React.useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	const formattedValue = formatMoneyIfValid(value);

	return (
		<div style={{ maxWidth: 520, display: 'grid', gap: 12 }}>
			<h3>Probar formato de decimales</h3>
			<label htmlFor="money-value">Valor decimal</label>
			<input
				id="money-value"
				type="text"
				value={value}
				onChange={event => setValue(event.target.value)}
				placeholder="Ej: 48.60000000000002"
				style={{ padding: 8, border: '1px solid #d9d9d9', borderRadius: 6 }}
			/>
			<div>Valor ingresado: <strong>{value || '(vacio)'}</strong></div>
			<div>Resultado formatMoneyIfValid: <strong>{formattedValue || '(vacio)'}</strong></div>
		</div>
	);
};
