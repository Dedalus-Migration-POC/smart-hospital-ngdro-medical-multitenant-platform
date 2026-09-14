import { AreasConfig } from '../../shared/layout-system/models/layout.model';
import { BackgroundConfig } from '../../shared/models/shared_model';

export interface FooterSection {
  height: string;
  position?: {
    type: 'sticky' | 'fixed';
    className?: string;
    stackable?: boolean;
  };
  background: BackgroundConfig;
  className?: string;
  areas?: AreasConfig;
}

export interface FooterConfig {
  main: FooterSection;
  bottombar?: FooterSection;
}
