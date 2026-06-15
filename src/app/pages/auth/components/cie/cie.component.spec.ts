import { ComponentFixture, TestBed } from '@angular/core/testing'
import { DEPLOY_URL } from 'src/constants'
import { CieComponent } from './cie.component'

describe('CieComponent', () => {
  let component: CieComponent
  let fixture: ComponentFixture<CieComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CieComponent],
      providers: [{ provide: DEPLOY_URL, useValue: '/' }],
    }).compileComponents()

    fixture = TestBed.createComponent(CieComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
