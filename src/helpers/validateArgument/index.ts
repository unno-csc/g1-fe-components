export type TValidateArgumentResult =
	| { ok: true; normalized: string }
	| { ok: false; normalized: string; reason: string };

export interface IValidateArgumentOptions {
	/**
	 * Mínimo de caracteres (después de trim/normalización de espacios).
	 * Default: 5
	 */
	minLength?: number;
	/**
	 * Si es `true`, exige al menos una vocal (A,E,I,O,U) luego de normalizar acentos.
	 * Default: true
	 */
	requireVowel?: boolean;
	/**
	 * Si es `true`, rechaza una sola palabra "corta" (suele ser genérica).
	 * Default: true (minSingleWordLength=8)
	 */
	forbidSingleShortWord?: boolean;
	/**
	 * Longitud mínima de una sola palabra para considerarla válida si `forbidSingleShortWord` está activo.
	 * Default: 8
	 */
	minSingleWordLength?: number;
	/**
	 * Si `minWords` > 1, exige mínimo de palabras separadas por espacios.
	 * Default: 1
	 */
	minWords?: number;
	/**
	 * Si `minMeaningfulWords` > 1, exige un mínimo de palabras de tamaño >= `meaningfulWordMinLength`.
	 * Default: 1
	 */
	minMeaningfulWords?: number;
	/**
	 * Longitud mínima para contar una palabra como "significativa".
	 * Default: 4
	 */
	meaningfulWordMinLength?: number;
	/**
	 * Lista de placeholders a rechazar por igualdad exacta (luego de normalizar).
	 */
	forbiddenExact?: string[];
	/**
	 * Patrones extra para rechazar (se evalúan sobre el texto normalizado).
	 */
	forbiddenPatterns?: RegExp[];
	/**
	 * Si es `true`, activa una heurística local para rechazar palabras tipo "SDSSDFSDF".
	 * Default: false (para evitar falsos positivos con siglas/códigos).
	 */
	detectGibberishWords?: boolean;
}

export interface IValidateArgumentWithIAOptions {
	/**
	 * Endpoint compatible con LanguageTool.
	 * Default: https://api.languagetool.org/v2/check
	 */
	endpoint?: string;
	/**
	 * Idioma para LanguageTool.
	 * Default: 'es'
	 */
	language?: string;
	/**
	 * Timeout del request.
	 * Default: 6000ms
	 */
	timeoutMs?: number;
	/**
	 * Si es `true`, cuando falla el request se rechaza el texto (fail-closed).
	 * Default: false (fail-open).
	 */
	failClosed?: boolean;
	/**
	 * Cantidad mínima de misspellings para rechazar.
	 * Default: 1
	 */
	minMisspellings?: number;
	/**
	 * Si es `true`, rechaza ante cualquier misspelling (más estricto).
	 * Default: false (solo rechaza tokens que parezcan "basura").
	 */
	rejectOnAnyMisspelling?: boolean;
}

export interface IValidateArgumentUnifiedOptions {
	/**
	 * Opciones para la validación local (sin red).
	 */
	baseOptions?: IValidateArgumentOptions;
	/**
	 * Si es `true`, luego de pasar la validación local se hace el request a LanguageTool.
	 * Default: false
	 */
	useIA?: boolean;
	/**
	 * Opciones para el request a LanguageTool.
	 */
	iaOptions?: IValidateArgumentWithIAOptions;
}

const DEFAULT_FORBIDDEN_EXACT: string[] = [
	'N/A',
	'NA',
	'NO APLICA',
	'NONE',
	'NULL',
	'NULO',
	'VACIO',
	'VACÍO',
	'SIN NADA',
	'NADA',
	'NINGUNO',
	'SIN INFORMACION',
	'SIN INFORMACIÓN',
	'SIN DATOS',
	'SIN ESPECIFICAR',
	'OTRO',
];

const DEFAULT_OPTIONS: Required<
	Pick<
		IValidateArgumentOptions,
		| 'minLength'
		| 'requireVowel'
		| 'forbidSingleShortWord'
		| 'minSingleWordLength'
		| 'minWords'
		| 'minMeaningfulWords'
		| 'meaningfulWordMinLength'
		| 'detectGibberishWords'
	>
> = {
	minLength: 5,
	requireVowel: true,
	forbidSingleShortWord: true,
	minSingleWordLength: 8,
	minWords: 1,
	minMeaningfulWords: 1,
	meaningfulWordMinLength: 4,
	detectGibberishWords: false,
};

