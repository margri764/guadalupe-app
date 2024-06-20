import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextAlarmsComponent } from './next-alarms.component';

describe('NextAlarmsComponent', () => {
  let component: NextAlarmsComponent;
  let fixture: ComponentFixture<NextAlarmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NextAlarmsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NextAlarmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
