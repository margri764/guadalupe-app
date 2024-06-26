import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignAdminDrawerComponent } from './assign-admin-drawer.component';

describe('AssignAdminDrawerComponent', () => {
  let component: AssignAdminDrawerComponent;
  let fixture: ComponentFixture<AssignAdminDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignAdminDrawerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignAdminDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
