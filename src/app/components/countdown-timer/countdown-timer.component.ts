import { Component, computed, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';
import { Subscription, takeWhile, timer } from 'rxjs';

interface TimerData {
  timeRemaining: number;
  time: number;
}

@Component({
  selector: 'app-countdown-timer',
  standalone: true,
  imports: [CommonModule, DesignAngularKitModule, TranslateModule],
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.scss'],
})
export class CountdownTimerComponent {
  // Input signal
  expireOn = input<number | null>(null);

  // Output signal
  onExpiration = output<void>();
  readonly expired = signal(false);

  // Internal signals
  private timeRemaining = signal<number>(0);
  private totalTime = signal<number>(0);

  // Computed timer object
  timer = computed<TimerData | null>(() => {
    const remaining = this.timeRemaining();
    const total = this.totalTime();

    if (remaining < 0) return null;

    return { timeRemaining: remaining, time: total };
  });

  constructor() {
    effect((onCleanup) => {
      const expireOnValue = this.expireOn();
      if (expireOnValue) {
        const subscription = this.startTimer(expireOnValue);
        onCleanup(() => subscription.unsubscribe());
      }
    });
  }

  private startTimer(expireOn: number): Subscription {
    const time = expireOn * 1000 - Date.now();
    this.expired.set(time <= 1);
    this.timeRemaining.set(time);
    this.totalTime.set(time);

    return timer(0, 1000)
      .pipe(
        takeWhile((n) => {
          const remaining = time - n * 1000;
          this.timeRemaining.set(remaining);

          if (remaining <= 1) {
            this.expired.set(true);
            this.onExpiration.emit();
            return false;
          }

          return remaining >= 0;
        }),
      )
      .subscribe();
  }
}
