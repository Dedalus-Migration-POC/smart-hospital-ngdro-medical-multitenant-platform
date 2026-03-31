import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Spid } from './spid';

describe('Spid', () => {
  let component: Spid;
  let fixture: ComponentFixture<Spid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Spid],
    }).compileComponents();

    fixture = TestBed.createComponent(Spid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
