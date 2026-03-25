import {
  Colors,
  FontSize,
  FontWeight,
  LineHeight,
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
    marginTop?: string; //da 1 a 5
    marginBottom?: string;
    marginRight?: string;
    marginLeft?: string;
    lineHeight?: LineHeight;
  };
}
