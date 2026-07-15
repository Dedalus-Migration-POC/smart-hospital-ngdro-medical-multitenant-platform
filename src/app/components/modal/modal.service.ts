import { Injectable, ViewContainerRef } from '@angular/core';

export enum ModalType {
  INFO = 'INFO',
  ERROR = 'ERROR',
}

export type ModalButton = {
  label: string;
  styleClass?: string;
  callback?: () => void;
};

export type ModalOptions = {
  type?: ModalType;
  title?: string;
  body?: string;
  styleClass?: string;
  centered?: boolean;
  buttons?: ModalButton[];
};

@Injectable({ providedIn: 'root' })
export class ModalService {
  open(_viewContainerRef: ViewContainerRef, options: ModalOptions): void {
    const title = options.title ?? '';
    const body = options.body ?? '';
    const message = title ? `${title}\n\n${body}` : body;

    if (!options.buttons || options.buttons.length === 0) {
      window.alert(message);
      return;
    }

    if (options.buttons.length === 1) {
      window.alert(message);
      options.buttons[0].callback?.();
      return;
    }

    const confirmed = window.confirm(message);
    const button = confirmed ? options.buttons[1] : options.buttons[0];
    button?.callback?.();
  }
}
