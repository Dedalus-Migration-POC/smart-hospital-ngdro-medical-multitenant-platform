import { Directive, OnDestroy, afterNextRender, input, signal } from '@angular/core';

/*
 This directive checks if the content exceeds the specified height. 
 If exceeds adds the "is-overflowing" class because the container switch from a fixed height to an auto height.
 */
type OverflowHeight = string | null | undefined;

@Directive({
  selector: '[appOverflowDetector]',
  standalone: true,
  host: {
    '[class.is-overflowing]': 'isOverflowing()',
  },
})
export class OverflowDetectorDirective implements OnDestroy {
  // Element to check to see if the content overflows
  readonly appOverflowDetector = input.required<HTMLElement>();

  // Height of the element; if omitted, the directive is not activated
  readonly appOverflowDetectorHeight = input<OverflowHeight>(null);

  // State to add/remove the class on the host
  readonly isOverflowing = signal(false);

  // Monitoring size of the content
  private resizeObserver?: ResizeObserver;

  // Monitoring changes to the DOM structure or the content text
  private mutationObserver?: MutationObserver;

  constructor() {
    afterNextRender(() => {
      this.connectObservers();
      this.updateOverflow();
    });
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.mutationObserver?.disconnect();
  }

  private connectObservers(): void {
    const configuredHeight = this.getConfiguredHeight();

    if (configuredHeight === null) {
      return;
    }

    const target = this.appOverflowDetector();

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.updateOverflow());
      this.resizeObserver.observe(target);
    }

    if (typeof MutationObserver !== 'undefined') {
      this.mutationObserver = new MutationObserver(() => this.updateOverflow());
      this.mutationObserver.observe(target, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
  }

  private getConfiguredHeight(): number | null {
    const value = this.appOverflowDetectorHeight();

    if (!value) {
      return null;
    }

    const parsed = parseFloat(value);
    return Number.isNaN(parsed) ? null : parsed;
  }

  private updateOverflow(): void {
    const target = this.appOverflowDetector();
    const configuredHeight = this.getConfiguredHeight();

    if (configuredHeight === null) {
      this.isOverflowing.set(false);
      return;
    }

    this.isOverflowing.set(target.scrollHeight > configuredHeight);
  }
}
