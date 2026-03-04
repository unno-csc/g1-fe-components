export interface IGetPermissionResponse {
	code: number;
	message: string;
	result: Result;
}

export interface Result {
	agencies: IAgency[];
}

export interface IAgency {
	id: number;
	name: string;
	modules: IModule[];
}

export interface IModule {
	id: number;
	name: string;
	icon: string;
	entorno: string;
	submodules: ISubmodule[];
}

export interface ISubmodule {
	id: number;
	name: string;
	pathPadre: string | null;
	path: string | null;
	icon: string | null;
	url?: string | null;
	groups?: ISubmodule[];
	programs?: ISubmodule[];
	actions?: IActions;
}

export interface IActions {
	allActions: boolean;
	read: boolean;
	create: boolean;
	update: boolean;
	delete: boolean;
}

export interface ISelectOptionDropdownButton {
	items: {
		key: string;
		label: string;
		onClick?: (id: string) => void;
	}[];
}

export interface IValidateRouteResponse {
	code: number;
	message: string;
	result: boolean;
}

export interface IUserRole {
	id: number;
	code: string | null;
	name: string;
	moduleId: number;
}

export interface IUserInformation {
	identification: string;
	identificationType: string;
	businessLineId: number;
	name: string;
	picture: string;
	email: string;
	roles: IUserRole[];
}
//--------------------------------------------------->
// TODO: clean up this file after implementations starts
import { EAddressType, EEmailType, EPhoneConnectionType, EPhoneType } from '@/enums';
import { TDate, TInputOptions, TInputRules, TTextTransform } from '@/types';
import { SelectProps } from 'antd';
import { FilterValue, SorterResult, TablePaginationConfig } from 'antd/es/table/interface';
import { Dayjs } from 'dayjs';
import { ReactNode } from 'react';

export interface IBaseInputProps {
	name: string;
	label: string;
	placeholder?: string;
	rules?: TInputRules;
	error?: string;
	isDisabled?: boolean;
	defaultValue?: string | boolean | number | TInputOptions | TInputOptions[] | null | undefined;
	maxLen?: number;
}

export interface IBaseInputDate extends IBaseInputProps {
	minDate?: Dayjs;
	maxDate?: Dayjs;
	isDisableFuture?: boolean;
	isDisablePast?: boolean;
	shouldOpen?: boolean;
	onClose?: () => void;
	onOpen?: () => void;
}

// TODO: double check with BE what is going to be the Iid returned by default.
export interface IId {
	id: string;
	modified_by: string;
	created_by: string;
	modified_on: TDate;
	created_on: TDate;
}

export interface IManualAddressObject {
	principalStreet: string;
	latitude: number;
	longitude: number;
	postalCode: string;
	province?: number;
	canton?: number;
	parish?: number;
}

export interface ILocationFormData {
	province: string | TInputOptions | null;
	canton: string | TInputOptions | null;
	parish: string | TInputOptions | null;
}

export interface IMultipleEmailItem {
	emailType: EEmailType | string;
	email: string;
	isPrincipal: boolean;
}

export interface IMultiplePhoneItem {
	phoneConnectionType: EPhoneConnectionType | string;
	phoneType: EPhoneType | string;
	phone: string;
	phoneAreaCode: string;
	isPrincipal: boolean;
}

export interface IMultipleAddressItem {
	addressType: EAddressType | string;
	address: {
		principalStreet: string;
		latitude: number;
		longitude: number;
		streetNumber: string;
		provinceId: number;
		cantonId: number;
		parishId: number;
		isManualAddress: boolean;
	};
	isPrincipal: boolean;
	fullAddress: string;
	addressReference: string;
}

export interface IActionPanelOption {
	title: string | ReactNode;
	confirm?: {
		title: string;
		message: string | ReactNode;
	};
	route?: string;
	action?: () => void;
	hidden?: boolean;
	disabled?: boolean;
	target?: string;
}

