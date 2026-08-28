import { FlexLayoutConfig, TextConfig } from 'src/app/shared/models/shared_model';
import { ImageBlockConfig } from '../image-block/model';

export interface FeedRssProps {
  title: TextConfig;
  button: TextConfig;
  feedRssConnectionData: FeedRssConnectionData | 'getFromFirebase';
  notFoundMessage?: ImageBlockConfig;
  layout: 'horizontal' | 'vertical';
  width?: string;
  height?: string;
}

export interface FeedRssConnectionData {
  baseUrl: string;
  apiKey: string;
  domainName: string;
}
export interface FeedItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  category: string;
}
