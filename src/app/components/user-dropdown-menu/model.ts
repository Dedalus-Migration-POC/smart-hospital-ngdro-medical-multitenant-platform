import {
  BackgroundConfig,
  BorderConfig,
  BootstrapButtonStyle,
  ButtonConfig,
  ColorConfig,
  IconConfig,
  SpacingConfig,
  TextConfig,
  TextDecoration,
} from '../../shared/models/shared_model';

// nome del metodo del componente da invocare al click, vincolato alle azioni disponibili.
export type DropdownMenuAction = 'gotoUserProfile' | 'logout';

// le voci di menu
export interface DropdownMenuItem {
  id: string;
  icon?: IconConfig;
  text: TextConfig;
  padding?: SpacingConfig;
  nameFunction: DropdownMenuAction;
}

// icona freccia del toggle dropdown
export interface CaretConfig {
  show: boolean;
  color?: ColorConfig;
}

type UserDropdownHover = {
  hover?: {
    textDecoration?: TextDecoration;
    textDecorationThickness?: string;
  };
};

export type UserDropdownButtonStyle =
  | (BootstrapButtonStyle & UserDropdownHover)
  | (ButtonConfig & UserDropdownHover);

/*
TODO: 
 - in futuro si può aggiungere layoutItem per avere anche la disposizione a row degli itemsù
 - possibilià di aggiungere la posizione del dropdown (vedi bootstrap italia)
*/
export interface UserDropdownMenuProps {
  id: string;
  button: {
    // loggedInUser: Toggle del dropdown quando l'utente è loggato: icona + nome utente (nome non configurabile).
    // se non viene messa la paletta per il bottone e il colore per icona prende usa solo .btn-dropdown di bootstrap (come un link)
    loggedInUser: BootstrapButtonStyle & UserDropdownHover;
    login: ButtonConfig & UserDropdownHover;
  };
  caret?: CaretConfig;
  // contenitore del menu a tendina
  dropdownMenu: {
    padding: SpacingConfig;
    background: BackgroundConfig;
    border: BorderConfig;
    items: DropdownMenuItem[];
  };
}
