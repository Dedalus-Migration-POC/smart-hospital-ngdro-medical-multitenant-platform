import { Component, inject, input, signal } from '@angular/core';
import { LanguageService } from '../../initialize/state/services/language.service';
import { CommonModule } from '@angular/common';
import { UserDropdownMenuProps } from './model';
import { MOCK_PROFILE, UserDropdownMenuProps_MOCK } from './mock';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-dropdown-menu',
  imports: [CommonModule, RouterModule],
  templateUrl: './user-dropdown-menu.html',
  styleUrl: './user-dropdown-menu.scss',
})
export class UserDropdownMenu {
  readonly config = input<UserDropdownMenuProps | null>(null);
  // readonly configMock = signal<UserDropdownMenuProps>(UserDropdownMenuProps_MOCK);
  userProfile: any = { data: MOCK_PROFILE };

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
