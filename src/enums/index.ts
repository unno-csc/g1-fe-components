// TODO: update these enums while new developments are done (working along Ant Design)
export enum EErrorCodes {
	UNKNOWN = 'UNKNOWN',
	UNHANDLED = 'UNHANDLED',
	SCHEMA = 'SCHEMA',
	VALIDATION = 'VALIDATION',
	BY_CODE = 'BY_CODE',
	ELSE = 'ELSE',
	MESSAGE_ELSE = 'MESSAGE_ELSE',
	INITIAL = 'INITIAL',
	API_ERROR = 'API_ERROR',
	OTHERS = 'OTHERS',
} // this probably would need to be updated depending on implementations

export enum ESize {
	extraSmall = 'extraSmall',
	small = 'small',
	medium = 'medium',
	large = 'large',
}

export enum EStatus {
	info = 'info',
	success = 'success',
	warning = 'warning',
	error = 'error',
}

export enum EButtonColor {
	primary = 'primary',
	secondary = 'secondary',
	error = 'error',
	info = 'info',
}

export enum EButtonVariant {
	contained = 'contained',
	text = 'text',
	outlined = 'outlined',
}

export enum ESortOrder {
	asc = 'asc',
	desc = 'desc',
}

export enum EOrientation {
	horizontal = 'horizontal',
	vertical = 'vertical',
}

export enum EInput {
	text = 'text',
	number = 'number',
	search = 'search',
	file = 'file',
	password = 'password',
	phone = 'phone',
	currency = 'currency',
}

export enum EAlertVariant {
	filled = 'filled',
	outlined = 'outlined',
	standard = 'standard',
}

export enum ECardVariant {
	elevation = 'elevation',
	outlined = 'outlined',
}

export enum EAlignment {
	left = 'left',
	right = 'right',
	center = 'center',
}

export enum EInputMaskFormat {
	mobile = '#########',
	internationalMobile = '############',
	landline = '#########',
	idCard = '##########',
	ruc = '#############',
}

export enum EDateMaskFormat {
	DDMMYYYY = 'DD/MM/YYYY',
	MMDDYYYY = 'MM/DD/YYYY',
	YYYYMMDD = 'YYYY-MM-DD',
	YYYYMMDD_HHMM = 'YYYY-MM-DD HH:mm',
	YYYYMMDD_HHMMSS = 'YYYY-MM-DD HH:mm:ss',
	DDMMYY = 'DD/MM/YY',
	MMDDYY = 'MM/DD/YY',
	YYYY = 'YYYY',
	MMYYYY = 'MM/YYYY',
	DDMM = 'DD/MM',
	ISO = 'YYYY-MM-DDTHH:mm:ssZ',
	ISO_DATE = 'YYYY-MM-DD',
	TIME = 'HH:mm:ss',
	TIME_SHORT = 'HH:mm',
	FULL_DATETIME = 'DD/MM/YYYY HH:mm:ss',
	FULL_DATETIME_SHORT = 'DD/MM/YYYY HH:mm',
}

export enum EPosition {
	top = 'top',
	left = 'left',
	right = 'right',
	bottom = 'bottom',
}

export enum ETarget {
	blank = '_blank',
	self = '_self',
}

export enum EHover {
	hover = 'hover',
	none = 'none',
}

export enum ESkeletonVariant {
	text = 'text',
	circular = 'circular',
	rectangular = 'rectangular',
	rounded = 'rounded',
}

// TODO: double check with BE
export enum EUserRole {
	admin = 'ADMIN',
	// TODO: add all off them
}

export enum EAddressType {
	home = 'DOMICILIO',
	work = 'TRABAJO',
	delivery = 'ENTREGA',
	other = 'OTRO',
}

export enum EEmailType {
	personal = 'PERSONAL',
	work = 'TRABAJO',
	other = 'OTRO',
}

export enum EPhoneType {
	mobile = 'MOVIL',
	home = 'DOMICILIO',
	work = 'TRABAJO',
	other = 'OTRO',
}

export enum EPhoneConnectionType {
	mobile = 'MOBILE',
	landline = 'LANDLINE',
}

export enum EIdType {
	idCard = 'CÉDULA',
	ruc = 'RUC',
	passport = 'PASAPORTE',
}

export enum EMaritalStatus {
	single = 'SOLTERO',
	married = 'CASADO',
	divorced = 'DIVORCIADO',
	widowed = 'VIUDO',
	domesticPartnership = 'UNIÓN LIBRE',
}

export enum EGender {
	male = 'MASCULINO',
	female = 'FEMENINO',
}

export enum ETaxPayerType {
	naturalPerson = 'PERSONA NATURAL',
	privateCompany = 'SOCIEDAD PRIVADA',
	publicCompany = 'SOCIEDAD PÚBLICA',
}

export enum EItemStatus {
	active = 'ACTIVE',
	inactive = 'INACTIVE',
	all = 'ALL',
}

export enum EClientType {
	normal = 'NORMAL',
	employee = 'EMPLEADO',
	wholesaler = 'MAYORISTA',
	all = 'TODOS',
}

export enum EItemBooleanStatus {
	yes = 'Si',
	no = 'No',
}

export enum ESupplierType {
	national = 'NACIONAL',
	international = 'INTERNACIONAL',
}

export enum ESellerType {
	internal = 'INTERNO',
	external = 'EXTERNO',
}

export enum EOptionsConstantsTypes {
	boolean = 'BOOLEANO',
	text = 'CADENA',
	numeric = 'NUMERICO',
	date = 'FECHA',
}

export enum EPricingPolicies {
	ipv = 'IPV',
	pmc = 'PMC',
	vgc = 'VGC',
}

export enum EPricingPoliciesInterest {
	ipg = 'IPG',
	pes = 'PES',
}

export enum EDate {
	year = 'year',
	month = 'month',
	day = 'day',
	full = 'full',
}

export enum ETransmissionType {
	auto = 'AUTOMÁTICO',
	manual = 'MANUAL',
}

export enum ELocalStorageKeys {
	agencyId = 'agencyId',
	moduleId = 'moduleId',
	submoduleId = 'submoduleId',
	refreshToken = 'refreshToken',
	currentEnvironment = 'currentEnvironment',
	moduleHomeSelectedId = 'moduleHomeSelectedId',
	collapsedSidebar = 'collapsedSidebar',
}

export enum EMicroFrontends {
	itsaBackOffice = 'BACKOFFICE',
	itsaFrontoffice = 'FRONTOFFICE',
}

export enum EOptionsFilterStatus {
	inactive = 0,
	active = 1,
	undefined = 2,
}


export enum EActionType {
	create = 1,
	read = 3,
	update = 2,
	delete = 4,
	allActions = 0,
}

export enum EMapZoom {
	zoom1 = 1,
	zoom2 = 2,
	zoom3 = 3,
	zoom4 = 4,
	zoom5 = 5,
	zoom6 = 6,
	zoom7 = 7,
	zoom8 = 8,
	zoom9 = 9,
	zoom10 = 10,
	zoom11 = 11,
	zoom12 = 12,
	zoom13 = 13,
	zoom14 = 14,
	zoom15 = 15,
	zoom16 = 16,
	zoom17 = 17,
	zoom18 = 18,
	zoom19 = 19,
	zoom20 = 20,
}

export enum ETreeNodeTypeComponent {
	select = 'SELECT',
	crud = 'CRUD',
}