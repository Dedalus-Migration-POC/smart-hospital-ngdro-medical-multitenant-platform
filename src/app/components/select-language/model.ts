import { Lang } from '../../initialize/state/services/language.service';

export interface SelectLanguageProps {
  supportedLanguages: Lang[];
  arialabel: string;
  color:
    | 'white'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark'
    | 'black';
}
