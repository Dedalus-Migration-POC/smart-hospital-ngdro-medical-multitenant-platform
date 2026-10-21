import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ItNotificationService } from 'design-angular-kit';
import { vi } from 'vitest';

import { MediaText } from './media-text';
import { CardItemsLayout, MediaTextCard } from '../../model';
import { LanguageService } from '../../../../initialize/state/services/language.service';
import { selectAppConfig } from '../../../../initialize/state/selector';

vi.mock('design-angular-kit', async () => {
  const { NgModule } = await import('@angular/core');
  class DesignAngularKitModuleStub {}
  NgModule({})(DesignAngularKitModuleStub);
  return {
    DesignAngularKitModule: DesignAngularKitModuleStub,
    ItNotificationService: class {},
    NotificationPosition: { Top: 'top' },
  };
});

describe('MediaText', () => {
  let component: MediaText;
  let fixture: ComponentFixture<MediaText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaText, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        provideMockStore({ selectors: [{ selector: selectAppConfig, value: null }] }),
        { provide: LanguageService, useValue: { lang: signal('it') } },
        { provide: ItNotificationService, useValue: { info: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MediaText);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('card', {
      id: 'callback-card',
      type: 'mediaText',
      text: { title: { text: 'Card' } },
      image: { type: 'url', value: 'assets/images/lock.png', decorative: true },
      action: { type: 'callback' },
    } satisfies MediaTextCard);
    fixture.componentRef.setInput('itemsLayout', { direction: 'row' });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should preserve the original layout when media width is not configured', () => {
    const media =
      fixture.nativeElement.querySelector('app-image-block').parentElement.parentElement;
    expect(media.classList.contains('w-100')).toBe(true);
    expect(media.classList.contains('flex-shrink-0')).toBe(false);
    expect(media.firstElementChild.classList.contains('flex-grow-1')).toBe(true);
    expect(media.style.width).toBe('');
    expect(fixture.nativeElement.querySelector('.card-text').classList.contains('w-100')).toBe(
      true,
    );
  });

  it('should preserve full-width media and icon placement for home column cards', () => {
    fixture.componentRef.setInput('itemsLayout', { direction: 'column', align: 'stretch' });
    fixture.componentRef.setInput('card', {
      ...component.card(),
      blocked: true,
    } satisfies MediaTextCard);
    fixture.detectChanges();

    const media =
      fixture.nativeElement.querySelector('app-image-block').parentElement.parentElement;
    expect(media.classList.contains('w-100')).toBe(true);
    expect(media.firstElementChild.classList.contains('flex-grow-1')).toBe(true);
    expect(
      media.querySelector('img[aria-hidden="true"][src="assets/images/lock.png"]'),
    ).not.toBeNull();
    expect(
      fixture.nativeElement
        .querySelector('.card-text')
        .classList.contains('media-text-row-content'),
    ).toBe(false);
  });

  for (const width of ['auto', '80px', '40%']) {
    it(`should apply configured image container width ${width}`, () => {
      fixture.componentRef.setInput('itemsLayout', {
        direction: 'row',
        imageContainerWidth: width,
      } satisfies CardItemsLayout);
      fixture.detectChanges();

      const media =
        fixture.nativeElement.querySelector('app-image-block').parentElement.parentElement;
      expect(media.style.width).toBe(width);
      expect(media.classList.contains('w-100')).toBe(false);
      expect(media.classList.contains('flex-shrink-0')).toBe(true);
      expect(
        fixture.nativeElement
          .querySelector('.card-text')
          .classList.contains('media-text-row-content'),
      ).toBe(true);
    });
  }

  it('should keep column text full-width with a configured media width', () => {
    fixture.componentRef.setInput('itemsLayout', {
      direction: 'column',
      align: 'stretch',
      imageContainerWidth: 'auto',
    } satisfies CardItemsLayout);
    fixture.detectChanges();

    const media =
      fixture.nativeElement.querySelector('app-image-block').parentElement.parentElement;
    expect(media.classList.contains('w-100')).toBe(false);
    expect(media.style.width).toBe('auto');
    const text = fixture.nativeElement.querySelector('.card-text');
    expect(text.classList.contains('w-100')).toBe(true);
    expect(text.classList.contains('media-text-row-content')).toBe(false);
  });

  it('should invoke the callback once when the card is clicked', () => {
    const callback = vi.fn();
    fixture.componentRef.setInput('card', {
      ...component.card(),
      action: { type: 'callback', callback },
    } satisfies MediaTextCard);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should allow a callback action without a handler', () => {
    expect(() => component.onCardClick(new Event('click'), { type: 'callback' })).not.toThrow();
  });
});
