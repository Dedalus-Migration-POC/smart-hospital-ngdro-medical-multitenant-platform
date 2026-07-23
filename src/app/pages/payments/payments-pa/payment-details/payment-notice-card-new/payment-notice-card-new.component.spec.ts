import { ComponentFixture, TestBed } from '@angular/core/testing'
import { PaymentNoticeCardNewComponent } from './payment-notice-card-new.component'

describe('PaymentNoticeCardNewComponent', () => {
  let component: PaymentNoticeCardNewComponent
  let fixture: ComponentFixture<PaymentNoticeCardNewComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentNoticeCardNewComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(PaymentNoticeCardNewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
