import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SevenDaysAlarmsComponent } from './seven-days-alarms.component';

describe('SevenDaysAlarmsComponent', () => {
  let component: SevenDaysAlarmsComponent;
  let fixture: ComponentFixture<SevenDaysAlarmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SevenDaysAlarmsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SevenDaysAlarmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
