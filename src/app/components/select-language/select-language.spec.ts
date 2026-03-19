import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectLanguage } from './select-language';

describe('SelectLanguage', () => {
  let component: SelectLanguage;
  let fixture: ComponentFixture<SelectLanguage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectLanguage],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectLanguage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
