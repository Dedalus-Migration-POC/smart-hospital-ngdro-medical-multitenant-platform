import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyidComponent } from './myid.component';

describe('MyidComponent', () => {
  let component: MyidComponent;
  let fixture: ComponentFixture<MyidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyidComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
