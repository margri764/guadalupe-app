import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignUsersgroupComponent } from './assign-usersgroup.component';

describe('AssignUsersgroupComponent', () => {
  let component: AssignUsersgroupComponent;
  let fixture: ComponentFixture<AssignUsersgroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignUsersgroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignUsersgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
