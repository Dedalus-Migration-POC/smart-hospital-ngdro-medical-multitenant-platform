import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { CardsContainer } from 'src/app/components/card/model';
import { PageConfigService } from 'src/app/pages/page-config.service';
import { PageConfig } from 'src/app/pages/page.model';
import { setActiveStep, setSummaryBooking } from '../../../state/actions';
import { BookingStepId, BookingType } from '../../../state/model';
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

describe('BookingTypeComponent configured cards', () => {
  const flows: { id: BookingType; step: BookingStepId }[] = [
    { id: 'nre', step: BookingStepId.PrescriptionUpload },
    { id: 'free_prof', step: BookingStepId.SelectMedicalService },
    { id: 'nre_delegate', step: BookingStepId.Delega },
    { id: 'free_prof_delegate', step: BookingStepId.Delega },
  ];
  const configuredCards: CardsContainer = {
    id: 'booking-type-cards',
    itemsLayout: { direction: 'row', imageContainerWidth: 'auto' },
    items: flows.map(({ id }) => ({
      id,
      type: 'mediaText',
      text: { title: { text: `configured.${id}` } },
      image: { type: 'url', value: `${id}.svg`, decorative: true },
      action: { type: 'callback' },
    })),
  };

  function createComponent(enabled = true) {
    const config: PageConfig = {
      name: 'booking-new',
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
    return TestBed.createComponent(BookingTypeComponent).componentInstance;
  }

  it('should read the card order and shared layout from page config without mutating it', () => {
    const component = createComponent();
    const cards = component['cards']();

    expect(TestBed.inject(PageConfigService).get).toHaveBeenCalledWith('/bookings-hero/new');
    expect(cards?.items.map((card) => card.id)).toEqual(flows.map(({ id }) => id));
    expect(cards?.itemsLayout).toEqual(configuredCards.itemsLayout);
    expect(cards?.items[0]).toEqual(
      expect.objectContaining({
        text: { title: { text: 'configured.nre' } },
      }),
    );
    for (const card of configuredCards.items) {
      if (card.type === 'mediaText') expect(card.action.callback).toBeUndefined();
    }
  });

  for (const { id, step } of flows) {
    it(`should select ${id} and advance to ${step} through its callback`, () => {
      const component = createComponent();
      const dispatch = vi.spyOn(TestBed.inject(MockStore), 'dispatch');
      const card = component['cards']()?.items.find((item) => item.id === id);
      expect(card?.type).toBe('mediaText');

      if (card?.type === 'mediaText') card.action.callback?.();

      expect(dispatch.mock.calls).toEqual([
        [setSummaryBooking({ payload: { bookingType: id } })],
        [setActiveStep({ step })],
      ]);
    });
  }

  it('should hide a disabled service cards item', () => {
    expect(createComponent(false)['cards']()).toBeNull();
  });

  it('should ignore unknown booking types', () => {
    const component = createComponent();
    const dispatch = vi.spyOn(TestBed.inject(MockStore), 'dispatch');
    component.onCardSelected({ id: 'unknown' });
    expect(dispatch).not.toHaveBeenCalled();
  });
});
