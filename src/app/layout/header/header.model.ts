import { AreaLayout, Background, LayoutArea } from '../../shared/layout-system/models/layout.model';

export interface HeaderSection {
  height?: string;
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

// TODO poi togli ? da header
export interface HeaderConfig {
  topbar?: HeaderSection;
  main: HeaderSection;
  bottombar?: HeaderSection;
}
