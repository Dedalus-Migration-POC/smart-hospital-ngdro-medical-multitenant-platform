import { LayoutDirection } from '../../shared/layout-system/models/layout.model';
import {
  Align,
  Colors,
  FontSize,
  FontWeight,
  LinkTarget,
  Placement,
} from '../../shared/models/shared_model';

export type ImageType = 'url' | 'inlineSvg' | 'file';
export type ActionType = 'route' | 'externalLink';

export interface LocalizedText {
  it: string;
  en: string;
}

export interface ImageBlockConfig {
  id: string;
  type: ImageType;
  value: string;
  decorative: boolean;

  alt?: LocalizedText;
  ariaLabel?: LocalizedText;

  width?: string;
  height?: string;
  className?: string;

  clickable?: boolean;

  action?: {
    type: ActionType;
    url: string;
    target?: LinkTarget;
  };

  tooltip?: boolean;
  tooltipLabel?: LocalizedText;
  tooltipClassName?: string;

  text?: {
    enabled: boolean;
    title: {
      text: LocalizedText;
      fontSize: FontSize;
      fontWeight: FontWeight;
      color: Colors;
    };
    description?: {
      text: LocalizedText;
      fontSize: FontSize;
      fontWeight: FontWeight;
      color: string;
    };
    layout: {
      direction: LayoutDirection;
      placement: Placement;
      gap: string;
      align: Align;
    };
  };
}
