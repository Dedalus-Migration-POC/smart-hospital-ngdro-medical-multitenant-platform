import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreasLayout } from './areas-layout';

describe('AreasLayout', () => {
  let component: AreasLayout;
  let fixture: ComponentFixture<AreasLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreasLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(AreasLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
