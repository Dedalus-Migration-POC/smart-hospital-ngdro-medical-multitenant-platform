import { PageSectionConfig } from '../../pages/page.model';
import { Item } from '../layout-system/models/layout.model';

// Id di sezione predefinito usato per individuare le card nelle
// pagine statiche/configurabili.
const DEFAULT_CARDS_SECTION_ID = 'cards-section';

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
