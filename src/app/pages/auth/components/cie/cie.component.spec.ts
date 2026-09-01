import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CieComponent } from './cie.component';

describe('CieComponent', () => {
  let component: CieComponent;
  let fixture: ComponentFixture<CieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CieComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
