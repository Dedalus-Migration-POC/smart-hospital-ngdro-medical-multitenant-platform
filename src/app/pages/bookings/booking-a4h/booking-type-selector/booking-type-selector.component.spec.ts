import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { CardsContainer } from 'src/app/components/card/model';
import { PageConfigService } from 'src/app/pages/page-config.service';
import { PageConfig } from 'src/app/pages/page.model';
import { BookingUnifiedModalService } from '../booking-unified-modal.service';
import { BookingType } from '../models/booking-type';
import { fetchStrutture } from '../state/struttura/struttura.actions';
import {
  selectAllStrutture,
  selectStruttureError,
  selectStruttureLoading,
} from '../state/struttura/struttura.selectors';
import { BookingTypeSelectorComponent } from './booking-type-selector.component';

vi.mock('design-angular-kit', async () => {
  const { NgModule } = await import('@angular/core');
  class DesignAngularKitModuleStub {}
  NgModule({})(DesignAngularKitModuleStub);
  return {
    DesignAngularKitModule: DesignAngularKitModuleStub,
    ItIconComponent: class {},
    ItModalComponent: class {},
    ItButtonDirective: class {},
    ItSpinnerComponent: class {},
    ItInputDirective: class {},
    ItSelectComponent: class {},
    ItProgressBarComponent: class {},
    ItNotificationService: class {},
    NotificationPosition: { Top: 'top' },
  };
});

describe('BookingTypeSelectorComponent configured cards', () => {
  const configuredCards: CardsContainer = {
    id: 'booking-type-cards',
    itemColBootstrapClasses: 'col-12 col-md-6',
    items: [BookingType.Physicians, BookingType.Ssn].map((bookingType) => ({
      id: bookingType,
      type: 'mediaText',
      text: { title: { text: `configured.${bookingType}` } },
      image: { type: 'url', value: `${bookingType}.svg`, decorative: true },
      action: { type: 'callback' },
    })),
  };

  function createSelector(enabled = true) {
    const pageConfig: PageConfig = {
      name: 'booking-a4h.name',
      sections: [
        {
          id: 'booking-types-section',
          areas: {
            layout: {},
            start: {
              layout: {},
              items: [
                {
                  id: 'booking-type-cards',
                  type: 'SERVICE_CARDS',
                  enabled,
                  props: configuredCards,
                },
              ],
            },
          },
        },
      ],
    };

    TestBed.configureTestingModule({
      imports: [BookingTypeSelectorComponent],
      providers: [
        provideRouter([]),
        provideMockStore({
          selectors: [
            { selector: selectAllStrutture, value: [] },
            { selector: selectStruttureLoading, value: false },
            { selector: selectStruttureError, value: null },
          ],
        }),
        { provide: PageConfigService, useValue: { get: vi.fn(() => of(pageConfig)) } },
        { provide: BookingUnifiedModalService, useValue: { register: vi.fn(), clear: vi.fn() } },
      ],
    });
    TestBed.overrideComponent(BookingTypeSelectorComponent, {
      set: { template: '', imports: [] },
    });
    return TestBed.createComponent(BookingTypeSelectorComponent).componentInstance;
  }

  it('should preserve configured card order, content and layout', () => {
    const component = createSelector();
    const cards = component['cards']();

    expect(cards?.itemColBootstrapClasses).toBe(configuredCards.itemColBootstrapClasses);
    expect(cards?.items.map((card) => card.id)).toEqual([BookingType.Physicians, BookingType.Ssn]);
    expect(cards?.items[0]).toEqual(
      expect.objectContaining({
        text: { title: { text: `configured.${BookingType.Physicians}` } },
      }),
    );
  });

  it('should bind each callback to its booking type without mutating page config', () => {
    const component = createSelector();
    const onCardClick = vi.spyOn(component, 'onCardClick');
    const dispatch = vi.spyOn(TestBed.inject(MockStore), 'dispatch');

    for (const card of component['cards']()?.items ?? []) {
      if (card.type === 'mediaText') card.action.callback?.();
    }

    expect(onCardClick.mock.calls).toEqual([[BookingType.Physicians], [BookingType.Ssn]]);
    expect(dispatch).toHaveBeenCalledWith(fetchStrutture());
    for (const card of configuredCards.items) {
      if (card.type === 'mediaText') expect(card.action.callback).toBeUndefined();
    }
  });

  it('should not render a disabled service cards configuration', () => {
    expect(createSelector(false)['cards']()).toBeNull();
  });
});
