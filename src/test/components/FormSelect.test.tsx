import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { useForm } from 'react-hook-form';
import { FormSelect } from '../../components/FormSelect';

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

    global.ResizeObserver = vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
    }));
});

function Wrapper({ name, options }: { name: string; options: { label: string; value: string }[] }) {
    const { control } = useForm();
    return <FormSelect name={name} label="Color" control={control} options={options} allowClear />;
}

describe('FormSelect component', () => {
    const options = [
        { label: 'Rojo', value: 'red' },
        { label: 'Azul', value: 'blue' },
    ];

    it('renders label and selects option', async () => {
        const user = userEvent.setup();
        const { container } = render(<Wrapper name="color" options={options} />);

        expect(screen.getByText('Color')).toBeInTheDocument();

        const selector = container.querySelector('.ant-select-selector') as HTMLElement;
        await user.click(selector);

        const option = await screen.findByText('Azul');
        await user.click(option);

        expect(container).toMatchSnapshot();
    });
});


