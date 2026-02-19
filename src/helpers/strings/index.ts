export const isRouteActive = (currentPath: string, baseRoute: string): boolean => {
	const normalizedCurrent = currentPath.replace(/\/+$/, '');
	const normalizedBase = baseRoute.replace(/\/+$/, '');

	return normalizedCurrent === normalizedBase || normalizedCurrent.startsWith(normalizedBase + '/');
};

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const toTitleCase = (str: string): string =>
	str.toLowerCase().replace(/(?:^|\s)\S/g, match => match.toUpperCase());


export const getMicroFrontendByPath = (path: string): string => {
	const segments = path.split('/');
	return segments[1] || '';
}

export const joinUrl = (base: string, path: string) => {
	const b = base.replace(/\/+$/, '');
	const p = path.replace(/^\/+/, '');
	return `${b}/${p}`;
};

export const isNumericOnly = (value: string): boolean => {
	if (!value || typeof value !== 'string') return false;
	return /^[0-9]+$/.test(value);
};


export const filterNumericOnly = (value: string): number => {
	if (!value || typeof value !== 'string') return 0;
	return Number(value.replace(/[^0-9]/g, ''));
};

export const filterPositiveNumbersOnly = (value: string): string => {
	if (!value || typeof value !== 'string') return '';
	
	// Permitir solo dígitos y un punto decimal
	const cleanValue = value.replace(/[^0-9.]/g, '');
	
	// Asegurar que solo haya un punto decimal
	const parts = cleanValue.split('.');
	if (parts.length > 2) {
		return parts[0] + '.' + parts.slice(1).join('');
	}
	
	// Convertir a número para validar que sea >= 0
	const numValue = Number(cleanValue);
	if (isNaN(numValue) || numValue < 0) {
		return '';
	}
	
	return cleanValue;
};

export const splitDelimitedValues = (
	value: string | null | undefined,
	delimiter = '/',
): string[] => {
	if (!value || typeof value !== 'string') return [];
	return value
		.split(delimiter)
		.map(item => item.trim())
		.filter(item => item.length > 0);
};