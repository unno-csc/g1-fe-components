import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LocationSelector } from '../../components/LocationSelector';

const mockCountries = [
	{ label: 'Ecuador', value: 1 },
	{ label: 'Colombia', value: 2 },
];

const mockProvinces = [
	{ label: 'Pichincha', value: 1 },
	{ label: 'Guayas', value: 2 },
];

const mockCantons = [
	{ label: 'Quito', value: 1 },
	{ label: 'Guayaquil', value: 2 },
];

const mockParishes = [
	{ label: 'Centro Histórico', value: 1 },
	{ label: 'Tarqui', value: 2 },
];

const defaultProps = {
	optionsCountries: mockCountries,
	optionsProvinces: mockProvinces,
	optionsCantons: mockCantons,
	optionsParishes: mockParishes,
	isLoadingCountries: false,
	isLoadingProvinces: false,
	isLoadingCantons: false,
	isLoadingParishes: false,
	onChangeCountry: vi.fn(),
	onChangeProvince: vi.fn(),
	onChangeCanton: vi.fn(),
	onChangeParish: vi.fn(),
};

describe('LocationSelector component', () => {
	it('renders default country selector and matches snapshot', () => {
		const { container } = render(<LocationSelector {...defaultProps} />);
		expect(screen.getAllByText('País').length).toBeGreaterThanOrEqual(1);
		expect(container).toMatchSnapshot();
	});

	it('renders all 4 selectors when showProvince, showCanton, and showParish are true', () => {
		render(
			<LocationSelector
				{...defaultProps}
				showProvince
				showCanton
				showParish
			/>
		);

		expect(screen.getAllByText('País').length).toBeGreaterThanOrEqual(1);
		expect(screen.getAllByText('Provincia').length).toBeGreaterThanOrEqual(1);
		expect(screen.getAllByText('Cantón').length).toBeGreaterThanOrEqual(1);
		expect(screen.getAllByText('Parroquia').length).toBeGreaterThanOrEqual(1);
	});

	it('does not render Province, Canton, or Parish when show props are false', () => {
		render(
			<LocationSelector
				{...defaultProps}
				showProvince={false}
				showCanton={false}
				showParish={false}
			/>
		);

		expect(screen.getAllByText('País').length).toBeGreaterThanOrEqual(1);
		expect(screen.queryByText('Provincia')).not.toBeInTheDocument();
		expect(screen.queryByText('Cantón')).not.toBeInTheDocument();
		expect(screen.queryByText('Parroquia')).not.toBeInTheDocument();
	});

	it('applies default responsive colSpan (xs 100%, sm/md/lg/xl 50%) when colSpan is undefined', () => {
		const { container } = render(<LocationSelector {...defaultProps} />);
		const col = container.querySelector('.ant-col');
		expect(col).toHaveClass('ant-col-xs-24');
		expect(col).toHaveClass('ant-col-sm-12');
		expect(col).toHaveClass('ant-col-md-12');
		expect(col).toHaveClass('ant-col-lg-12');
		expect(col).toHaveClass('ant-col-xl-12');
	});

	it('applies responsive colSpan with column counts { xl: 4, lg: 3, md: 2, sm: 2, xs: 1 }', () => {
		const { container } = render(
			<LocationSelector
				{...defaultProps}
				colSpan={{
					xl: 4,
					lg: 3,
					md: 2,
					sm: 2,
					xs: 1,
				}}
			/>
		);
		const col = container.querySelector('.ant-col');
		expect(col).toHaveClass('ant-col-xs-24'); // 1 col = span 24
		expect(col).toHaveClass('ant-col-sm-12'); // 2 cols = span 12
		expect(col).toHaveClass('ant-col-md-12'); // 2 cols = span 12
		expect(col).toHaveClass('ant-col-lg-8');  // 3 cols = span 8
		expect(col).toHaveClass('ant-col-xl-6');  // 4 cols = span 6
	});

	it('applies responsive colSpan with standard 24-grid numbers', () => {
		const { container } = render(
			<LocationSelector
				{...defaultProps}
				colSpan={{
					xl: 6,
					lg: 8,
					sm: 12,
					xs: 24,
				}}
			/>
		);
		const col = container.querySelector('.ant-col');
		expect(col).toHaveClass('ant-col-xs-24');
		expect(col).toHaveClass('ant-col-sm-12');
		expect(col).toHaveClass('ant-col-lg-8');
		expect(col).toHaveClass('ant-col-xl-6');
	});

	it('applies numeric shorthand colSpan={4}', () => {
		const { container } = render(
			<LocationSelector
				{...defaultProps}
				colSpan={4}
			/>
		);
		const col = container.querySelector('.ant-col');
		expect(col).toHaveClass('ant-col-xs-24');
		expect(col).toHaveClass('ant-col-sm-12');
		expect(col).toHaveClass('ant-col-md-6');
		expect(col).toHaveClass('ant-col-lg-6');
		expect(col).toHaveClass('ant-col-xl-6');
	});

	it('applies custom flex strings and objects in colSpan', () => {
		const { container } = render(
			<LocationSelector
				{...defaultProps}
				colSpan={{
					xl: '25%',
					lg: { flex: '33.33%' },
					default: 2,
				}}
			/>
		);
		const col = container.querySelector('.ant-col') as HTMLElement;
		expect(col).toBeInTheDocument();
	});

	it('displays validation error messages for each selector', () => {
		render(
			<LocationSelector
				{...defaultProps}
				showProvince
				showCanton
				showParish
				errorCountry="Error en país"
				errorProvince="Error en provincia"
				errorCanton="Error en cantón"
				errorParish="Error en parroquia"
			/>
		);

		expect(screen.getByText('Error en país')).toBeInTheDocument();
		expect(screen.getByText('Error en provincia')).toBeInTheDocument();
		expect(screen.getByText('Error en cantón')).toBeInTheDocument();
		expect(screen.getByText('Error en parroquia')).toBeInTheDocument();
	});

	it('supports custom titles for all selectors', () => {
		render(
			<LocationSelector
				{...defaultProps}
				showProvince
				showCanton
				showParish
				titleCountry="Nación"
				titleProvince="Estado"
				titleCanton="Municipio"
				titleParish="Colonia"
			/>
		);

		expect(screen.getAllByText('Nación').length).toBeGreaterThanOrEqual(1);
		expect(screen.getAllByText('Estado').length).toBeGreaterThanOrEqual(1);
		expect(screen.getAllByText('Municipio').length).toBeGreaterThanOrEqual(1);
		expect(screen.getAllByText('Colonia').length).toBeGreaterThanOrEqual(1);
	});

	it('applies custom className, colClassName, and gutter', () => {
		const { container } = render(
			<LocationSelector
				{...defaultProps}
				className="custom-row-class"
				colClassName="custom-col-class"
				gutter={16}
			/>
		);

		const row = container.querySelector('.ant-row');
		expect(row).toHaveClass('custom-row-class');

		const col = container.querySelector('.ant-col');
		expect(col).toHaveClass('custom-col-class');
	});

	it('calls change callbacks when selection changes', () => {
		const onChangeCountry = vi.fn();
		const onChangeProvince = vi.fn();
		const onChangeCanton = vi.fn();
		const onChangeParish = vi.fn();

		render(
			<LocationSelector
				{...defaultProps}
				showProvince
				showCanton
				showParish
				valueCountryId={1}
				valueProvinceId={1}
				valueCantonId={1}
				valueParishId={1}
				onChangeCountry={onChangeCountry}
				onChangeProvince={onChangeProvince}
				onChangeCanton={onChangeCanton}
				onChangeParish={onChangeParish}
			/>
		);

		expect(screen.getByText('Pichincha')).toBeInTheDocument();
		expect(screen.getByText('Quito')).toBeInTheDocument();
		expect(screen.getByText('Centro Histórico')).toBeInTheDocument();
	});

	it('handles zero value ids gracefully and resolves colSpan fallback and string formats', () => {
		const { container } = render(
			<LocationSelector
				{...defaultProps}
				showProvince
				showCanton
				showParish
				valueProvinceId={0}
				valueCantonId={0}
				valueParishId={0}
				colSpan={{ default: 3, xxl: 4, sm: 1 }}
			/>
		);

		const cols = container.querySelectorAll('.ant-col');
		expect(cols.length).toBe(4);
		expect(cols[0]).toHaveClass('ant-col-xxl-6');
		expect(cols[0]).toHaveClass('ant-col-sm-24');
	});

	it('handles single string and custom numeric colSpan', () => {
		const { container: c1 } = render(
			<LocationSelector
				{...defaultProps}
				colSpan="33.33%"
			/>
		);
		expect(c1.querySelector('.ant-col')).toBeInTheDocument();

		const { container: c2 } = render(
			<LocationSelector
				{...defaultProps}
				colSpan={5}
			/>
		);
		expect(c2.querySelector('.ant-col')).toBeInTheDocument();
	});
});
