import { AreaLayout, Background, LayoutArea } from '../../shared/layout-system/models/layout.model';

export interface FooterSection {
  height: string;
  position?: {
    type: 'sticky' | 'fixed';
    className?: string;
    stackable?: boolean;
  };
  background: Background;
  className?: string;
  areas?: {
    layout?: AreaLayout;
    start?: LayoutArea;
    center?: LayoutArea;
    end?: LayoutArea;
  };
}

export interface FooterConfig {
  main: FooterSection;
  bottombar?: FooterSection;
}