const DEFAULT_IA_OPTIONS: Required<IValidateArgumentWithIAOptions> = {
	endpoint: 'https://api.languagetool.org/v2/check',
	language: 'es',
	timeoutMs: 6000,
	failClosed: false,
	minMisspellings: 1,
	rejectOnAnyMisspelling: false,
};

export const normalizeArgumentText = (text: string): string => {
	if (typeof text !== 'string') return '';
	return text
		.trim()
		.replace(/\s+/g, ' ')
		.toUpperCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');
};


/**
 * Determina si un token es un código técnico o abreviación válida.
 * Si retorna true, la validación de "gibberish" lo ignorará.
 */
const isTechnicalToken = (token: string): boolean => {
    const normalized = token.toUpperCase().trim();

    // 1. Contiene números: Casi siempre es un folio, placa o documento (ej: 30000A258)
    if (/\d/.test(normalized)) return true;

    // 2. Abreviaciones comunes cortas (2 a 4 letras)
    const commonAbbr = ['FAC', 'REC', 'OBS', 'OC', 'OP', 'DNI', 'RUC', 'IGV'];
    if (commonAbbr.includes(normalized)) return true;

    // 3. Formatos tipo siglas (ej: ABC-123 o XYZ)
    if (normalized.length <= 4 && /^[A-Z0-9]+$/.test(normalized)) return true;

    return false;
};

export const isLikelyGibberishWord = (word: string): boolean => {
    // Si parece un código técnico, NO es gibberish
    if (isTechnicalToken(word)) return false;

    const normalized = normalizeArgumentText(word);
    const lettersOnly = normalized.replace(/[^A-Z]/g, '');

    if (lettersOnly.length < 5) return false; // Muy corto para juzgar seriamente

    // Caso: asdasdasdsad (pocas letras distintas en relación al largo)
    const uniqueChars = new Set(lettersOnly.split('')).size;
    if (lettersOnly.length > 6 && uniqueChars <= 3) return true;

    // Caso: ssssssssss (repetición)
    if (/(.)\1{3,}/.test(lettersOnly)) return true;

    // Caso: fghjkl (sin vocales y largo)
    if (!/[AEIOU]/.test(lettersOnly) && lettersOnly.length > 5) return true;

    // Caso: racha de consonantes (ej: "psshhh" es ok, "sdfghj" no)
    if (/[BCDFGHJKLMNPQRSTVWXYZ]{6,}/.test(lettersOnly)) return true;

    return false;
};

/**
 * Heurística LOCAL (no IA) para detectar palabras que parecen "basura".
 * - Evita falsos positivos ignorando tokens cortos (siglas: DNI, RUC, ITSA).
 * - Detecta ausencia de vocales y rachas largas de consonantes.
 */
// export const isLikelyGibberishWord = (word: string): boolean => {
// 	const normalized = normalizeArgumentText(word);
// 	const lettersOnly = normalized.replace(/[^A-Z]/g, '');

// 	// Siglas/códigos cortos: mejor no tocar (reduce falsos positivos)
// 	if (lettersOnly.length < 8) return false;

// 	// Sin vocales: casi siempre es ruido ("SDSSDFSDF")
// 	if (!/[AEIOU]/.test(lettersOnly)) return true;

// 	// Racha larga de consonantes (muy raro en ES)
// 	if (/[BCDFGHJKLMNPQRSTVWXYZ]{6,}/.test(lettersOnly)) return true;

// 	// Patrón repetido (ASDFASDFASDF)
// 	if (/^([A-Z]{2,5})\1{2,}$/.test(lettersOnly)) return true;

// 	// Ratio de vocales demasiado extremo
// 	const vowelCount = lettersOnly.match(/[AEIOU]/g)?.length ?? 0;
// 	const vowelRatio = vowelCount / lettersOnly.length;
// 	return vowelRatio < 0.2 || vowelRatio > 0.8;
// };

/**
 * Detecta tokens tipo "ASDASASDAS" que suelen ser teclado/ruido.
 * Se usa para filtrar falsos positivos de LanguageTool (tildes/estilo/case).
 */
const looksLikeGibberishToken = (token: string): boolean => {
	const normalized = normalizeArgumentText(token);
	const lettersOnly = normalized.replace(/[^A-Z]/g, '');
	if (lettersOnly.length < 8) return false;

	// Pocas letras distintas (ej: solo A/S/D)
	const unique = new Set(lettersOnly.split('')).size;
	if (unique <= 3) return true;

	// Mucha repetición de patrón corto
	if (/^([A-Z]{2,4})\1{2,}$/.test(lettersOnly)) return true;

	// Heurística general
	return isLikelyGibberishWord(lettersOnly);
};

