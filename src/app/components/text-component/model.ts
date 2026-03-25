import {
  Colors,
  FontSize,
  FontWeight,
  LineHeight,
  MarginBottom,
  MarginLeft,
  MarginRight,
  MarginTop,
  TextDecoration,
  TextTransform,
} from '../../shared/models/shared_model';

export interface TextProps {
  id: string;
  className?: string;
  text: {
    it: string;
    en: string;
  };
  fontSize?: FontSize;
  fontWeight?: FontWeight;
  textDecoration?: TextDecoration;
  textTransform?: TextTransform;
  color: Colors;
  layout?: {
    marginTop?: MarginTop;
    marginBottom?: MarginBottom;
    marginRight?: MarginLeft;
    marginLeft?: MarginRight;
    lineHeight?: LineHeight;
  };
}
