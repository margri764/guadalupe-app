import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDioceseModalComponent } from './edit-diocese-modal.component';

describe('EditDioceseModalComponent', () => {
  let component: EditDioceseModalComponent;
  let fixture: ComponentFixture<EditDioceseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDioceseModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditDioceseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
