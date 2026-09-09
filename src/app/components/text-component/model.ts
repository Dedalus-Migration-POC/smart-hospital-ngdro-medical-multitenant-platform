import { TextConfig, TextHeader } from '../../shared/models/shared_model';

export interface TextProps extends TextConfig {
  id: string;
  headingTag?: TextHeader;
}
