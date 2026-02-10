import { ModalResponsive, HeaderButton } from '@/components/ModalResponsive';
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';

export interface ResponsiveModalContextType {
    openModal: (params: {
        content: ReactNode;
        title?: string;
        footer?: ReactNode;
        onOk?: () => void;
        onCancel?: () => void;
        height?: string;
        width?: string;
        closable?: boolean;
        afterClose?: () => void;
        extraHeaderButtons?: HeaderButton[];
    }) => void;
    closeModal: () => void;
    setBeforeClose: Dispatch<SetStateAction<(() => void) | undefined>>;
}

export const ResponsiveModalContext = createContext<ResponsiveModalContextType | undefined>(undefined);

export const ResponsiveModalProvider = ({ children }: { children: ReactNode }) => {
    type ModalEntry = {
        id: number;
        title: string;
        content: ReactNode;
        footer: ReactNode;
        onOk?: () => void;
        onCancel?: () => void;
        height?: string;
        width?: string;
        afterClose?: () => void;
        isOpen: boolean;
        closable?: boolean;
        extraHeaderButtons?: HeaderButton[];
    };

    const [modals, setModals] = useState<ModalEntry[]>([]);
    const [nextId, setNextId] = useState<number>(1);

    const openModal: ResponsiveModalContextType['openModal'] = ({
        title,
        content,
        footer,
        onOk,
        onCancel,
        height,
        width,
        closable,
        afterClose,
        extraHeaderButtons,
    }) => {
        const newEntry: ModalEntry = {
            id: nextId,
            title: title ?? '',
            content,
            footer: footer ?? null,
            onOk,
            onCancel,
            height: height ?? '90vh',
            width: width ?? '',
            closable,
            afterClose,
            extraHeaderButtons,
            isOpen: true,
        };
        setModals(prev => [...prev, newEntry]);
        setNextId(id => id + 1);
    };

    const closeModal = () => {
        setModals(prev => {
            if (prev.length === 0) return prev;
            const lastIndex = prev.length - 1;
            const lastEntry = prev[lastIndex];
            if (!lastEntry) return prev;
            lastEntry.onCancel?.();
            const copy = [...prev];
            copy[lastIndex] = { ...lastEntry, isOpen: false };
            return copy;
        });
    };

    const handleOkById = (id: number) => {
        setModals(prev => {
            const idx = prev.findIndex(m => m.id === id);
            if (idx === -1) return prev;
            const entry = prev[idx];
            entry?.onOk?.();
            const copy = [...prev];
            const current = copy[idx];
            if (!current) return prev;
            copy[idx] = { ...current, isOpen: false };
            return copy;
        });
    };

    const handleCancelById = (id: number) => {
        setModals(prev => {
            const idx = prev.findIndex(m => m.id === id);
            if (idx === -1) return prev;
            const entry = prev[idx];
            entry?.onCancel?.();
            const copy = [...prev];
            const current = copy[idx];
            if (!current) return prev;
            copy[idx] = { ...current, isOpen: false };
            return copy;
        });
    };

    const removeById = (id: number) => {
        setModals(prev => prev.filter(m => m.id !== id));
    };

    const setBeforeClose: ResponsiveModalContextType['setBeforeClose'] = updater => {
        setModals(prev => {
            if (prev.length === 0) return prev;
            const lastIndex = prev.length - 1;
            return prev.map((m, idx) => {
                if (idx !== lastIndex) return m;
                const previousValue = m.afterClose;
                const nextValue = typeof updater === 'function'
                    ? (updater as (prevState: (() => void) | undefined) => (() => void) | undefined)(previousValue)
                    : updater;
                return { ...m, afterClose: nextValue };
            });
        });
    };

    return (
        <ResponsiveModalContext.Provider value={{ openModal, closeModal, setBeforeClose }}>
            {children}
            {modals.map(({ id, title, content, footer, height, width, afterClose, isOpen, closable, extraHeaderButtons }) => (
                <ModalResponsive
                    key={id}
                    title={title}
                    open={isOpen}
                    onOk={() => handleOkById(id)}
                    onCancel={() => handleCancelById(id)}
                    footer={footer}
                    content={content}
                    height={height}
                    width={width}
                    afterClose={() => {
                        afterClose?.();
                        removeById(id);
                    }}
                    closable={closable}
                    extraHeaderButtons={extraHeaderButtons}
                />
            ))}
        </ResponsiveModalContext.Provider>
    );
};
