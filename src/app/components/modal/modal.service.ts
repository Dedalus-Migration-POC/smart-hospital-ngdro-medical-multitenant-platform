import { Injectable, ComponentRef, ViewContainerRef } from '@angular/core'
import { ModalComponent } from './modal.component'
import { IconName } from 'design-angular-kit'

export enum ModalType {
  SUCCESS = 'SUCCESS',
  ERROR = 'DANGER',
  INFO = 'INFO',
  WARNING = 'WARNING',
}

export interface ModalButton {
  label: string
  styleClass?: string
  callback: () => void
}

export interface Modal {
  title: string
  body: string
  styleClass?: string
  icon?: IconName
  iconClass?: string
  type: ModalType
  centered: boolean
  buttons?: ModalButton[]
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalRef: ComponentRef<ModalComponent> | null = null
  private viewContainerRef: ViewContainerRef | null = null

  open(viewContainerRef: ViewContainerRef, modalData: Modal) {
    this.viewContainerRef = viewContainerRef
    if (this.modalRef) {
      this.close()
    }

    const componentRef = this.viewContainerRef.createComponent(ModalComponent)
    componentRef.instance.modal = modalData
    this.modalRef = componentRef
  }

  close() {
    if (this.modalRef && this.viewContainerRef) {
      this.viewContainerRef.clear()
      this.modalRef = null
    }
  }
}
