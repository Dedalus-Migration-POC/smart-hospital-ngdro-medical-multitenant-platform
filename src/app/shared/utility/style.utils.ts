import { BaseCard } from '../../components/card/model';
import { TextStyle } from '../models/shared_model';

export function getTextColorHex(text?: TextStyle): string | null {
  return typeof text?.color === 'object' ? (text.color.hex ?? null) : null;
}

export function getBackgroundPaletteClass(card: BaseCard): string {
  // Le palette usano una classe Bootstrap;
  // i colori hex sono gestiti da getCardStyles.
  const palette = card.background?.fill?.palette;
  return palette ? `bg-${palette}` : '';
}
