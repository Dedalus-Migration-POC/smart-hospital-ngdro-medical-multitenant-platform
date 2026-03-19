import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleTranslate } from './google-translate';

describe('GoogleTranslate', () => {
  let component: GoogleTranslate;
  let fixture: ComponentFixture<GoogleTranslate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoogleTranslate],
    }).compileComponents();

    fixture = TestBed.createComponent(GoogleTranslate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
