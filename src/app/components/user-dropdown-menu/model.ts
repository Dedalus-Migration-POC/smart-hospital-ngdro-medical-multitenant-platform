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

export interface UserDropdownMenuProps {
  id: string;
  userButton: {
    background: Colors;
    color: Colors;
    icon: string;
    textDecoration?: TextDecoration;
    textTransform?: TextTransform;
  };
  dropdownMenu: {
    background: Colors;
    color: Colors;
    profile: {
      enabled: boolean;
      icon: string;
      text: LocalizedText;
    };
    logout: {
      enabled: boolean;
      icon: string;
      text: LocalizedText;
    };
  };
  loginButton: {
    enabled: boolean;
    text: LocalizedText;
    textDecoration?: TextDecoration;
    textTransform?: TextTransform;
    background: Colors;
    color: Colors;
    icon: string;
  };
  className?: string;
}
