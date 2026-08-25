import { Component, Input } from '@angular/core';
import { ModalService, ModalType, Modal, ModalButton } from './modal.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DesignAngularKitModule } from 'design-angular-kit';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, TranslateModule, DesignAngularKitModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() modal!: Modal;

  Type = ModalType;

  constructor(private modalService: ModalService) {}

  onClose(): void {
    this.modalService.close();
  }

  onButtonClick(button: ModalButton): void {
    if (button.callback) {
      button.callback();
    }
    this.onClose();
  }
}
