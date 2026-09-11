import { Component, inject, input, signal, Signal } from '@angular/core';
import { LanguageService } from '../../initialize/state/services/language.service';
import { CommonModule } from '@angular/common';
import {
  CaretConfig,
  DropdownMenuAction,
  DropdownMenuItem,
  UserDropdownButtonStyle,
  UserDropdownMenuProps,
} from './model';
import { Router } from '@angular/router';
import { UserProfile } from '../../pages/user-profile/user-profile.model';
import { SmartHospitalState } from '../../store/reducers';
import { Store } from '@ngrx/store';
import { selectUserProfileData } from '../../pages/user-profile/state/user-profile.selectors';
import { UserProfileService } from '../../pages/user-profile/state/user-profile.service';
import {
  BackgroundConfig,
  BorderConfig,
  ButtonStyle,
  ColorConfig,
} from '../../shared/models/shared_model';
import { getButtonPaletteClasses, getButtonStyles } from '../../shared/utility/button.utils';
import { getTextClasses } from '../../shared/utility/text.utils';
import {
  getBackgroundPaletteClass,
  getSpacingStyles,
  getTextColorHex,
  getTextStyles,
} from '../../shared/utility/style.utils';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-user-dropdown-menu',
  imports: [CommonModule, IconComponent],
  templateUrl: './user-dropdown-menu.html',
  styleUrl: './user-dropdown-menu.scss',
})
export class UserDropdownMenu {
  private store = inject(Store<SmartHospitalState>);

  readonly config = input<UserDropdownMenuProps | null>(null);
  userProfile: Signal<UserProfile | null> = this.store.selectSignal(selectUserProfileData);

  private userProfileService = inject(UserProfileService);
  private langService = inject(LanguageService);
  private router = inject(Router);

  lang = this.langService.lang;
  protected readonly getButtonStyles = getButtonStyles;
  protected readonly getTextClasses = getTextClasses;
  protected readonly getTextStyles = getTextStyles;

  // Stato aperto/chiuso del dropdown, aggiornato dagli eventi nativi di Bootstrap.
  isOpen = signal(false);

  // Azioni invocabili dalle voci del menu tramite DropdownMenuItem.nameFunction.
  private readonly actions: Record<DropdownMenuAction, () => void> = {
    gotoUserProfile: () => this.router.navigate(['/user-profile']),
    logout: () => {
      this.userProfileService.logout().subscribe(() => {
        this.router.navigate(['/']);
      });
    },
  };

  focusNext(id: string) {
    document.getElementById(id)?.click();
  }

  onDropdownToggle(isOpen: boolean) {
    this.isOpen.set(isOpen);
  }

  runAction(nameFunction: DropdownMenuAction) {
    this.actions[nameFunction]();
  }

  // Da disconnesso il bottone naviga al login; da loggato il click e' gestito dal toggle del dropdown.
  onButtonClick() {
    if (!this.userProfile()) {
      this.router.navigate(['/login']);
    }
  }

  itemStyles(item: DropdownMenuItem): Record<string, string> {
    return getSpacingStyles(item.padding, 'padding');
  }

  // Toggle/login: se la palette non è impostata resta neutro.
  toggleButtonClasses(config: ButtonStyle): string[] {
    const palette = 'palette' in config ? config.palette : undefined;
    return palette ? getButtonPaletteClasses(config) : ['btn-dropdown'];
  }

  getHoverTextDecorationClass(config: UserDropdownButtonStyle): string {
    return config.hover?.textDecoration === 'underline' ? 'user-dropdown-hover-underline' : '';
  }

  getHoverTextDecorationStyles(config: UserDropdownButtonStyle): Record<string, string> {
    return config.hover?.textDecorationThickness
      ? { '--user-dropdown-hover-text-decoration-thickness': config.hover.textDecorationThickness }
      : {};
  }

  loggedInUserTextClasses(config: ButtonStyle): string[] {
    return getTextClasses(config.textStyle);
  }

  // Il colore si applica con text-{palette}.
  // Se caret.color non è impostato, eredita il colore dell'icona del bottone.
  caretClasses(caret: CaretConfig, fallbackColor?: ColorConfig): string[] {
    const palette = caret.color?.palette ?? fallbackColor?.palette;
    return [
      'fa-solid',
      this.isOpen() ? 'fa-angle-up' : 'fa-angle-down',
      ...(palette ? [`text-${palette}`] : []),
    ];
  }

  caretStyles(fontSize?: string): Record<string, string> {
    return fontSize ? { 'font-size': fontSize } : {};
  }

  backgroundClass(background: BackgroundConfig): string {
    return getBackgroundPaletteClass({ background });
  }

  borderClass(border: BorderConfig): string {
    return border.color?.palette ? `border-${border.color.palette}` : '';
  }

  borderStyles(border: BorderConfig): Record<string, string> {
    const color = getTextColorHex({ color: border.color });
    return {
      ...(border.width ? { 'border-width': border.width } : {}),
      ...(border.style ? { 'border-style': border.style } : {}),
      ...(border.radius ? { 'border-radius': border.radius } : {}),
      ...(color ? { 'border-color': color } : {}),
    };
  }

  backgroundStyles(dropdownMenu: UserDropdownMenuProps['dropdownMenu']): Record<string, string> {
    const value =
      dropdownMenu.background.gradient ?? getTextColorHex({ color: dropdownMenu.background.fill });
    return {
      ...(value ? { background: value } : {}),
      ...getSpacingStyles(dropdownMenu.padding, 'padding'),
    };
  }
}
