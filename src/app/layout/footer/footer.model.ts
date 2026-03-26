import { AreaLayout, LayoutArea } from '../../shared/layout-system/models/layout.model';
import { Colors } from '../../shared/models/shared_model';

export interface FooterSection {
  height: string;
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

export interface FooterConfig {
  main: FooterSection;
  bottombar?: FooterSection;
}
