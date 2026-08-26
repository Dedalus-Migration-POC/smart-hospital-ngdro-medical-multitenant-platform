import { PageSectionConfig } from '../../pages/page.model';
import { Item } from '../layout-system/models/layout.model';
import { BaseCard } from '../../components/card/model';
import { TextStyle } from '../models/shared_model';

// Id di sezione predefinito usato per individuare le card nelle
// pagine statiche/configurabili.
const DEFAULT_CARDS_SECTION_ID = 'cards-section';

export function mergeTextStyles(themeStyle?: TextStyle, specificStyle?: TextStyle): TextStyle {
  return {
    fontSize: specificStyle?.fontSize ?? themeStyle?.fontSize,
    fontWeight: specificStyle?.fontWeight ?? themeStyle?.fontWeight,
    color: {
      ...themeStyle?.color,
      ...specificStyle?.color,
    },
    lineHeight: specificStyle?.lineHeight ?? themeStyle?.lineHeight,
    isUppercase: specificStyle?.isUppercase ?? themeStyle?.isUppercase,
  };
}

// Unisce il tema base alla card, dando precedenza alla configurazione specifica.
export function mergeCardBase<T extends BaseCard>(base: Partial<BaseCard> | undefined, card: T): T {
  return {
    ...base,
    ...card,
    background: {
      ...base?.background,
      ...card.background,
    },
    border: {
      ...base?.border,
      ...card.border,
    },
    padding: {
      ...base?.padding,
      ...card.padding,
    },
    size: {
      ...base?.size,
      ...card.size,
    },
  } as T;
}

export function getCardStyles(card: BaseCard): Record<string, string> {
  const styles: Record<string, string> = {};
  const background = card.background;
  const border = card.border;
  const padding = card.padding;
  const size = card.size;

  if (background?.fill?.hex) styles['background'] = background.fill.hex;
  if (background?.gradient) styles['background'] = background.gradient;
  if (border?.width) styles['border-width'] = border.width;
  if (border?.style) styles['border-style'] = border.style;
  if (border?.color?.hex) styles['border-color'] = border.color.hex;
  if (border?.radius) {
    styles['border-radius'] = border.radius;
    styles['overflow'] = 'hidden';
  }
  if (card.shadow) styles['box-shadow'] = card.shadow;

  const all = padding?.all;
  const horizontal = padding?.x ?? all;
  const vertical = padding?.y ?? all;
  if (horizontal) styles['padding-left'] = styles['padding-right'] = horizontal;
  if (vertical) styles['padding-top'] = styles['padding-bottom'] = vertical;
  if (padding?.top) styles['padding-top'] = padding.top;
  if (padding?.right) styles['padding-right'] = padding.right;
  if (padding?.bottom) styles['padding-bottom'] = padding.bottom;
  if (padding?.left) styles['padding-left'] = padding.left;
  if (size?.basis) styles['flex-basis'] = size.basis;
  if (size?.width) styles['width'] = size.width;
  if (size?.height) styles['height'] = size.height;
  if (size?.minWidth) styles['min-width'] = size.minWidth;
  if (size?.minHeight) styles['min-height'] = size.minHeight;

  return styles;
}

// Raccoglie gli item SERVICE_CARDS cercando prima in cards-section,
// poi in tutte le sezioni come fallback, leggendo le aree start/center/end.
export function getServiceCardsItems(
  sections: PageSectionConfig[] | undefined,
  pageId: string,
  cardsSectionId: string = DEFAULT_CARDS_SECTION_ID,
): Item[] {
  if (!sections || sections.length === 0) {
    console.error(`[CardsUtils] Missing pageConfig.sections for ${pageId}`);
    return [];
  }

  const cardsSection = sections.find((section) => section.id === cardsSectionId);
  const sectionsToScan = cardsSection ? [cardsSection] : sections;

  const items = sectionsToScan.flatMap((section) => [
    ...(section.areas?.start?.items ?? []),
    ...(section.areas?.center?.items ?? []),
    ...(section.areas?.end?.items ?? []),
  ]);

  if (items.length === 0) {
    console.error(`[CardsUtils] No items found in start/center/end areas for ${pageId}`);
    return [];
  }

  return items.filter((item) => item?.type === 'SERVICE_CARDS');
}

// Restituisce le props della card per uno specifico id solo se il type è 'SERVICE_CARDS'.
export function getServiceCardsConfigById(
  items: Item[],
  cardId: string,
  pageId: string,
): Record<string, unknown> | undefined {
  const cardItem = items.find((item) => item?.id === cardId);

  if (cardItem?.type === 'SERVICE_CARDS') {
    return cardItem.props;
  }

  console.error(
    `[CardsUtils] Expected item id="${cardId}" with type="SERVICE_CARDS" for ${pageId}`,
    cardItem,
  );
  return undefined;
}
