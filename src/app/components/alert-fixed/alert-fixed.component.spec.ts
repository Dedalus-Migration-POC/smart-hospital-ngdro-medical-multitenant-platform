import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TranslateModule } from '@ngx-translate/core'
import { AlertFixedComponent } from './alert-fixed.component'

describe('AlertFixedComponent', () => {
  let component: AlertFixedComponent
  let fixture: ComponentFixture<AlertFixedComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertFixedComponent],
      imports: [TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()

    fixture = TestBed.createComponent(AlertFixedComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
