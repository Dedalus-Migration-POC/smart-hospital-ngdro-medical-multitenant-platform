import { Component, inject, input, Signal, signal } from '@angular/core';
import { LanguageService } from '../../initialize/state/services/language.service';
import { CommonModule } from '@angular/common';
import { UserDropdownMenuProps } from './model';
import { Router, RouterModule } from '@angular/router';
import { UserProfile } from '../../pages/user-profile/user-profile.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { SmartHospitalState } from '../../store/reducers';
import { Store } from '@ngrx/store';
import { selectUserProfileData } from '../../pages/user-profile/state/user-profile.selectors';

@Component({
  selector: 'app-user-dropdown-menu',
  imports: [CommonModule, RouterModule],
  templateUrl: './user-dropdown-menu.html',
  styleUrl: './user-dropdown-menu.scss',
})
export class UserDropdownMenu {
  private store = inject(Store<SmartHospitalState>);

  readonly config = input<UserDropdownMenuProps | null>(null);
  // readonly configMock = signal<UserDropdownMenuProps>(UserDropdownMenuProps_MOCK);
  userProfile: Signal<UserProfile | null> = this.store.selectSignal(selectUserProfileData);

  private langService = inject(LanguageService);
  private router = inject(Router);

  lang = this.langService.lang;

  focusNext(id: string) {
    document.getElementById(id)?.click();
  }

  gotoUserProfile() {
    console.log('/user-profile');
    this.router.navigate(['/user-profile']);
  }

  logout() {
    console.log('/logout');
    // this.userProfileService.logout().subscribe(() => {
    //   this.router.navigate(['/'])
    // })
  }
}
