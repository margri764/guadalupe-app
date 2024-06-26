import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignDioceseDrawerComponent } from './assign-diocese-drawer.component';

describe('AssignDioceseDrawerComponent', () => {
  let component: AssignDioceseDrawerComponent;
  let fixture: ComponentFixture<AssignDioceseDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignDioceseDrawerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignDioceseDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
