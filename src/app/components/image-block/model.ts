import {
  FlexLayoutConfig,
  LinkTarget,
  ActionType,
  TextSection,
  ImageConfig,
} from '../../shared/models/shared_model';

export interface ImageBlockConfig {
  id: string;
  className?: string;
  layout?: FlexLayoutConfig; // layout container (for image and text)
  action?: {
    // for container (image + test)
    type: ActionType;
    url: string;
    target?: LinkTarget;
  };
  clickable?: boolean; // for container (image + test)
  image: ImageConfig;
  // the layout consists of a title and a description bottom
  text?: TextSection;
}
