import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService, provideTranslateService } from '@ngx-translate/core';
import { CountdownTimerComponent } from './countdown-timer.component';

vi.mock('design-angular-kit', () => {
  class DesignAngularKitModuleStub {}
  class ItProgressBarComponentStub {}
  return {
    DesignAngularKitModule: DesignAngularKitModuleStub,
    ItProgressBarComponent: ItProgressBarComponentStub,
  };
});

describe('CountdownTimerComponent', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      imports: [CountdownTimerComponent],
      providers: [provideTranslateService({ lang: 'it' })],
    });
    TestBed.overrideComponent(CountdownTimerComponent, {
      set: { imports: [CommonModule, TranslateModule], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
    });
    TestBed.inject(TranslateService).setTranslation('it', {
      countdown: { expired: 'Tempo scaduto' },
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    vi.useRealTimers();
  });

  function createCountdown(seconds: number) {
    const fixture = TestBed.createComponent(CountdownTimerComponent);
    const onExpiration = vi.fn();
    fixture.componentInstance.onExpiration.subscribe(onExpiration);
    fixture.componentRef.setInput('expireOn', Date.now() / 1000 + seconds);
    fixture.detectChanges();
    return { fixture, onExpiration, element: fixture.nativeElement as HTMLElement };
  }

  it('should display the label only after expiration and emit the existing event once', async () => {
    const { fixture, element, onExpiration } = createCountdown(2);
    await vi.advanceTimersByTimeAsync(0);
    fixture.detectChanges();
    expect(element.textContent).not.toContain('Tempo scaduto');
    expect(element.querySelector('it-progress-bar')).not.toBeNull();
    await vi.advanceTimersByTimeAsync(2000);
    fixture.detectChanges();
    expect(element.querySelector('[role="status"]')?.textContent).toBe('Tempo scaduto');
    expect(element.querySelector('it-progress-bar')).toBeNull();
    expect(onExpiration).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(3000);
    expect(onExpiration).toHaveBeenCalledTimes(1);
  });

  it('should display the expired label for a deadline already in the past', async () => {
    const { fixture, element, onExpiration } = createCountdown(-1);
    await vi.advanceTimersByTimeAsync(0);
    fixture.detectChanges();
    expect(element.textContent).toContain('Tempo scaduto');
    expect(onExpiration).toHaveBeenCalledTimes(1);
  });

  it('should clear the label when a new deadline starts', async () => {
    const { fixture, element } = createCountdown(1);
    await vi.advanceTimersByTimeAsync(1000);
    fixture.detectChanges();
    expect(element.textContent).toContain('Tempo scaduto');
    fixture.componentRef.setInput('expireOn', Date.now() / 1000 + 10);
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(0);
    fixture.detectChanges();
    expect(element.textContent).not.toContain('Tempo scaduto');
    expect(element.querySelector('it-progress-bar')).not.toBeNull();
  });

  it('should stop the timer when destroyed', async () => {
    const { fixture, onExpiration } = createCountdown(5);
    await vi.advanceTimersByTimeAsync(0);
    fixture.destroy();
    await vi.advanceTimersByTimeAsync(5000);
    expect(onExpiration).not.toHaveBeenCalled();
  });
});
