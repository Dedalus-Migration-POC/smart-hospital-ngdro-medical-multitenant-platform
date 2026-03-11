import { TestBed } from '@angular/core/testing';
import { AppAdmin } from './admin';

describe('AppAdmin', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppAdmin],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppAdmin);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(AppAdmin);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, medical-multitenant-platform');
  });
});
