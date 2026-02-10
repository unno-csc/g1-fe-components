export { TextRenderer } from './TextRenderer';
export { BadgeRenderer } from './BadgeRenderer';
export { LinkRenderer } from './LinkRenderer';
export { TableRenderer } from './TableRenderer';
export { GalleryRenderer } from './GalleryRenderer';
export { DateRenderer } from './DateRenderer';
export { CurrencyRenderer } from './CurrencyRenderer';
export { ArrayRenderer } from './ArrayRenderer';
export { CustomRenderer } from './CustomRenderer';

import { TextRenderer } from './TextRenderer';
import { BadgeRenderer } from './BadgeRenderer';
import { LinkRenderer } from './LinkRenderer';
import { TableRenderer } from './TableRenderer';
import { GalleryRenderer } from './GalleryRenderer';
import { DateRenderer } from './DateRenderer';
import { CurrencyRenderer } from './CurrencyRenderer';
import { ArrayRenderer } from './ArrayRenderer';
import { CustomRenderer } from './CustomRenderer';
import { RendererRegistry } from '../schema/types';

export const defaultRenderers: RendererRegistry = {
	text: TextRenderer,
	badge: BadgeRenderer,
	link: LinkRenderer,
	table: TableRenderer,
	gallery: GalleryRenderer,
	date: DateRenderer,
	currency: CurrencyRenderer,
	array: ArrayRenderer,
	custom: CustomRenderer,
};
