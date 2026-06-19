import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TabsItemContent } from '../../components/TabsItemContent';
import { TABS_ITEM_CONTENT_WIDTH } from '../../constants';
import '@testing-library/jest-dom';

describe('TabsItemContent component', () => {
    it('renders with title and children', () => {
        const { container } = render(
            <TabsItemContent title="Mi Título">
                <div>Contenido</div>
            </TabsItemContent>,
        );

        expect(screen.getByText('Mi Título')).toBeInTheDocument();
        expect(screen.getByText('Contenido')).toBeInTheDocument();
        expect(container).toMatchSnapshot();
    });

    it('applies default and custom width', () => {
        const { rerender } = render(
            <TabsItemContent>
                <div>Default</div>
            </TabsItemContent>,
        );

        const defaultContainer = screen.getByText('Default').parentElement?.parentElement as HTMLElement;
        expect(defaultContainer).toHaveStyle({ '--tab-width': TABS_ITEM_CONTENT_WIDTH });

        rerender(
            <TabsItemContent width="320px">
                <div>Custom</div>
            </TabsItemContent>,
        );
        const customContainer = screen.getByText('Custom').parentElement?.parentElement as HTMLElement;
        expect(customContainer).toHaveStyle({ '--tab-width': '320px' });
    });
});


