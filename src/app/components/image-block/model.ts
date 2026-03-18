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
    target?: '_self' | '_blank' | '_parent' | '_top';
  };

  tooltip?: boolean;
  tooltipLabel?: LocalizedText;
  tooltipClassName?: string;

  text?: {
    enabled: boolean;
    title: {
      text: LocalizedText;
      fontSize: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
      fontWeight: 'normal' | 'semibold' | 'bold';
      color: string;
    };
    description?: {
      text: LocalizedText;
      fontSize: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
      fontWeight: 'normal' | 'semibold' | 'bold';
      color: string;
    };
    layout: {
      direction: 'row' | 'column';
      placement: 'start' | 'end';
      gap: string;
      align: 'start' | 'center' | 'end';
    };
  };
}
