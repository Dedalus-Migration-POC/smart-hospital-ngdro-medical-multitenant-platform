import { AreasConfig } from '../../shared/layout-system/models/layout.model';
import { BackgroundConfig, BorderConfig, SpacingConfig } from '../../shared/models/shared_model';

export interface HeaderSection {
  height?: string;
  position?: {
    type: 'sticky' | 'fixed';
    className?: string;
    stackable?: boolean;
  };
  background: BackgroundConfig;
  border?: BorderConfig;
  padding?: SpacingConfig;
  className?: string;
  areas?: AreasConfig;
}

export interface HeaderConfig {
  topbar?: HeaderSection;
  main: HeaderSection;
  bottombar?: HeaderSection;
}
