import { useMemo } from 'react';

export interface IButtonIconProps {
    icon: React.ReactNode;
    ariaLabel: string;
    title: string;
    type: 'danger' | 'primary' | 'secondary' | 'success' | 'warning';
    onClick?: () => void;
}

export const ButtonIcon = ({ onClick, icon, ariaLabel, title, type }: IButtonIconProps) => {
    const typeClass = useMemo(() => {
        const base =
            'inline-flex h-6 w-6 items-center justify-center rounded-md border bg-white text-gray-600 shadow-xs transition ' +
            'hover:cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1';

        const variants: Record<IButtonIconProps['type'], string> = {
            primary: 'border-blue-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700',
            secondary: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800',
            success: 'border-green-300 hover:border-green-400 hover:bg-green-50 hover:text-green-700',
            warning: 'border-orange-300 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700',
            danger: 'border-red-300 hover:border-red-400 hover:bg-red-500 hover:text-red-700 bg-primary-700 !text-white',
        };

        return `${base} ${variants[type]}`;
    }, [type]);





    return (
        <button type="button" aria-label={ariaLabel} title={title} className={typeClass} onClick={onClick}>
            <span aria-hidden="true" className="text-base leading-none">
                {icon}
            </span>
        </button>
    );
};