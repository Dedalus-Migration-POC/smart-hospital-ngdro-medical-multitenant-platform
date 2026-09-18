import {
  BackgroundConfig,
  FlexLayoutConfig,
  BorderConfig,
  IconConfig,
  LinkStyle,
  SizeConfig,
  SpacingConfig,
  TextConfig,
  TextStyle,
} from 'src/app/shared/models/shared_model';
import { ImageBlockConfig } from '../image-block/model';

// TODO: l'orientamento verticale non è supportato nell'interfaccia utente.
// TOD0: per ora è ottimizzato solo il layout column dei fields
export interface FeedRssProps {
  container: {
    // stile del contenitore principale del feed RSS
    title: TextConfig;
    size?: SizeConfig;
    background?: BackgroundConfig;
    margin?: SpacingConfig;
    padding?: SpacingConfig;
  };
  orientation: 'horizontal' | 'vertical'; // disposizione dei feed RSS, orizzontale o verticale
  feedRssConnectionData: FeedRssConnectionData | 'getFromFirebase';
  notFoundMessage?: ImageBlockConfig;
  itemConfig: {
    // configurazione delle singole card del feed RSS
    readMore: FeedReadMoreConfig;
    container?: FeedItemStyle; // stile del contenitore delle card del feed RSS
    fields?: {
      // i campi che compongono l'elemento del feed RSS
      layout?: FlexLayoutConfig; // tra titolo e contenuto (card body)
      title?: TextStyle;
      content?: {
        // i campi contenuti sotto il titolo
        layout?: FlexLayoutConfig;
        category?: FeedCategoryConfig;
        date?: TextStyle;
        description?: TextStyle;
      };
    };
  };
}

export interface FeedItemStyle {
  border?: BorderConfig;
  background?: BackgroundConfig;
  padding?: SpacingConfig;
  margin?: SpacingConfig;
}

export interface FeedCategoryConfig extends TextStyle {
  isBadge?: boolean;
  background?: BackgroundConfig;
}

export interface FeedReadMoreConfig extends TextConfig {
  style?: LinkStyle;
  icon?: IconConfig;
}

export interface FeedRssConnectionData {
  baseUrl: string;
  apiKey: string;
  domainName: string;
}
export interface FeedItem {
  // RISPOSTA BE
  title: string;
  link: string;
  description: string;
  pubDate: string;
  category: string;
}
