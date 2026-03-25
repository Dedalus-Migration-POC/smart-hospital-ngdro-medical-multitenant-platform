import { Lang } from '../../initialize/state/services/language.service';
import { Colors } from '../../shared/models/shared_model';

export interface SelectLanguageProps {
  supportedLanguages: Lang[];
  arialabel: string;
  color: Colors;
}