export interface IPermissionBasic {
	id: number;
	name: string;
}
export interface IPermissionActions {
	update: number;
	delete: number;
	create: number;
	read: number;
	allActions: number;
}

export interface IPermissionProgram extends IPermissionBasic {
	icon: string;
	actions: IPermissionActions;
	path: string;
	programs?: IPermissionProgram[];
}

export interface IPermissionSubmodule extends IPermissionBasic {
	icon: string;
	path: string;
	programs: IPermissionProgram[];
	groups?: IPermissionProgram[];
}
export interface IPermissionModule extends IPermissionBasic {
	submodules: IPermissionSubmodule[];
}

export interface IPermissionAgency extends IPermissionBasic {
	modules: IPermissionModule[];
}
export interface IPermission extends IPermissionBasic {
	agencies: IPermissionAgency[];
}

export interface IMenuItem {
	title: string;
	icon: string;
	id?: number;
	name?: string;
	path?: string;
	actions?: IPermissionActions;
	groups?: IMenuItem[];
	subList?: IMenuItem[];
}

export interface IUserInfo {
	identification: string;
	identificationType: string;
	name: string;
	picture: string;
	email: string;
	roles: {
		name: string;
	}[];
}

export interface IControllerProps {
	isForm?: boolean;
	isEditable?: boolean;
	isDetail?: boolean;
}

export interface IModalResponsiveProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	onOk: () => void;
	setOnOk: (onOk: () => void) => void;
	onCancel: () => void;
	setOnCancel: (onCancel: () => void) => void;
	title: string;
	setTitle: (title: string) => void;
	footer: ReactNode;
	setFooter: (footer: ReactNode) => void;
	content: ReactNode;
	setContent: (content: ReactNode) => void;
}

export interface ITabsMaintenanceItem {
	key: string;
	label: string;
	children: ReactNode;
	icon?: ReactNode;
}

export interface ITableHookState<T extends object> {
	pagination: TablePaginationConfig;
	filters?: Record<string, FilterValue | null>;
	sorter?: SorterResult<T> | SorterResult<T>[];
}

export interface IIcon {
	icon: ReactNode;
	iconName: string;
}

export interface ILocationSelectorProps {
	optionsCountries: SelectProps['options'];
	optionsProvinces: SelectProps['options'];
	optionsCantons: SelectProps['options'];
	optionsParishes: SelectProps['options'];
	isLoadingCountries: boolean;
	isLoadingProvinces: boolean;
	isLoadingCantons: boolean;
	isLoadingParishes: boolean;
	onChangeCountry: (value: number) => void;
	onChangeProvince: (value: number) => void;
	onChangeCanton: (value: number) => void;
	onChangeParish: (value: number) => void;
	valueCountryId?: number;
	valueProvinceId?: number;
	valueCantonId?: number;
	valueParishId?: number;
	onChangeOtherCountryDescription: (value: string) => void;
	otherCountryDescription: string;
	showParish?: boolean;
	showProvince?: boolean;
	showCanton?: boolean;
	aloneEcuador?: boolean;
	allowClear?: boolean;
	titleCountry?: string;
	titleProvince?: string;
	titleCanton?: string;
	titleParish?: string;
	errorCountry?: string;
	errorProvince?: string;
	errorCanton?: string;
	errorParish?: string;
}

export interface IUserRole {
	id: number;
	code: string | null;
	name: string;
	moduleId: number;
}
export interface IUserInformation {
	identification: string;
	identificationType: string;
	businessLineId: number;
	name: string;
	picture: string;
	email: string;
	roles: IUserRole[];
}
export interface IProgramActions {
	actions: IActions;
	program: ISubmodule;
}

export interface IMapLocation {
	lat: number;
	lng: number;
}

