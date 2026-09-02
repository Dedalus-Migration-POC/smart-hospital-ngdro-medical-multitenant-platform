import {
  BackgroundConfig,
  ButtonConfig,
  LocalizedText,
  SpacingConfig,
  TextConfig,
  TextStyle,
} from '../../shared/models/shared_model';

export interface BreadcrumbContainerStyle {
  background?: BackgroundConfig;
  margin?: SpacingConfig;
  padding?: SpacingConfig;
}

export interface BreadcrumbStyle {
  containerStyle?: BreadcrumbContainerStyle;
  itemsContainerStyle?: BreadcrumbContainerStyle;
  itemsStyle?: TextStyle;
  activeItemStyle?: TextStyle;
  titleStyle?: TextStyle;
  subTitleStyle?: TextStyle;
}

export interface BreadcrumbConfig extends BreadcrumbStyle {
  title: TextConfig;
  subTitle?: TextConfig;
  items: BreadcrumbItem[];
  button?: ButtonConfig;
}

export interface BreadcrumbItem {
  name?: LocalizedText;
  routerLink?: string;
  queryParams?: { [key: string]: string };
}
