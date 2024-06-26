import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignFonteDrawerComponent } from './assign-fonte-drawer.component';

describe('AssignFonteDrawerComponent', () => {
  let component: AssignFonteDrawerComponent;
  let fixture: ComponentFixture<AssignFonteDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignFonteDrawerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignFonteDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
