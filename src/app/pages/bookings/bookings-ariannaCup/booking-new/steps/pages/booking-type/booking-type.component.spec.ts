import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { CardsContainer } from 'src/app/components/card/model';
import { PageConfigService } from 'src/app/pages/page-config.service';
import { PageConfig } from 'src/app/pages/page.model';
import { setBookingType } from 'src/app/pages/bookings/bookings-ariannaCup/state/actions';
import { SessionStorageKey, SessionStorageUtils } from 'src/app/utility/session-storage-utils';
import { BookingTypeComponent } from './booking-type.component';

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

describe('BookingTypeComponent configured Arianna cards', () => {
  const configuredCards: CardsContainer = {
    id: 'booking-type-cards',
    itemsLayout: { direction: 'row', imageContainerWidth: 'auto' },
    items: ['2', '1'].map((id) => ({
      id,
      type: 'mediaText',
      text: {
        title: { text: `configured.title.${id}` },
        subTitle: { text: `configured.description.${id}` },
      },
      image: { type: 'url', value: `${id}.svg`, decorative: true },
      action: { type: 'callback' },
    })),
  };

  afterEach(() => vi.restoreAllMocks());

  function createComponent(enabled = true) {
    const config: PageConfig = {
      id: '/bookings/new',
      name: 'booking-new',
      route: '/bookings/new',
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
      imports: [BookingTypeComponent],
      providers: [
        provideMockStore(),
        { provide: PageConfigService, useValue: { get: vi.fn(() => of(config)) } },
      ],
    });
    TestBed.overrideComponent(BookingTypeComponent, { set: { template: '', imports: [] } });
    const fixture = TestBed.createComponent(BookingTypeComponent);
    const advance = vi.fn();
    fixture.componentRef.setInput('setActiveStep', advance);
    fixture.componentRef.setInput('activeStepIndex', 2);
    return { component: fixture.componentInstance, advance };
  }

  it('should preserve configured order, string IDs and shared layout without mutating config', () => {
    const { component } = createComponent();
    const cards = component['cards']();

    expect(TestBed.inject(PageConfigService).get).toHaveBeenCalledWith('/bookings/new');
    expect(cards?.items.map((card) => card.id)).toEqual(['2', '1']);
    expect(cards?.itemsLayout).toEqual(configuredCards.itemsLayout);
    for (const card of configuredCards.items) {
      if (card.type === 'mediaText') expect(card.action.callback).toBeUndefined();
    }
  });

  for (const { id, nextStep } of [
    { id: '1', nextStep: 3 },
    { id: '2', nextStep: 4 },
  ]) {
    it(`should persist and dispatch type ${id} and advance to step ${nextStep}`, () => {
      const { component, advance } = createComponent();
      const dispatch = vi.spyOn(TestBed.inject(MockStore), 'dispatch');
      const persist = vi.spyOn(SessionStorageUtils, 'setItem').mockImplementation(() => {});
      const card = component['cards']()?.items.find((item) => item.id === id);
      const expected = {
        id,
        titleI18n: `configured.title.${id}`,
        descriptionI18n: `configured.description.${id}`,
      };
      expect(card?.type).toBe('mediaText');

      if (card?.type === 'mediaText') card.action.callback?.();

      expect(persist).toHaveBeenCalledExactlyOnceWith(
        SessionStorageKey.bookingType,
        JSON.stringify(expected),
      );
      expect(dispatch).toHaveBeenCalledExactlyOnceWith(setBookingType({ request: expected }));
      expect(advance).toHaveBeenCalledExactlyOnceWith(nextStep);
    });
  }

  it('should ignore unknown IDs without changing storage, state or step', () => {
    const { component, advance } = createComponent();
    const dispatch = vi.spyOn(TestBed.inject(MockStore), 'dispatch');
    const persist = vi.spyOn(SessionStorageUtils, 'setItem').mockImplementation(() => {});

    component.onCardSelected({ id: 'unknown' });

    expect(persist).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
    expect(advance).not.toHaveBeenCalled();
  });

  it('should hide a disabled service cards item', () => {
    expect(createComponent(false).component['cards']()).toBeNull();
  });
});
