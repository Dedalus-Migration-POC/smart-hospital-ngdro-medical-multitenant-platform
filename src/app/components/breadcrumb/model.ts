import { LocalizedText } from '../../shared/models/shared_model';

export interface BreadcrumbConfig {
  title: LocalizedText;
  subtitle?: LocalizedText;
  backgroundColor?: string;
  items: BreadcrumbItem[];
  button?: LocalizedText;
  buttonIcon?: string;
}

export interface BreadcrumbItem {
  name?: LocalizedText;
  routerLink?: string;
  queryParams?: { [key: string]: string };
}
