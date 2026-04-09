import {
  Colors,
  FontSize,
  FontWeight,
  LineHeight,
  LocalizedText,
  Margin,
  TextDecoration,
  TextHeader,
  TextTransform,
} from '../../shared/models/shared_model';

export interface TextProps {
  id: string;
  text: LocalizedText;
  isHeader?: TextHeader;
  className?: string;
  fontSize?: FontSize;
  fontWeight?: FontWeight;
  textDecoration?: TextDecoration;
  textTransform?: TextTransform;
  color?: Colors;
  marginTop?: Margin;
  marginBottom?: Margin;
  marginRight?: Margin;
  marginLeft?: Margin;
  lineHeight?: LineHeight;
}
