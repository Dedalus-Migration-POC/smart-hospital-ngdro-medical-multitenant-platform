import {
  Align,
  Colors,
  Direction,
  FontSize,
  FontWeight,
  Gap,
  FlexLayoutConfig,
  LinkTarget,
  TextTransform,
} from '../../shared/models/shared_model';

export interface ISocials {
  title: {
    text: {
      it: string;
      en: string;
    };
    fontSize: FontSize;
    fontWeight?: FontWeight;
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
  layout: FlexLayoutConfig;
}
