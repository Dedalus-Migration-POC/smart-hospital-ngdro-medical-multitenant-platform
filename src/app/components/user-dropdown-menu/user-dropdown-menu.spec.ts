import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDropdownMenu } from './user-dropdown-menu';

describe('UserDropdownMenu', () => {
  let component: UserDropdownMenu;
  let fixture: ComponentFixture<UserDropdownMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDropdownMenu],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDropdownMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
