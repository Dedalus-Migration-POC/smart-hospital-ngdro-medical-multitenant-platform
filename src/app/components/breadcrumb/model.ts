import {
  BackgroundConfig,
  LocalizedText,
  SpacingConfig,
  TextStyle,
} from '../../shared/models/shared_model';

export interface BreadcrumbItemsContainerStyle {
  background?: BackgroundConfig;
  margin?: SpacingConfig;
  padding?: SpacingConfig;
}

export interface BreadcrumbStyle {
  itemsContainerStyle?: BreadcrumbItemsContainerStyle;
  itemsStyle?: TextStyle;
  activeItemStyle?: TextStyle;
  titleStyle?: TextStyle;
  subTitleStyle?: TextStyle;
}

export interface BreadcrumbConfig extends BreadcrumbStyle {
  title: LocalizedText;
  subTitle?: LocalizedText;
  items: BreadcrumbItem[];
  button?: LocalizedText;
  buttonIcon?: string;
}

export interface BreadcrumbItem {
  name?: LocalizedText;
  routerLink?: string;
  queryParams?: { [key: string]: string };
}
