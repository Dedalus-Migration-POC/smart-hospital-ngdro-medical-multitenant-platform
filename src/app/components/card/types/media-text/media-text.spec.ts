import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaText } from './media-text';

describe('MediaText', () => {
  let component: MediaText;
  let fixture: ComponentFixture<MediaText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaText],
    }).compileComponents();

    fixture = TestBed.createComponent(MediaText);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
