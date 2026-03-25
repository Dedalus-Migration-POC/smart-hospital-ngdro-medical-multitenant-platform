import { LayoutDirection } from '../../shared/layout-system/models/layout.model';
import {
  Align,
  Colors,
  FontSize,
  Gap,
  LinkTarget,
  Placement,
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
    direction: LayoutDirection;
    placement: Placement;
    gap: Gap;
    align: Align;
  };
}
