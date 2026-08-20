import type { ReactNode } from 'react';

export type AppEnvironment = 'LOCAL' | 'DESARROLLO' | 'PRUEBAS' | 'PRODUCCION';

const LOGIN_WATERMARK_ROWS = 20;
const LOGIN_WATERMARK_COLS = 10;
const LOGIN_WATERMARK_TILE_COUNT = LOGIN_WATERMARK_ROWS * LOGIN_WATERMARK_COLS;
// 3 rows tall (to fill the header height) x enough columns to cover very wide screens.
// `auto-cols-max` sizes each column to its own content instead of splitting the width evenly
// (which is what caused the label to get squeezed/overlapped), so spacing stays even while
// still tiling across both axes; the overflow just gets clipped by the header.
const HEADER_WATERMARK_ROWS = 3;
const HEADER_WATERMARK_COLS = 50;
const HEADER_WATERMARK_TILE_COUNT = HEADER_WATERMARK_ROWS * HEADER_WATERMARK_COLS;

/** Repeating environment watermark for full-page surfaces (e.g. login). */
export const ENVIRONMENT_WATERMARK_LAYER_CLASSNAME =
	'absolute inset-0 z-0 grid h-[100dvh] w-full grid-cols-10 grid-rows-[repeat(20,minmax(0,1fr))] place-items-center gap-x-1 gap-y-0 px-2 select-none pointer-events-none overflow-hidden';

/** Watermark tiled across both rows and columns to fill the header bar evenly. */
export const HEADER_ENVIRONMENT_WATERMARK_LAYER_CLASSNAME =
	'absolute inset-0 z-0 grid grid-flow-col grid-rows-3 auto-cols-max items-center gap-x-6 gap-y-0 whitespace-nowrap select-none pointer-events-none overflow-hidden px-4';

const ENVIRONMENT_WATERMARK_TEXT_CLASSNAME =
	'text-sm font-bold uppercase tracking-[0.35em] whitespace-nowrap';

const HEADER_ENVIRONMENT_WATERMARK_TEXT_CLASSNAME =
	'shrink-0 text-[10px] leading-none font-bold uppercase tracking-[0.25em] whitespace-nowrap';

export function getEnvironmentWatermarkLabel(environment: AppEnvironment): string {
	const map: Record<AppEnvironment, string> = {
		LOCAL: 'LOCAL',
		DESARROLLO: 'DESARROLLO',
		PRUEBAS: 'PRUEBAS',
		PRODUCCION: 'PRODUCCIÓN',
	};
	return map[environment];
}

/** Repeating watermark markup for login and similar full-page layouts. */
export function renderEnvironmentWatermark(environment: AppEnvironment): ReactNode {
	const label = getEnvironmentWatermarkLabel(environment);

	return Array.from({ length: LOGIN_WATERMARK_TILE_COUNT }).map((_, index) => (
		<span key={index} className={ENVIRONMENT_WATERMARK_TEXT_CLASSNAME}>
			{label}
		</span>
	));
}

/** Even single-row watermark for the app header bar. */
export function renderHeaderEnvironmentWatermark(environment: AppEnvironment): ReactNode {
	const label = getEnvironmentWatermarkLabel(environment);

	return Array.from({ length: HEADER_WATERMARK_TILE_COUNT }).map((_, index) => (
		<span key={index} className={HEADER_ENVIRONMENT_WATERMARK_TEXT_CLASSNAME}>
			{label}
		</span>
	));
}
