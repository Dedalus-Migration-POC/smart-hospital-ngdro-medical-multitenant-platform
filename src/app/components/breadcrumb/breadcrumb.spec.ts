import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Breadcrumb } from './breadcrumb';
import { BreadcrumbService } from './breadcrumb.service';

describe('Breadcrumb', () => {
  let component: Breadcrumb;
  let fixture: ComponentFixture<Breadcrumb>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Breadcrumb],
    }).compileComponents();

    fixture = TestBed.createComponent(Breadcrumb);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps translation keys and exposes interpolation params', () => {
    const service = TestBed.inject(BreadcrumbService);
    const result = service.interpolateConfig(
      {
        title: { text: 'booking.title' },
        items: [{ name: 'booking.details', queryParams: { id: '{{id}}' } }],
      },
      { id: '123' },
    );

    expect(result?.title.text).toBe('booking.title');
    expect(result?.items[0].name).toBe('booking.details');
    expect(result?.interpolationParams).toEqual({ id: '123' });
    expect(result?.items[0].queryParams?.['id']).toBe('123');
  });
});
