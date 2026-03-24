export interface TextProps {
  id: string;
  className?: string;
  text: {
    it: string;
    en: string;
  };
  fontSize?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  fontWeight?: 'normal' | 'semibold' | 'bold';
  textDecoration?: 'none' | 'underline' | 'overline';
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize';
  color:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark'
    | 'white'
    | 'black';
  layout?: {
    marginTop?: string; //da 1 a 5
    marginBottom?: string;
    marginRight?: string;
    marginLeft?: string;
    lineHeight?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  };
}
