import {
  FlexLayoutConfig,
  IconConfig,
  ImageConfig,
  LinkTarget,
  LocalizedText,
  SpacingConfig,
  TextConfig,
  TextStyle,
} from '../../shared/models/shared_model';

export interface SocialItem {
  id: string;
  label: LocalizedText;
  ariaLabel: LocalizedText;
  icon?: IconConfig;
  image?: ImageConfig;
  url: string;
  target?: LinkTarget;
  margin?: SpacingConfig;
}

// Se showLabel è true, mostra l'etichetta accanto all'icona social.
// labelStyle definisce lo stile comune a tutte le etichette.
// layout definisce la disposizione del contenitore Socials. (titolo e icone social con visualizzazione o meno della label)
// TODO: in futuro considerare la possibilità di aggiungere ulteriori configurazioni per il layout delle icone social (icone e label)
export interface SocialsConfig {
  title: TextConfig;
  showLabel: boolean;
  labelStyle?: TextStyle;
  socials: SocialItem[];
  layout: FlexLayoutConfig;
}
