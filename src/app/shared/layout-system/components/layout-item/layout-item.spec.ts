import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutItem } from './layout-item';

describe('LayoutItem', () => {
  let component: LayoutItem;
  let fixture: ComponentFixture<LayoutItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutItem],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
