import { AreaLayout, LayoutArea } from '../../shared/layout-system/models/layout.model';
import { Colors } from '../../shared/models/shared_model';

export interface HeaderSection {
  height?: string;
  position?: {
    type: 'sticky' | 'fixed';
    className?: string;
    stackable?: boolean;
  };
  background: Colors;
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
