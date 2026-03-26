import {
  Align,
  Colors,
  Direction,
  FontSize,
  FontWeight,
  LinkTarget,
  LocalizedText,
} from '../../shared/models/shared_model';

export type ImageType = 'url' | 'inlineSvg' | 'file';
export type ActionType = 'route' | 'externalLink';

export interface ImageBlockConfig {
  id: string;
  className?: string;
  layout?: {
    // layout container (for image and text)
    direction: Direction;
    gap: string;
    align: Align;
  };
  action?: {
    // for container (image + test)
    type: ActionType;
    url: string;
    target?: LinkTarget;
  };
  clickable?: boolean; // for container (image + test)
  image: {
    type: ImageType;
    value: string;
    decorative: boolean;
    alt?: LocalizedText;
    ariaLabel?: LocalizedText;
    width?: string;
    height?: string;
    className?: string;
    tooltip?: boolean;
    tooltipLabel?: LocalizedText;
    tooltipClassName?: string;
  };
  text?: {
    // the layout consists of a title and a description bottom
    title: {
      text: LocalizedText;
      fontSize?: FontSize;
      fontWeight?: FontWeight;
      color?: Colors;
    };
    description?: {
      text: LocalizedText;
      fontSize?: FontSize;
      fontWeight?: FontWeight;
      color?: string;
    };
  };
}
