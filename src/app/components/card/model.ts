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
  FontWeight,
  LineHeight,
  TextStyle,
} from '../../shared/models/shared_model';

export type CardType = 'mediaText' | 'data';
// Tipi di configurazione (usati per definire la struttura statica delle card)
export type Card = MediaTextCard | DataCard;
// Tipi runtime (usati dopo compileActions(), passati ai componenti)
export type CompiledCard = MediaTextCard | CompiledDataCard;

// Contenitore delle card — tipo di CONFIGURAZIONE
// e configurazione layout generale delle card stesse (es. se sono disposte in colonna o in riga, gap tra le card, ecc.)
// se viene settato un layout è valido per tutte le card, NON si possono settare layout diversi per card
export interface CardsContainer {
  id?: string;
  className?: string;
  ariaLabel?: LocalizedText;
  header?: TextSection;

  // layout del container principale
  // header + cards, es. se header è sopra le card o a fianco, gap tra header e card, ecc.
  containerLayout?: FlexLayoutConfig;

  // layout interno comune applicato a ogni card, sia mediaText sia data
  itemsLayout?: FlexLayoutConfig;
  // Responsive width della card con le classi di bootstrap
  itemColBootstrapClasses?: string;
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

// DATACARD: card dinamica con elmenti come campi (label: value => basati su dati del BE), azioni (bottoni o link) con link esterni o route interno
// Tipo di CONFIGURAZIONE: actions accetta solo DataCardAction[]
export interface DataCard extends BaseCard {
  type: 'data';
  titleSubtitle: DataCardTitleSubtitle;
  fields: CardField[];
  actions?: DataCardAction[];
  actionsLayout?: FlexLayoutConfig;
}

// Tipo RUNTIME: estende DataCard con actions che include anche i messaggi compilati da compileActions()
export interface CompiledDataCard extends Omit<DataCard, 'actions'> {
  actions?: DataCardCompiledAction[];
}

export interface DataCardTitleSubtitle {
  title: DataCardTitleSubtitleBinding;
  subTitle?: DataCardTitleSubtitleBinding;
}

export interface DataCardTitleSubtitleBinding {
  key: string;
  fontSize?: FontSize;
  fontWeight?: FontWeight;
  color?: Colors;
  lineHeight?: LineHeight;
}

export type CardField =
  | DataCardTextField
  | DataCardDateField
  | DataCardArrayField
  | DataCardImageField
  | DataCardBadgeField;

export interface BaseCardField {
  key: string; // es. 'metaInfo.insertionDate' o il size campo BE
  label: TextConfig;
  valueStyle?: TextStyle;
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

export interface DataCardArrayField extends BaseCardField {
  type: 'array';
  itemKey?: string; // se il BE ritorna un array di oggetti, questo campo specifica la key dell'oggetto da usare come valore da mostrare nella card
  listStyle?: 'comma' | 'dash' | 'bullet'; // stile di separazione tra gli elementi dell'array. Default: 'dash'
}

export interface DataCardImageField extends BaseCardField {
  type: 'image';

  // Associa ogni possibile valore del BE a una configurazione immagine.
  // Ex vecchio valuesPathImage.
  imageMap?: Record<string, ImageConfig>;

  // Immagine di fallback se il valore BE non è presente in imageMap.
  fallbackImage?: ImageConfig;
}

export interface DataCardBadgeField extends BaseCardField {
  type: 'badge';

  // Associa ogni possibile valore del BE a una configurazione badge.
  badgeMap?: Record<string, TextConfig>;

  // Badge di fallback se il valore BE non è presente in badgeMap.
  fallbackBadge?: TextConfig;
}

export interface DataCardCondition {
  key: string; // path nel dato BE, es. 'metaInfo.state'
  operator:
    | 'eq' // value === condition.value
    | 'neq' // value !== condition.value
    | 'in' // value è incluso in condition.value (array)
    | 'notIn' // value NON è incluso in condition.value (array)
    | 'exists' // value !== undefined && value !== null
    | 'notExists' // value === undefined || value === null
    | 'empty' // value è null, undefined, '', oppure array vuoto
    | 'notEmpty'; // value NON è null, undefined, '', oppure array vuoto
  value?: unknown;
}

export interface DataCardButtonRender {
  renderAs: 'button';
  fullWidth?: boolean; // se true, aggiunge w-100 al bottone
  className?: string;
}

export interface DataCardLinkRender {
  renderAs: 'link';
  decoration?: TextDecoration;
  fullWidth?: boolean; // se true, aggiunge w-100 al link
  className?: string;
}

export type DataCardActionRender = DataCardButtonRender | DataCardLinkRender;

export interface BaseDataCardAction {
  key: string;
  label: TextConfig;
  disabled?: boolean;
  disabledIf?: DataCardCondition[]; // l’action si vede, ma è disabilitata
  hideIf?: DataCardCondition[]; // l’action non si vede
  hideMessage?: TextConfig; // messaggio mostrato al posto dell'action quando è nascosta

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

// Tipo runtime generato da compileActions() quando un'action è nascosta e ha un hideMessage.
// Non va usato nella configurazione statica delle card.
export interface DataCardCompiledMessageAction {
  key: string;
  renderAs: 'message';
  message: TextConfig;
}

export type DataCardCompiledAction = DataCardAction | DataCardCompiledMessageAction;

// Tipo RUNTIME per il contenitore: items contiene CompiledCard invece di Card
export interface CompiledCardsContainer extends Omit<CardsContainer, 'items'> {
  items: CompiledCard[];
}

export type DataCardCallbackAction = BaseDataCardAction &
  DataCardActionRender & {
    type: 'callback';
    callback: DataCardActionCallback;
    compiledCallback?: () => void;
  };

export type DataCardRouteAction = BaseDataCardAction &
  DataCardActionRender & {
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
    // callback compilata dal parent component, pronta all'esecuzione
    compiledCallback?: () => void;
  };

export type DataCardExternalLinkAction = BaseDataCardAction &
  DataCardActionRender & {
    type: 'externalLink';
    url: string;
    target?: LinkTarget;
    compiledCallback?: () => void;
  };
