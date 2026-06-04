import {
  FlexLayoutConfig,
  ImageConfig,
  LocalizedText,
  ActionConfig,
  TextSection,
  Colors,
  LinkTarget,
  TextConfig,
  FontSize,
  TextDecoration,
} from '../../shared/models/shared_model';

export type CardType = 'mediaText' | 'data';
export type Card = MediaTextCard | DataCard;

// Contenitore delle card
// e configurazione layout generale delle card stesse (es. se sono disposte in colonna o in riga, gap tra le card, ecc.)
// se viene settato un layout è valido per tutte le card, NON si possono settare layout diversi per card
export interface CardsContainer {
  id?: string;
  className?: string;
  ariaLabel?: LocalizedText;
  header?: TextSection;

  // layout del container principale
  containerLayout?: FlexLayoutConfig;

  // layout della lista di card, cioè come sono disposte le card tra loro
  itemsLayout?: FlexLayoutConfig;

  // layout interno comune applicato a ogni card, sia mediaText sia data
  itemsContentLayout?: FlexLayoutConfig;
  // layout comune delle actions, usato dalle DataCard
  actionsLayout?: FlexLayoutConfig;
  items: Card[];
}

export interface BaseCard {
  id: string;
  type: CardType;
  background?: Colors;
  className?: string;
  disabled?: boolean;
  ariaLabel?: LocalizedText;
}

// ******* TYPES CARD **************

// MEDIATEXTCARD: card "semplice" con testo, immagine e associata un'azione al click della card.
export interface MediaTextCard extends BaseCard {
  type: 'mediaText';
  text: TextSection;
  image: ImageConfig;
  action: ActionConfig;
  blocked?: boolean;
}

// DATACARD: card dinamica con elmenti come campi (label: value basati su dati del BE), azioni (bottoni o link) con link esterni o route interno
export interface DataCard extends BaseCard {
  type: 'data';
  fields: CardField[];
  fieldsLayout?: FlexLayoutConfig;
  actions?: DataCardAction[];
  actionsLayout?: FlexLayoutConfig;
}

export type CardField =
  | DataCardTextField
  | DataCardDateField
  | DataCardArrayField
  | DataCardImageField;

export interface BaseCardField {
  key: string; // es. 'metaInfo.insertionDate' o il size campo BE
  label: TextConfig;
  prefix?: string;
  suffix?: string;
  className?: string;
}

// valueMap: serve quando il BE manda un codice tecnico,
// ma vogliamo mostrare un testo leggibile nella card.
// Ex vecchio valuesI18n.
export interface DataCardTextField extends BaseCardField {
  type: 'text';
  valueMap?: Record<string, TextConfig>;
}

export interface DataCardDateField extends BaseCardField {
  type: 'date';
  format?: string;
}

// separator di default '-'
export interface DataCardArrayField extends BaseCardField {
  type: 'array';
  separator?: string;
}

export interface DataCardImageField extends BaseCardField {
  type: 'image';

  // Associa ogni possibile valore del BE a una configurazione immagine.
  // Ex vecchio valuesPathImage.
  imageMap?: Record<string, ImageConfig>;

  // Immagine di fallback se il valore BE non è presente in imageMap.
  fallbackImage?: ImageConfig;
}

export interface DataCardCondition {
  key: string; // path nel dato BE, es. 'metaInfo.state'
  operator: 'eq' | 'neq' | 'in' | 'notIn' | 'exists' | 'notExists' | 'empty' | 'notEmpty';
  value?: unknown;
}

export interface DataCardButtonRender {
  renderAs: 'button';
  buttonSize?: FontSize;
}

export interface DataCardLinkRender {
  renderAs: 'link';
  decoration?: TextDecoration;
}

export type DataCardRender = DataCardButtonRender | DataCardLinkRender;

export interface BaseDataCardAction {
  key: string;
  label: TextConfig;
  disabled?: boolean;
  disabledIf?: DataCardCondition[]; // l’action si vede, ma è disabilitata
  hideIf?: DataCardCondition[]; // l’action non si vede
  hideMessage?: TextConfig; // messaggio se non si vede l'action
  className?: string;
}

export interface DataCardActionCallback {
  nameFunction: string;
  params?: string[]; // path nel dato BE, es. ['documentId']
}

// callback = chiama una funzione del componente padre
// route = navigazione interna Angular
// externalLink = link esterno con window.open / href
export type DataCardAction =
  | DataCardCallbackAction
  | DataCardRouteAction
  | DataCardExternalLinkAction;

export type DataCardCallbackAction = BaseDataCardAction &
  DataCardRender & {
    type: 'callback';
    callback: DataCardActionCallback;
  };

export type DataCardRouteAction = BaseDataCardAction &
  DataCardRender & {
    type: 'route';

    // path statico Angular, es. '/documents/detail'
    url: string;

    // params per route dinamiche, es. '/documents/:documentId'
    // la key è il nome del parametro nella route
    // il value è il path nel dato BE
    routeParams?: Record<string, string>;

    // query params statici, es. { from: 'clinical-records' }
    queryParams?: Record<string, string | number | boolean>;

    // query params dinamici letti dal dato BE
    // es. { id: 'documentId', state: 'metaInfo.state' }
    queryParamsFromData?: Record<string, string>;
  };

export type DataCardExternalLinkAction = BaseDataCardAction &
  DataCardRender & {
    type: 'externalLink';
    url: string;
    target?: LinkTarget;
  };
