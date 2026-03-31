import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthMethods } from './auth-methods';

describe('AuthMethods', () => {
  let component: AuthMethods;
  let fixture: ComponentFixture<AuthMethods>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthMethods],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthMethods);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
