import {
  ColorConfig,
  FlexLayoutConfig,
  LinkTarget,
  TextConfig,
} from '../../shared/models/shared_model';

export interface ISocials {
  title: TextConfig;
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
    color: ColorConfig;
  }[];
  layout: FlexLayoutConfig;
}
