import {
  Colors,
  FontSize,
  FontWeight,
  LineHeight,
  Margin,
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
    marginTop?: Margin;
    marginBottom?: Margin;
    marginRight?: Margin;
    marginLeft?: Margin;
    lineHeight?: LineHeight;
  };
}