export interface IMapMarker {
	location: IMapLocation;
	label: string;
}
export interface IItemTreeNode {
	id: number;
	name: string;
	active: boolean;
	children: IItemTreeNode[];
	level?: number;
	parentId?: number;
	fatherAllName?: string;
	fatherAllId?: number;
}

export type RawValueType = string | number;

export interface FlattenOptionData<OptionType> {
	label?: React.ReactNode;
	data: OptionType;
	key: React.Key;
	value?: RawValueType;
	groupOption?: boolean;
	group?: boolean;
}

export interface DebounceSelectProps<ValueType = any>
	extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
	fetchOptions: (search: string) => Promise<ValueType[]>;
	debounceTimeout?: number;
}

export interface ISorterTable {
	orderBy?: string;
	column?: {
		title: string;
		dataIndex: string;
	};
	order?: string;
	field?: string;
}

export interface IMapPoint {
	placeObject?: IPlaceObject;
	addressData?: IAddressData;
}

export interface IAddressData {
	principalStreet: string;
	latitude: number;
	longitude: number;
	streetNumber: string;
	postalCode: string;
	isManualAddress: boolean;
}

export interface IPlaceObject {
	street_number: IAdministrativeAreaLevel1;
	route: IAdministrativeAreaLevel1;
	political: IAdministrativeAreaLevel1;
	locality: IAdministrativeAreaLevel1;
	administrative_area_level_2: IAdministrativeAreaLevel1;
	administrative_area_level_1: IAdministrativeAreaLevel1;
	country: IAdministrativeAreaLevel1;
	lat: number;
	long: number;
}

export interface IAdministrativeAreaLevel1 {
	long_name: string;
	short_name: string;
}

export interface ITableDetailsColumn<T extends object> {
	title: string;
	dataIndex: keyof T | string | number;
	key: string;
	disabled?: boolean | ((record: T, index: number, column: ITableDetailsColumn<T>) => boolean);
	type?: 'text' | 'number' | 'percentage' | 'select' | 'money';
	/** Solo se usa en `type: 'select'` cuando el valor viene null/undefined. */
	defaultValue?: string | number | ((record: T, index: number, column: ITableDetailsColumn<T>) => string | number);
	textTransform?: TTextTransform;
	maxDigits?: number;
	options?: { label: string; value: string | number }[];
	width?: number;
	minWidth?: number;
	min?: number;
	maxWidth?: number;
	actions?: {
		onClick: () => void;
	}[];
	errorAccessor?: (record: T, column: ITableDetailsColumn<T>) => string | undefined;
	errorKey?: keyof T | string;
	display?: 'flex' | 'block';
	align?: 'left' | 'center' | 'right';
	render?: (value: any, record: T, index: number) => ReactNode;
	fixed?: 'left' | 'right';
}

//test
export interface IMapSelectionDetails {
	principalStreet: string;
	secondaryStreet: string;
	streetNumber: string;
	postalCode: string;
	province: string;
	canton: string;
	parish: string;
	country: string;
}

export interface IMapSelectionPlaceObject {
	[key: string]: { long_name: string; short_name: string } | number | undefined;
	lat: number;
	long: number;
	route?: { long_name: string; short_name: string };
	intersection?: { long_name: string; short_name: string };
}

export interface IMapSelection {
	lat: number;
	lng: number;
	address: string;
	details: IMapSelectionDetails;
	placeObject: IMapSelectionPlaceObject;
	addressData: IAddressData;
}

export interface StackedCardData {
	id: number | string;
	content: ReactNode;
	title?: ReactNode;
	buttonTitle?: ReactNode;
	onButtonClick?: () => void;
	onRemoveClick?: () => void;
	emptyMessage?: string;
}
export interface IActionsValidatePermission {
	create: boolean;
	update: boolean;
	delete: boolean;
	read: boolean;
	allActions: boolean;
	programId: number;
	agencyId: number;
	path: string;
	pathParent: string;
	moduleId: number;
	submoduleId: number;
}
