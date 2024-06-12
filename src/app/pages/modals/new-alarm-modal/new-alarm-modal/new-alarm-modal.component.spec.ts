import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAlarmModalComponent } from './new-alarm-modal.component';

describe('NewAlarmModalComponent', () => {
  let component: NewAlarmModalComponent;
  let fixture: ComponentFixture<NewAlarmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewAlarmModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewAlarmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
