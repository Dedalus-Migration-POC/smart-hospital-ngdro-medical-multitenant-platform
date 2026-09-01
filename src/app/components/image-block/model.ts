import {
  FlexLayoutConfig,
  LinkTarget,
  ActionType,
  TextSection,
  ImageConfig,
  SpacingConfig,
} from '../../shared/models/shared_model';

// Il titolo e il sottotitolo sono sempre disposti uno sotto l'altro.
// Possibilità di aggiungere spaziatura tra immagine e testo, tra titolo e sottotitolo, tra blocco e altri elementi della pagina.
export interface ImageBlockConfig {
  id: string;
  className?: string;
  margin?: SpacingConfig;
  padding?: SpacingConfig;
  layout?: FlexLayoutConfig; // layout del contenitore per immagine e testo
  action?: {
    // azione del contenitore (immagine e testo)
    type: ActionType;
    url: string;
    target?: LinkTarget;
  };
  clickable?: boolean; // abilita il click sul contenitore (immagine e testo)
  image: ImageConfig;
  // Testo opzionale composto da titolo e sottotitolo.
  text?: TextSection;
}