const isShortAbbreviationOrCode = (token: string): boolean => {
	const compact = normalizeArgumentText(token).replace(/\s+/g, '');
	const letters = compact.replace(/[^A-Z]/g, '');
	const digits = compact.replace(/[^0-9]/g, '');

	// Ej: OC, OP, FAC
	if (/^[A-Z]{2,4}$/.test(compact)) return true;

	// Ej: OC123, FAC2026 (sigla + números)
	if (/^[A-Z]{2,4}[0-9]{1,10}$/.test(compact)) return true;

	// fallback: token corto con letras+digitos (códigos)
	if (compact.length <= 6 && letters.length >= 2 && /^[A-Z0-9]+$/.test(compact) && digits.length > 0) return true;

	return false;
};

type TLanguageToolResponse = {
	matches?: Array<{
		offset?: number;
		length?: number;
		context?: { text?: string; offset?: number; length?: number };
		rule?: {
			id?: string;
			issueType?: string;
		};
	}>;
};

/**
 * Validador adicional (opcional) que consulta LanguageTool.
 * Nota: esto es un servicio externo (red), así que úsalo solo si quieres esa capa extra.
 */
export const validateArgumentWithIA = async (
	text: string,
	options?: IValidateArgumentWithIAOptions,
	baseResult?: TValidateArgumentResult,
): Promise<TValidateArgumentResult> => {
	const base = baseResult ?? validateArgument(text);
	if (!base.ok) return base;

	const opts = { ...DEFAULT_IA_OPTIONS, ...(options ?? {}) };
	const fetchFn: typeof fetch | undefined = typeof globalThis.fetch === 'function' ? globalThis.fetch : undefined;
	if (!fetchFn) {
		return opts.failClosed ? { ok: false, normalized: base.normalized, reason: 'FETCH_NOT_AVAILABLE' } : base;
	}

	const controller = typeof AbortController !== 'undefined' ? new AbortController() : undefined;
	const timeoutId =
		controller && opts.timeoutMs > 0 ? setTimeout(() => controller.abort(), opts.timeoutMs) : undefined;

	try {
		const res = await fetchFn(opts.endpoint, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({ text, language: opts.language }),
			signal: controller?.signal,
		});

		if (!res.ok) {
			return opts.failClosed ? { ok: false, normalized: base.normalized, reason: 'IA_HTTP_ERROR' } : base;
		}

		const data = (await res.json()) as TLanguageToolResponse;
		const matches = data.matches ?? [];
		const misspellingMatches = matches.filter(m => m.rule?.issueType === 'misspelling');

		let misspellings = 0;
		if (opts.rejectOnAnyMisspelling) {
			misspellings = misspellingMatches.length;
		} else {
			// Menos exigente: solo cuenta misspellings si el token parece "basura"
			for (const m of misspellingMatches) {
				const offset = m.offset ?? m.context?.offset ?? 0;
				const length = m.length ?? m.context?.length ?? 0;
				const token = length > 0 ? text.slice(offset, offset + length) : '';

				// Ignorar siglas/abreviaciones/códigos cortos (OC, OP, FAC, OC123)
				if (isShortAbbreviationOrCode(token)) continue;

				if (looksLikeGibberishToken(token)) {
					misspellings++;
				}
			}
		}

		if (misspellings >= opts.minMisspellings) {
			return { ok: false, normalized: base.normalized, reason: 'IA_DETECTED_GIBBERISH' };
		}

		return base;
	} catch (e) {
		return opts.failClosed ? { ok: false, normalized: base.normalized, reason: 'IA_REQUEST_FAILED' } : base;
	} finally {
		if (timeoutId) clearTimeout(timeoutId);
	}
};

/**
 * Validación unificada:
 * 1) Ejecuta `validateArgument` (local)
 * 2) Si pasa y `useIA` es true, ejecuta `validateArgumentWithIA` (red)
 */
export const validateArgumentUnified = async (
	text: string,
	options?: IValidateArgumentUnifiedOptions,
): Promise<TValidateArgumentResult> => {
	const base = validateArgument(text, options?.baseOptions);
	if (!base.ok) return base;
	if (!options?.useIA) return base;
	return validateArgumentWithIA(text, options?.iaOptions, base);
};

/**
 * Valida un "argumento" (texto libre) con reglas semánticas mínimas (sin IA).
 * Pensado para integrarse con React Hook Form / validaciones de formularios.
 */
