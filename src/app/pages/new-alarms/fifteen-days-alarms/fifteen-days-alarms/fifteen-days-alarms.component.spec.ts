import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FifteenDaysAlarmsComponent } from './fifteen-days-alarms.component';

describe('FifteenDaysAlarmsComponent', () => {
  let component: FifteenDaysAlarmsComponent;
  let fixture: ComponentFixture<FifteenDaysAlarmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FifteenDaysAlarmsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FifteenDaysAlarmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
