import { AreasConfig } from '../../shared/layout-system/models/layout.model';
import { BackgroundConfig, SpacingConfig } from '../../shared/models/shared_model';

export interface HeaderSection {
  height?: string;
  position?: {
    type: 'sticky' | 'fixed';
    className?: string;
    stackable?: boolean;
  };
  background: BackgroundConfig;
  padding?: SpacingConfig;
  className?: string;
  areas?: AreasConfig;
}

export interface HeaderConfig {
  topbar?: HeaderSection;
  main: HeaderSection;
  bottombar?: HeaderSection;
}
