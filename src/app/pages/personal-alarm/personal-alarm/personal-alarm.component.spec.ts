import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalAlarmComponent } from './personal-alarm.component';

describe('PersonalAlarmComponent', () => {
  let component: PersonalAlarmComponent;
  let fixture: ComponentFixture<PersonalAlarmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalAlarmComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonalAlarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
