import { LayoutArea } from '../../shared/layout-system/models/layout.model';
import { Colors, FlexLayoutConfig } from '../../shared/models/shared_model';

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
    layout?: FlexLayoutConfig;
    start?: LayoutArea;
    center?: LayoutArea;
    end?: LayoutArea;
  };
}

export interface FooterConfig {
  main: FooterSection;
  bottombar?: FooterSection;
}
