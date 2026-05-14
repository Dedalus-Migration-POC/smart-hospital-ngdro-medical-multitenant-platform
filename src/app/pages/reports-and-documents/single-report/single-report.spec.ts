import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleReport } from './single-report';

describe('SingleReport', () => {
  let component: SingleReport;
  let fixture: ComponentFixture<SingleReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleReport],
    }).compileComponents();

    fixture = TestBed.createComponent(SingleReport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
