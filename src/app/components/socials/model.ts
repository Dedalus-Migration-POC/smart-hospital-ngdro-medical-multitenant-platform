import {
  Align,
  Colors,
  Direction,
  FontSize,
  Gap,
  LinkTarget,
  Placement,
  TextTransform,
} from '../../shared/models/shared_model';

export interface ISocials {
  title: {
    text: {
      it: string;
      en: string;
    };
    fontSize: FontSize;
    bold: boolean;
    color: Colors;
    textTransform?: TextTransform;
  };
  socials: {
    id: string;
    showLabel: boolean;
    label: {
      it: string;
      en: string;
    };
    ariaLabel: {
      it: string;
      en: string;
    };

    icon: {
      type: 'svg' | 'img' | 'font';
      value: string;
    };
    url: string;
    target: LinkTarget;
    disabled: boolean;
    color: Colors;
  }[];
  layout: {
    direction: Direction;
    placement: Placement;
    gap: Gap;
    align: Align;
  };
}
