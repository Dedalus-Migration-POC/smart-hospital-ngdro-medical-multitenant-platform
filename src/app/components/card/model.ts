import {
  FlexLayoutConfig,
  ImageConfig,
  TextConfig,
  LocalizedText,
  ActionConfig,
  TextSection,
} from '../../shared/models/shared_model';

export type CardType = 'mediaText';
export type Card = MediaTextCard;

// container for cards (<ul></ul> or <div></div>)
export interface CardContainer {
  id?: string;
  className?: string;
  ariaLabel?: LocalizedText;
  header?: TextSection;
  containerLayout?: FlexLayoutConfig; // layout of the main container
  itemsLayout: FlexLayoutConfig; // layout of the internal element of card
  items: Card[];
}

export interface BaseCard {
  id: string;
  type: CardType;
  className?: string;
  blocked?: boolean;
  disabled?: boolean;
  ariaLabel?: LocalizedText;
  action: ActionConfig;
}

// Types card
export interface MediaTextCard extends BaseCard {
  type: 'mediaText';
  text: TextSection;
  image: ImageConfig;
}
