import { Component, inject, input, Signal } from '@angular/core';
import { LanguageService } from '../../initialize/state/services/language.service';
import { CommonModule } from '@angular/common';
import { UserDropdownMenuProps } from './model';
import { Router, RouterModule } from '@angular/router';
import { UserProfile } from '../../pages/user-profile/user-profile.model';
import { SmartHospitalState } from '../../store/reducers';
import { Store } from '@ngrx/store';
import { selectUserProfileData } from '../../pages/user-profile/state/user-profile.selectors';
import { UserProfileService } from '../../pages/user-profile/state/user-profile.service';

@Component({
  selector: 'app-user-dropdown-menu',
  imports: [CommonModule, RouterModule],
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

  focusNext(id: string) {
    document.getElementById(id)?.click();
  }

  gotoUserProfile() {
    this.router.navigate(['/user-profile']);
  }

  logout() {
    this.userProfileService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
