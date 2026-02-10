import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../components/Button';
import { ResponsiveModalProvider } from '../../HOC/ResponsiveModalProvider';
import { useModalResponsive } from '../../hooks/useModalResponsive';
import { PdfMaintenance } from '../../components/PdfMaintenance';

const meta: Meta = {
    title: 'Components/PdfMaintenance',
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'Gestor de PDF para cargar, actualizar o eliminar un PDF. Este ejemplo usa el hook useModalResponsive para abrirlo dentro de un modal responsivo.',
            },
        },
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Demo = () => {
    const { openModal } = useModalResponsive();

    const handleOpen = () =>
        openModal({
            title: 'Gestión de PDF',
            height: 'auto',
            content: (
                <div className="p-4">
                    <PdfMaintenance
                        pdfUrl={null}
                        onUpload={(file) => console.log('upload', file)}
                        onUpdate={(file) => console.log('update', file)}
                        onDelete={() => console.log('delete')}
                        onSavePdf={(url) => console.log('save', url)}
                        onCancelSavePdf={() => console.log('cancel')}
                    />
                </div>
            ),
        });

    return (
        <div style={{ padding: 16 }}>
            <Button label="Abrir gestor de PDF" onClick={handleOpen} />
        </div>
    );
};

export const Default: Story = {
    render: () => (
        <ResponsiveModalProvider>
            <Demo />
        </ResponsiveModalProvider>
    ),
};
