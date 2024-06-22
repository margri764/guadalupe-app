import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPropulsaoModalComponent } from './edit-propulsao-modal.component';

describe('EditPropulsaoModalComponent', () => {
  let component: EditPropulsaoModalComponent;
  let fixture: ComponentFixture<EditPropulsaoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPropulsaoModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditPropulsaoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