export const validateArgument = (text: string, options?: IValidateArgumentOptions): TValidateArgumentResult => {
	const opts = { ...DEFAULT_OPTIONS, ...(options ?? {}) };
	const normalized = normalizeArgumentText(text);

	if (!normalized) return { ok: false, normalized, reason: 'EMPTY' };

	// 1) Bloqueo de placeholders comunes (variantes tipo "N / A", "N-A", etc.)
	const normalizedNoSpaces = normalized.replace(/\s+/g, '');
	if (/^N[\/\\\-_]*A$/.test(normalizedNoSpaces)) {
		return { ok: false, normalized, reason: 'FORBIDDEN_PLACEHOLDER' };
	}

	const forbiddenExact = (options?.forbiddenExact ?? DEFAULT_FORBIDDEN_EXACT).map(x => normalizeArgumentText(x));
	if (forbiddenExact.includes(normalized)) {
		return { ok: false, normalized, reason: 'FORBIDDEN_EXACT' };
	}

	const forbiddenPatterns = options?.forbiddenPatterns ?? [];
	for (const pattern of forbiddenPatterns) {
		if (pattern.test(normalized)) {
			return { ok: false, normalized, reason: 'FORBIDDEN_PATTERN' };
		}
	}

	// 2) Muy corto
	if (normalized.length < opts.minLength) {
		return { ok: false, normalized, reason: 'TOO_SHORT' };
	}

	// 3) Debe contener al menos una letra
	if (!/[A-Z]/.test(normalized)) {
		return { ok: false, normalized, reason: 'NO_LETTERS' };
	}

	// 4) No solo números/símbolos/puntuación
	if (/^[0-9.\-_/\\]+$/.test(normalizedNoSpaces)) {
		return { ok: false, normalized, reason: 'ONLY_NUMBERS_OR_SYMBOLS' };
	}

	// 5) Debe contener vocales (evita "SDSSDFSDF")
	if (opts.requireVowel && !/[AEIOU]/.test(normalized)) {
		return { ok: false, normalized, reason: 'NO_VOWELS' };
	}

	// 6) Repetición exagerada de caracteres (ej: ".....", "AAAAAA")
	if (/(.)\1{4,}/.test(normalizedNoSpaces)) {
		return { ok: false, normalized, reason: 'REPEATED_CHARS' };
	}

    // 7) Reglas por palabras
    const words = normalized.split(' ').filter(w => w.length > 0);

    // NUEVA LÓGICA: Validar legibilidad de CADA palabra
    for (const w of words) {
        // Ignoramos palabras muy cortas (como "de", "con", "a") 
        // a menos que queramos ser extremadamente estrictos.
        if (w.length <= 3) continue;

        if (isLikelyGibberishWord(w)) {
            return { ok: false, normalized, reason: 'GIBBERISH_WORD_DETECTED' };
        }
    }

    // Validación de palabra única corta
    const firstWord = words[0] ?? '';
    if (
        opts.forbidSingleShortWord &&
        words.length === 1 &&
        firstWord.length < opts.minSingleWordLength &&
        !isTechnicalToken(firstWord)
    ) {
        return { ok: false, normalized, reason: 'SINGLE_WORD_TOO_SHORT' };
    }

	// const firstWord = words[0] ?? '';
	// if (
	// 	opts.forbidSingleShortWord &&
	// 	words.length === 1 &&
	// 	firstWord.length < opts.minSingleWordLength &&
	// 	!isShortAbbreviationOrCode(firstWord)
	// ) {
	// 	return { ok: false, normalized, reason: 'SINGLE_WORD_TOO_SHORT' };
	// }

	const meaningfulWords = words.filter(w => w.length >= opts.meaningfulWordMinLength);
	if (opts.minMeaningfulWords > 1 && meaningfulWords.length < opts.minMeaningfulWords) {
		return { ok: false, normalized, reason: 'NOT_ENOUGH_MEANINGFUL_WORDS' };
	}

	// 8) Palabra repetida muchas veces (ej: "PAGO PAGO PAGO")
	if (words.length >= 3 && new Set(words).size === 1) {
		return { ok: false, normalized, reason: 'REPEATED_WORDS' };
	}

	return { ok: true, normalized };
};

/**
 * Wrapper común: devuelve boolean para validaciones simples.
 */
export const isValidArgument = (text: string, options?: IValidateArgumentOptions): boolean => {
	return validateArgument(text, options).ok;
};
