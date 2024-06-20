import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirtyDaysAlarmsComponent } from './thirty-days-alarms.component';

describe('ThirtyDaysAlarmsComponent', () => {
  let component: ThirtyDaysAlarmsComponent;
  let fixture: ComponentFixture<ThirtyDaysAlarmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirtyDaysAlarmsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThirtyDaysAlarmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
