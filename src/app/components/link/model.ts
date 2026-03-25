import {
  Colors,
  FontSize,
  FontWeight,
  LinkTarget,
  TextDecoration,
} from '../../shared/models/shared_model';

export interface ILink {
  text: {
    it: string;
    en: string;
  };
  description?: {
    it: string;
    en: string;
  };
  url: string;
  external: boolean;
  target?: LinkTarget;
  //Se c è già testo visibile ariaLabel non serve perche sovrascrive quel testo per screen reader
  ariaLabel?: {
    it: string;
  };
  disabled: boolean;
  style: {
    color: Colors;
    textDecoration: TextDecoration;
    font: FontSize;
    fontWeight: FontWeight;
  };
}
