import { EActionType, EOrientation, ESize, ESortOrder } from '@/enums';
import { ColumnType } from 'antd/es/table';
import { ReactNode } from 'react';
import { MenuItemType, SubMenuType } from 'antd/es/menu/interface';
import { IActions } from '@/interfaces';
import { FormItemProps } from 'antd/es/form';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { InputProps } from 'antd';
import { ITreeNodeProps } from '@/components/TreeNode';
export type { Dayjs as TDayjs } from 'dayjs';

//TODO: Probably deprecated starting from here (need to start doing implementations to clean up this)

export type TInputOptions = {
	label: string;
	value: string | number;
};

export type TOrientation = EOrientation.horizontal | EOrientation.vertical; // check key of typeof

export type TModalSize = ESize.large | ESize.medium | ESize.small; // check key of typeof

export type TModalFooterActions = {
	label: string;
	onClick: () => void;
};

export type TModalFooter = {
	linkAction?: { label: string; url: string };
	primaryAction?: TModalFooterActions;
	secondaryAction?: TModalFooterActions;
	isDisabled?: boolean;
	isLoading?: boolean;
};

export type TTableData = { [key: string]: unknown; TABLE__ALERT?: boolean }[];

export type TSortOrder = ESortOrder.asc | ESortOrder.desc; // check key of typeof

export type TInputRules = {
	required?: string;
	validate?: (value: any) => boolean | string;
};

export type TDate = string;

export type TTranslationSchema = {
	schema: string;
	create: string;
	read: string;
	update: string;
	delete: string;
};

export type TButtonTypes = 'button' | 'submit' | 'reset';

export type TError = {
	message: string;
	code: string;
};

export type PermissionAction = keyof IActions; // 'create' | 'read' | 'update' | 'delete' | 'all_actions'

export type TTab = {
	icon: string;
	label: string;
	content: ReactNode;
	hidden?: boolean;
};

export interface TTableColumn {
	key: string;
	label: string;
	render?: (item: any) => React.ReactNode;
	sortable?: boolean;
}

// New types from here
export type TDrawerSize = 'default' | 'large';
export type TTabItem = {
	key: string;
	label: ReactNode;
	children?: ReactNode;
	forceRender?: boolean;
	disabled?: boolean;
	closable?: boolean;
	icon?: ReactNode;
};

export type TNotificationType = 'success' | 'info' | 'warning' | 'error';

export type TMenuMode = 'inline' | 'vertical' | 'horizontal';

// New types from here TABLE
export type TPrimitiveKey<T> = Extract<keyof T, string | number>;

export type TStrictColumnType<T> = Omit<ColumnType<T>, 'dataIndex'> & {
	dataIndex?: TPrimitiveKey<T> | readonly TPrimitiveKey<T>[];
};

export type TStrictTableColumnsType<T> = TStrictColumnType<T>[];

export interface ITableColumnAction<T = any> {
	key: string;
	title: string;
	icon?: ReactNode | ((record: T) => ReactNode);
	action: (record: T) => void;
    disabled?: boolean | ((record: T) => boolean);
	danger?: boolean;
	actionType?: EActionType;
	validateWithApiAction?: boolean;
	confirmDelete?: {
		title: string;
		content: string | ((record: T) => string);
		confirmLabel: string;
		cancelLabel: string;
	};
}
export type TMenuItemData = {
	path: string | null;
	pathPadre: string | null;
	icon: React.ReactNode | null;
	url?: string | null;
	actions?: {
		allActions: boolean;
		read: boolean;
		create: boolean;
		update: boolean;
		delete: boolean;
	};
	type: 'program' | 'module' | 'submodule' | 'group';
	parentGroup?: string;
	parentSubmodule: string;
	parentModule: string;
};
// Tipo extendido para los items del menú con datos adicionales
export type TExtendedMenuItem = (SubMenuType | MenuItemType) & {
	data?: TMenuItemData;
};

export type Option = { label: React.ReactNode; value: string | number };

export type BaseFieldProps = {
	/** Etiqueta visible (solo UI) */
	label?: React.ReactNode;
	/** Marca visual de requerido (solo UI) */
	requiredMark?: boolean;
	/** Props del Form.Item (layout) */
	formItemProps?: Omit<FormItemProps, 'label' | 'required' | 'validateStatus' | 'help'>;
	/** Ocultar el item */
	hidden?: boolean;
	/** Mensaje de ayuda adicional (UI) */
	extra?: React.ReactNode;
};

export type RHFModeProps<TFieldValues extends FieldValues> = {
	mode: 'rhf';
	/** Nombre del campo (type-safe con FieldPath<T>) */
	name: FieldPath<TFieldValues>;
	/** Control de RHF */
	control: Control<TFieldValues>;
};

export type ControlledModeProps<TValue> = {
	mode: 'controlled';
	value?: TValue;
	onChange?: (v: TValue) => void;
	/** Mensaje de error en modo controlado (opcional) */
	errorMessage?: string;
};

export type RHFInputProps<TFieldValues extends FieldValues> = Omit<InputProps, 'value' | 'onChange'> &
	BaseFieldProps &
	(RHFModeProps<TFieldValues> | ControlledModeProps<string>);

export type TNotificationProps ={
	type: TNotificationType;
	message: string;
	description?: string;
}

export type MakeFunctionParamsOptional<F> = F extends (...args: infer P) => infer R ? (...args: Partial<P>) => R : never;

export type TTextTransform = 'capitalize' | 'full-size-kana' | 'full-width' | 'lowercase' | 'none' | 'uppercase';

export type TTreeNodeItemProps = ITreeNodeProps;

export type TTreeNodeTypeComponent = 'SELECT' | 'CRUD';