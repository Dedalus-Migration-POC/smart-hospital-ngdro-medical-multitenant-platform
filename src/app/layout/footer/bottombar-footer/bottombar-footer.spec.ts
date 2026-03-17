import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottombarFooter } from './bottombar-footer';

describe('BottombarFooter', () => {
  let component: BottombarFooter;
  let fixture: ComponentFixture<BottombarFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottombarFooter],
    }).compileComponents();

    fixture = TestBed.createComponent(BottombarFooter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
