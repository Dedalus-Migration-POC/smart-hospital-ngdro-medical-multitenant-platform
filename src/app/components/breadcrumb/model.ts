import { LocalizedText } from '../../shared/models/shared_model';

export interface BreadcrumbConfig {
  title: LocalizedText;
  subTitle?: LocalizedText;
  backgroundColor?: string;
  color?: string;
  items: BreadcrumbItem[];
  button?: LocalizedText;
  buttonIcon?: string;
}

export interface BreadcrumbItem {
  name?: LocalizedText;
  routerLink?: string;
  queryParams?: { [key: string]: string };
}
